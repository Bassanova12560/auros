-- AUROS Watts Reserve intents (step 1 — pending_confirm only; no CFU mint).

create table if not exists public.watt_reservations (
  id uuid primary key default gen_random_uuid(),
  key_hash text not null,
  status text not null default 'pending_confirm'
    check (status in ('pending_confirm', 'cancelled')),
  profile jsonb not null default '{}'::jsonb,
  match_score integer not null default 0
    check (match_score >= 0 and match_score <= 100),
  match_reasons jsonb not null default '[]'::jsonb,
  suggested_unit_kind text not null
    check (suggested_unit_kind in ('e', 'f')),
  created_at timestamptz not null default now()
);

create index if not exists watt_reservations_key_hash_idx
  on public.watt_reservations (key_hash, created_at desc);

create index if not exists watt_reservations_status_idx
  on public.watt_reservations (status);

alter table public.watt_reservations enable row level security;

comment on table public.watt_reservations is
  'AUROS Watts Reserve intents — profile matching before CFU confirm; service role only';
