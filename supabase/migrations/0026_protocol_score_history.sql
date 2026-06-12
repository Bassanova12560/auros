-- AUROS Protocol — score history sessions (roadmap item #7)
-- Service role only (RLS enabled, no public policies — same pattern as protocol_monitors).

create table if not exists public.protocol_score_history (
  id          bigserial primary key,
  score_id    text not null,
  key_hash    text not null,
  score       integer not null check (score >= 0 and score <= 100),
  grade       text not null,
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists protocol_score_history_score_id_idx
  on public.protocol_score_history (score_id, created_at desc);

create index if not exists protocol_score_history_key_hash_idx
  on public.protocol_score_history (key_hash, created_at desc);

alter table public.protocol_score_history enable row level security;

comment on table public.protocol_score_history is
  'AUROS Protocol score history per session (score_id) or monitor — service role only';
