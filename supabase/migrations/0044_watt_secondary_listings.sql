-- Watts Reserve étape 5 — secondary listings + RWA prep hooks.

create table if not exists public.watt_secondary_listings (
  id uuid primary key default gen_random_uuid(),
  key_hash text not null,
  status text not null default 'open'
    check (status in ('open', 'withdrawn', 'closed')),
  reservation_id uuid,
  cfu_unit_id text,
  cfu_verify_url text,
  indicative_price_eur numeric not null
    check (indicative_price_eur > 0),
  compare_ref_id text,
  label text,
  note text,
  energy_kwh numeric,
  capacity_kw numeric,
  zone jsonb not null default '{}'::jsonb,
  firmness text not null
    check (firmness in ('firm', 'flex')),
  interest_count integer not null default 0
    check (interest_count >= 0),
  created_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

create index if not exists watt_secondary_listings_status_created_idx
  on public.watt_secondary_listings (status, created_at desc);

create index if not exists watt_secondary_listings_key_hash_idx
  on public.watt_secondary_listings (key_hash, created_at desc);

alter table public.watt_secondary_listings enable row level security;

comment on table public.watt_secondary_listings is
  'AUROS Watts Reserve secondary listings — indicative only, not a securities exchange; service role only';
