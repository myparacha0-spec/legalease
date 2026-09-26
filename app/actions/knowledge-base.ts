"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { getAuthState } from "@/lib/auth/profile";
import { extractPdfFromBuffer, PdfExtractionError } from "@/lib/rag/pdf";
import { processDocumentText } from "@/lib/rag/pipeline";

export interface AdminActionResult {
  ok: boolean;
  error?: string;
}

const idSchema = z.uuid();

async function requireAdmin(): Promise<{ ok: false; error: string } | { ok: true }> {
  const { user, profile } = await getAuthState();
  if (!user) return { ok: false, error: "You must be signed in." };
  if (!profile || profile.role !== "admin") {
    return { ok: false, error: "Admin access required." };
  }
  return { ok: true };
}

export async function verifyDocument(id: string): Promise<AdminActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return { ok: false, error: "Invalid document id." };

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured." };

  const { data: current } = await supabase
    .from("legal_documents")
    .select("metadata")
    .eq("id", parsed.data)
    .maybeSingle();
  const metadata = (current?.metadata as Record<string, unknown> | null) ?? {};

  const { error } = await supabase
    .from("legal_documents")
    .update({
      verification_status: "verified",
      requires_review: false,
      metadata: {
        ...metadata,
        review_reason: null,
        reviewed_at: new Date().toISOString(),
      },
    })
    .eq("id", parsed.data);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/knowledge-base");
  return { ok: true };
}

export async function markDocumentNeedsReview(id: string): Promise<AdminActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return { ok: false, error: "Invalid document id." };

  const supabase = await createClient();
  if (!supabase) return { ok: false, error: "Supabase is not configured." };

  const { error } = await supabase
    .from("legal_documents")
    .update({ verification_status: "needs_review" })
    .eq("id", parsed.data);

  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/knowledge-base");
  return { ok: true };
}

export async function deleteDocument(id: string): Promise<AdminActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return { ok: false, error: "Invalid document id." };

  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Service role key is not configured. No delete allowed." };

  const { data: doc } = await admin
    .from("legal_documents")
    .select("storage_path")
    .eq("id", parsed.data)
    .maybeSingle();
  if (!doc) return { ok: false, error: "Document not found." };

  // Remove the original PDF from storage (best effort).
  if (doc.storage_path) {
    await admin.storage.from("legal-documents").remove([doc.storage_path]);
  }

  const { error } = await admin.from("legal_documents").delete().eq("id", parsed.data);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/knowledge-base");
  return { ok: true };
}

/**
 * Re-extract, re-chunk and re-embed a document from its stored original.
 * Requires SUPABASE_SERVICE_ROLE_KEY (storage is service-role only).
 */
export async function reprocessDocument(id: string): Promise<AdminActionResult> {
  const guard = await requireAdmin();
  if (!guard.ok) return guard;

  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return { ok: false, error: "Invalid document id." };

  if (!isAdminConfigured()) {
    return { ok: false, error: "Service role key is not configured for reprocessing." };
  }

  const admin = createAdminClient()!;

  const { data: doc } = await admin
    .from("legal_documents")
    .select("id, storage_path, title")
    .eq("id", parsed.data)
    .maybeSingle();
  if (!doc) return { ok: false, error: "Document not found." };
  if (!doc.storage_path) {
    return { ok: false, error: "No original file was stored for this document." };
  }

  try {
    const { data, error } = await admin.storage
      .from("legal-documents")
      .download(doc.storage_path);
    if (error || !data) {
      throw new Error(`Could not download the original file: ${error?.message ?? "download failed"}`);
    }

    const isText =
      doc.storage_path.toLowerCase().endsWith(".txt") ||
      doc.storage_path.toLowerCase().endsWith(".md") ||
      doc.storage_path.toLowerCase().endsWith(".markdown");

    let pages: Awaited<ReturnType<typeof extractPdfFromBuffer>>["pages"];
    if (isText) {
      const text = Buffer.from(await data.arrayBuffer()).toString("utf8").replace(/\r\n?/g, "\n");
      pages = [{ page: 1, text }];
    } else {
      const buf = Buffer.from(await data.arrayBuffer());
      const extraction = await extractPdfFromBuffer(new Uint8Array(buf));
      pages = extraction.pages;
    }

    await processDocumentText(admin, doc.id, pages, {
      replaceChunks: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (err instanceof PdfExtractionError && err.kind === "ocr_required") {
      await admin
        .from("legal_documents")
        .update({ processing_status: "failed", requires_review: true })
        .eq("id", doc.id);
    }
    return { ok: false, error: message };
  }

  revalidatePath("/admin/knowledge-base");
  return { ok: true };
}