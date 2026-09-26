-- ============================================================================
-- LegalEase — 0003 · RAG knowledge base tables (legal_documents + legal_chunks)
-- ----------------------------------------------------------------------------
-- Legal knowledge available to the AI assistant.
--
-- IMPORTANT — embedding dimension:
--   The `embedding` column in legal_chunks is `vector(1536)`, which MUST match
--   the embedding model configured in EMBEDDING_DIMENSIONS. If you change the
--   embedding model, re-create this column with the correct dimension:
--
--     alter table public.legal_chunks drop column embedding;
--     alter table public.legal_chunks
--       add column embedding extensions.vector(1536);
--
--   then rebuild the HNSW index below and re-run `npm run ingest:legal`.
-- ============================================================================

-- --- legal_documents --------------------------------------------------------

create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  normalized_title text not null,
  short_title text,
  document_type text not null default 'statute'
    check (document_type in ('constitution', 'code', 'statute', 'ordinance', 'rules', 'regulation', 'notification', 'other')),
  category text not null default 'other'
    check (category in ('constitutional', 'criminal', 'criminal_procedure', 'civil_procedure', 'evidence', 'contract', 'family', 'property', 'rent_tenancy', 'consumer', 'employment_labour', 'cybercrime', 'registration', 'other')),
  jurisdiction_level text not null default 'Federal'
    check (jurisdiction_level in ('Federal', 'Provincial', 'Local')),
  province text,
  city text,
  country text not null default 'Pakistan',
  year integer,
  official_source_url text,
  source_authority text,
  storage_path text,
  file_hash text not null,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'verified', 'needs_review', 'rejected')),
  processing_status text not null default 'pending'
    check (processing_status in ('pending', 'extracting', 'chunking', 'embedding', 'ready', 'failed')),
  version_label text,
  effective_date date,
  version_date date,
  is_active boolean not null default true,
  is_repealed boolean not null default false,
  requires_review boolean not null default false,
  page_count integer,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.legal_documents is
  'Verified legal source documents (laws, codes, ordinances) that power the RAG assistant.';

comment on column public.legal_documents.verification_status is
  'pending | verified | needs_review | rejected. Only verified documents are used in citizen-facing retrieval.';
comment on column public.legal_documents.processing_status is
  'pending | extracting | chunking | embedding | ready | failed. ready means chunks+vectors exist.';
comment on column public.legal_documents.requires_review is
  'Set true when duplicate/version collisions are detected and need human review.';
comment on column public.legal_documents.file_hash is
  'SHA-256 of the original file, used to skip duplicate ingestion.';

-- Unique file hash: the same PDF is never ingested twice.
create unique index if not exists legal_documents_file_hash_key
  on public.legal_documents (file_hash);

-- Retrieval path filters (verified + ready) and admin lookups.
create index if not exists legal_documents_verification_status_idx
  on public.legal_documents (verification_status, processing_status, is_active, is_repealed);
create index if not exists legal_documents_category_idx
  on public.legal_documents (category);
create index if not exists legal_documents_jurisdiction_idx
  on public.legal_documents (jurisdiction_level, province);
create index if not exists legal_documents_normalized_title_idx
  on public.legal_documents (normalized_title);

-- updated_at automation (reuses handle_updated_at from migration 0001).
drop trigger if exists legal_documents_set_updated_at on public.legal_documents;
create trigger legal_documents_set_updated_at
  before update on public.legal_documents
  for each row execute function public.handle_updated_at();

-- --- legal_chunks -----------------------------------------------------------

create table if not exists public.legal_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.legal_documents (id) on delete cascade,
  chunk_index integer not null,
  section_number text,
  section_title text,
  article_number text,
  page_number integer,
  content text not null,
  token_count integer,
  embedding extensions.vector(1536),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint legal_chunks_document_index_unique unique (document_id, chunk_index)
);

comment on table public.legal_chunks is
  'Overlapping, section-aware chunks of verified legal documents with embeddings.';

-- HNSW similarity index (cosine distance). `vector_cosine_ops` requires the
-- embedding column dimension to match the embedding model.
create index if not exists legal_chunks_embedding_hnsw_idx
  on public.legal_chunks
  using hnsw (embedding extensions.vector_cosine_ops);

create index if not exists legal_chunks_document_id_idx
  on public.legal_chunks (document_id);
create index if not exists legal_chunks_section_idx
  on public.legal_chunks (section_number, article_number);

-- --- Row Level Security -----------------------------------------------------

alter table public.legal_documents enable row level security;
alter table public.legal_chunks enable row level security;

-- Citizens may only read documents that are safe to surface in answers, and
-- admins may read everything.
drop policy if exists "legal_documents_select_verified_or_admin" on public.legal_documents;
create policy "legal_documents_select_verified_or_admin"
  on public.legal_documents for select
  using (
    (verification_status = 'verified' and processing_status = 'ready' and is_active = true and is_repealed = false)
    or public.is_admin()
  );

-- Only admins may modify knowledge-base metadata. Inserts are done by the
-- ingestion pipeline via the service role (which bypasses RLS).
drop policy if exists "legal_documents_admin_update" on public.legal_documents;
create policy "legal_documents_admin_update"
  on public.legal_documents for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "legal_documents_admin_delete" on public.legal_documents;
create policy "legal_documents_admin_delete"
  on public.legal_documents for delete
  using (public.is_admin());

-- Chunks are read through the match_legal_chunks RPC (security definer), so no
-- non-admin select is granted here. Admins may read/replace chunks.
drop policy if exists "legal_chunks_admin_select" on public.legal_chunks;
create policy "legal_chunks_admin_select"
  on public.legal_chunks for select
  using (public.is_admin());

drop policy if exists "legal_chunks_admin_insert" on public.legal_chunks;
create policy "legal_chunks_admin_insert"
  on public.legal_chunks for insert
  with check (public.is_admin());

drop policy if exists "legal_chunks_admin_update" on public.legal_chunks;
create policy "legal_chunks_admin_update"
  on public.legal_chunks for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "legal_chunks_admin_delete" on public.legal_chunks;
create policy "legal_chunks_admin_delete"
  on public.legal_chunks for delete
  using (public.is_admin());

-- Storage bucket for original legal PDFs. No public/authenticated policies are
-- created, so the bucket is only reachable by the service role (ingestion and
-- admin reprocessing). Citizens never touch it.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'legal-documents',
  'legal-documents',
  false,
  104857600,
  array['application/pdf', 'text/plain', 'text/markdown']
)
on conflict (id) do nothing;