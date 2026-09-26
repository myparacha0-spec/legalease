-- ============================================================================
-- LegalEase — 0004 · AI assistant chat tables (conversations + messages)
-- ----------------------------------------------------------------------------
-- Citizen chat history. Strictly user-scoped via RLS — a user can only ever
-- read/write their own conversations and messages.
-- ============================================================================

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.conversations is
  'A citizen chat session with the LegalEase AI assistant.';

create index if not exists conversations_user_updated_idx
  on public.conversations (user_id, updated_at desc);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  structured_response jsonb,
  sources jsonb,
  created_at timestamptz not null default now()
);

comment on table public.messages is
  'Turn-level messages within an assistant conversation. structured_response holds the validated LLM JSON; sources holds the retrieved/cited documents shown in the UI.';

create index if not exists messages_conversation_created_idx
  on public.messages (conversation_id, created_at asc);

-- updated_at automation for conversations (reuses handle_updated_at).
drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
  before update on public.conversations
  for each row execute function public.handle_updated_at();

-- --- Row Level Security -----------------------------------------------------

alter table public.conversations enable row level security;
alter table public.messages enable row level security;

create or replace function public.conversation_belongs_to_user(p_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.conversations c
    where c.id = p_conversation_id and c.user_id = auth.uid()
  );
$$;

drop policy if exists "conversations_select_own" on public.conversations;
create policy "conversations_select_own"
  on public.conversations for select
  using (user_id = auth.uid());

drop policy if exists "conversations_insert_own" on public.conversations;
create policy "conversations_insert_own"
  on public.conversations for insert
  with check (user_id = auth.uid());

drop policy if exists "conversations_update_own" on public.conversations;
create policy "conversations_update_own"
  on public.conversations for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "conversations_delete_own" on public.conversations;
create policy "conversations_delete_own"
  on public.conversations for delete
  using (user_id = auth.uid());

drop policy if exists "messages_select_own_conversation" on public.messages;
create policy "messages_select_own_conversation"
  on public.messages for select
  using (public.conversation_belongs_to_user(conversation_id));

drop policy if exists "messages_insert_own_conversation" on public.messages;
create policy "messages_insert_own_conversation"
  on public.messages for insert
  with check (public.conversation_belongs_to_user(conversation_id));