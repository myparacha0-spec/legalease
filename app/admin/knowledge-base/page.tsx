import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getAuthState } from "@/lib/auth/profile";
import { AdminKnowledgeBase } from "@/components/legal-ai/admin-knowledge-base";

export const metadata: Metadata = {
  title: "Knowledge base — Admin",
  description: "Verify and manage the LegalEase legal knowledge base.",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export interface AdminDocumentRow {
  id: string;
  title: string;
  normalized_title: string;
  document_type: string;
  category: string;
  jurisdiction_level: string;
  province: string | null;
  year: number | null;
  version_label: string | null;
  verification_status: string;
  processing_status: string;
  requires_review: boolean;
  page_count: number | null;
  chunk_count: number | null;
  created_at: string;
  updated_at: string;
}

export default async function AdminKnowledgeBasePage() {
  const { user, profile } = await getAuthState();
  if (!user) redirect("/login");
  if (!profile || profile.role !== "admin") redirect("/");

  const supabase = await createClient();
  if (!supabase) redirect("/");

  const [docsResult, countsResult] = await Promise.all([
    supabase
      .from("legal_documents")
      .select(
        "id, title, normalized_title, document_type, category, jurisdiction_level, province, year, version_label, verification_status, processing_status, requires_review, page_count, created_at, updated_at"
      )
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("legal_documents")
      .select("verification_status, processing_status")
      .limit(1_000_000),
  ]);

  const documentIds = (docsResult.data ?? []).map((d) => d.id);

  const chunkCounts = new Map<string, number>();
  if (documentIds.length > 0) {
    const chunksResult = await supabase
      .from("legal_chunks")
      .select("document_id")
      .in("document_id", documentIds);
    for (const row of chunksResult.data ?? []) {
      const id = String(row.document_id);
      chunkCounts.set(id, (chunkCounts.get(id) ?? 0) + 1);
    }
  }

  const documents: AdminDocumentRow[] = (docsResult.data ?? []).map((d) => ({
    ...(d as Omit<AdminDocumentRow, "chunk_count">),
    chunk_count: chunkCounts.get(d.id) ?? 0,
  }));

  const allDocs = countsResult.data ?? [];
  const stats = {
    total: allDocs.length,
    verified: allDocs.filter((d) => d.verification_status === "verified").length,
    pending: allDocs.filter((d) => d.verification_status === "pending").length,
    needs_review: allDocs.filter((d) => d.verification_status === "needs_review").length,
    failed: allDocs.filter(
      (d) => d.processing_status === "failed" || d.verification_status === "failed"
    ).length,
    ready: allDocs.filter((d) => d.processing_status === "ready").length,
    chunksIndexed: documents.reduce((sum, d) => sum + (d.chunk_count ?? 0), 0),
  };

  return <AdminKnowledgeBase documents={documents} stats={stats} />;
}