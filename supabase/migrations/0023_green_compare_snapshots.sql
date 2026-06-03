-- Compare share snapshots (30-day TTL, server-side state)
create table if not exists public.green_compare_snapshots (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);

comment on table public.green_compare_snapshots is
  'Short-lived compare state: countries, marketplace offer ids, optional RWA row ids';

create index if not exists green_compare_snapshots_expires_idx
  on public.green_compare_snapshots (expires_at);

alter table public.green_compare_snapshots enable row level security;
