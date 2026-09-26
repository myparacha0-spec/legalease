/**
 * Reusable document-processing pipeline: legal-aware chunking → embeddings →
 * storage. Used by the CLI ingestion script and the admin reprocess action so
 * both share identical behavior.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { chunkLegalText, type ChunkingOptions, type ExtractedPage } from "@/lib/rag/chunking";
import { generateEmbeddings } from "@/lib/ai/embeddings";

export interface PipelineResult {
  chunkCount: number;
  embeddingsGenerated: number;
  pageCount: number;
}

export interface ProcessDocumentOptions {
  chunking?: ChunkingOptions;
  /** Replace any previously stored chunks (admin reprocessing). Default true. */
  replaceChunks?: boolean;
}

function estimateTokens(text: string): number {
  return Math.max(1, Math.round(text.length / 4));
}

/** pgvector literal ("[0.1,0.2,...]") — PostgREST casts this reliably. */
function vectorLiteral(vector: number[]): string {
  return `[${vector.join(",")}]`;
}

/**
 * Chunk + embed + store a document's extracted pages and flip processing
 * status to "ready". On failure the document is marked "failed" and the error
 * recorded in metadata.error_message.
 */
export async function processDocumentText(
  supabase: SupabaseClient,
  documentId: string,
  pages: ExtractedPage[],
  options: ProcessDocumentOptions = {}
): Promise<PipelineResult> {
  const docRef = supabase.from("legal_documents");

  const fail = async (message: string): Promise<never> => {
    const existing = await docRef.select("metadata").eq("id", documentId).maybeSingle();
    const metadata =
      (existing.data?.metadata as Record<string, unknown> | null | undefined) ?? {};
    await docRef.update({
      processing_status: "failed",
      requires_review: true,
      metadata: { ...metadata, error_message: message, error_at: new Date().toISOString() },
    }).eq("id", documentId);
    throw new Error(message);
  };

  await docRef.update({ processing_status: "chunking" }).eq("id", documentId);

  const chunks = chunkLegalText(pages, options.chunking);
  if (chunks.length === 0) {
    return fail("No usable chunks could be produced from the extracted text.");
  }

  await docRef.update({ processing_status: "embedding" }).eq("id", documentId);

  let vectors: number[][];
  try {
    vectors = await generateEmbeddings(chunks.map((c) => c.text));
  } catch (err) {
    return fail(
      `Embedding generation failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (vectors.length !== chunks.length) {
    return fail(
      `Embedding count mismatch (${vectors.length} embeddings for ${chunks.length} chunks). Check EMBEDDING_DIMENSIONS matches the model.`
    );
  }

  // Replace existing chunks when reprocessing.
  if (options.replaceChunks !== false) {
    const { error: deleteError } = await supabase
      .from("legal_chunks")
      .delete()
      .eq("document_id", documentId);
    if (deleteError) return fail(`Failed to clear previous chunks: ${deleteError.message}`);
  }

  const rows = chunks.map((chunk, index) => ({
    document_id: documentId,
    chunk_index: index,
    section_number: chunk.sectionNumber,
    section_title: chunk.sectionTitle,
    article_number: chunk.articleNumber,
    page_number: chunk.pageNumber || null,
    content: chunk.text,
    token_count: estimateTokens(chunk.text),
    embedding: vectorLiteral(vectors[index]),
    metadata: {
      start_page: chunk.startPage,
      end_page: chunk.endPage,
    },
  }));

  const batchSize = 50;
  for (let i = 0; i < rows.length; i += batchSize) {
    const { error } = await supabase
      .from("legal_chunks")
      .insert(rows.slice(i, i + batchSize));
    if (error) return fail(`Failed to store chunks: ${error.message}`);
  }

  const existingMetaRow = await docRef.select("metadata").eq("id", documentId).maybeSingle();
  const existingMetadata =
    (existingMetaRow.data?.metadata as Record<string, unknown> | null | undefined) ?? {};

  const { error: updateError } = await docRef
    .update({
      processing_status: "ready",
      page_count: pages.length,
      metadata: {
        ...existingMetadata,
        chunk_count: rows.length,
        processing_completed_at: new Date().toISOString(),
        error_message: null,
      },
    })
    .eq("id", documentId);

  if (updateError) return fail(`Failed to finalize document: ${updateError.message}`);

  return {
    chunkCount: rows.length,
    embeddingsGenerated: vectors.length,
    pageCount: pages.length,
  };
}