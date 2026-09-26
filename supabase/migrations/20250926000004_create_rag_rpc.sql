-- ============================================================================
-- LegalEase — 0005 · Retrieval RPC (match_legal_chunks) + debug RPC
-- ----------------------------------------------------------------------------
-- match_legal_chunks is the ONLY retrieval path for citizen answers. It is
-- security definer so it can read embeddings without RLS, but it hard-filters
-- to verification_status = 'verified' AND processing_status = 'ready' AND
-- is_active = true AND is_repealed = false.
--
-- match_legal_chunks_debug additionally exposes pending/needs_review docs and
-- is intended for developer/admin RAG debugging only — execute is revoked from
-- anon/authenticated and granted exclusively to service_role.
-- ============================================================================

create or replace function public.match_legal_chunks(
  query_embedding vector,
  match_count int default 8,
  similarity_threshold float default 0.35,
  p_category text default null,
  p_jurisdiction_level text default null,
  p_province text default null,
  p_document_id uuid default null
)
returns table (
  chunk_id uuid,
  document_id uuid,
  document_title text,
  content text,
  section_number text,
  article_number text,
  section_title text,
  page_number integer,
  category text,
  jurisdiction_level text,
  province text,
  official_source_url text,
  version_label text,
  similarity float
)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  select
    c.id                    as chunk_id,
    d.id                    as document_id,
    d.title                 as document_title,
    c.content               as content,
    c.section_number        as section_number,
    c.article_number        as article_number,
    c.section_title         as section_title,
    c.page_number           as page_number,
    d.category              as category,
    d.jurisdiction_level    as jurisdiction_level,
    d.province              as province,
    d.official_source_url   as official_source_url,
    d.version_label         as version_label,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.legal_chunks c
  join public.legal_documents d on d.id = c.document_id
  where d.verification_status = 'verified'
    and d.processing_status = 'ready'
    and d.is_active = true
    and d.is_repealed = false
    and (1 - (c.embedding <=> query_embedding)) >= similarity_threshold
    and (p_category is null or d.category = p_category)
    and (p_jurisdiction_level is null or d.jurisdiction_level = p_jurisdiction_level)
    and (p_province is null or d.province = p_province)
    and (p_document_id is null or d.id = p_document_id)
  order by c.embedding <=> query_embedding
  limit match_count;
end;
$$;

create or replace function public.match_legal_chunks_debug(
  query_embedding vector,
  match_count int default 8,
  similarity_threshold float default 0.2,
  p_category text default null,
  p_jurisdiction_level text default null,
  p_province text default null,
  p_document_id uuid default null
)
returns table (
  chunk_id uuid,
  document_id uuid,
  document_title text,
  content text,
  section_number text,
  article_number text,
  section_title text,
  page_number integer,
  category text,
  jurisdiction_level text,
  province text,
  official_source_url text,
  version_label text,
  verification_status text,
  processing_status text,
  requires_review boolean,
  similarity float
)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  select
    c.id                    as chunk_id,
    d.id                    as document_id,
    d.title                 as document_title,
    c.content               as content,
    c.section_number        as section_number,
    c.article_number        as article_number,
    c.section_title         as section_title,
    c.page_number           as page_number,
    d.category              as category,
    d.jurisdiction_level    as jurisdiction_level,
    d.province              as province,
    d.official_source_url   as official_source_url,
    d.version_label         as version_label,
    d.verification_status   as verification_status,
    d.processing_status     as processing_status,
    d.requires_review       as requires_review,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.legal_chunks c
  join public.legal_documents d on d.id = c.document_id
  where (1 - (c.embedding <=> query_embedding)) >= similarity_threshold
    and (p_category is null or d.category = p_category)
    and (p_jurisdiction_level is null or d.jurisdiction_level = p_jurisdiction_level)
    and (p_province is null or d.province = p_province)
    and (p_document_id is null or d.id = p_document_id)
  order by c.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Debug RPC must never be callable by normal anon/authenticated clients.
revoke execute on function public.match_legal_chunks_debug(vector, int, float, text, text, text, uuid) from public, anon, authenticated;
grant execute on function public.match_legal_chunks_debug(vector, int, float, text, text, text, uuid) to service_role;