-- AUROS Copilot drafts inbox (human approve before any catalog/content merge).

create table if not exists public.copilot_drafts (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('catalog', 'content')),
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  title text not null,
  rationale text not null default '',
  proposed_patch jsonb not null default '{}'::jsonb,
  confidence double precision not null default 0
    check (confidence >= 0 and confidence <= 1),
  product_id text,
  apply_result text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  review_note text
);

create index if not exists copilot_drafts_status_idx
  on public.copilot_drafts (status);

create index if not exists copilot_drafts_kind_idx
  on public.copilot_drafts (kind);

create index if not exists copilot_drafts_created_at_idx
  on public.copilot_drafts (created_at desc);

alter table public.copilot_drafts enable row level security;

comment on table public.copilot_drafts is
  'AUROS Copilot agent drafts — pending human review; service role only';
