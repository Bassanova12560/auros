-- Watts Reserve étape 4 — producer capacity inventory.

create table if not exists public.watt_capacity_offers (
  id uuid primary key default gen_random_uuid(),
  key_hash text not null,
  status text not null default 'open'
    check (status in ('open', 'withdrawn')),
  time_window jsonb not null,
  capacity_kw numeric,
  energy_kwh numeric,
  zone jsonb not null default '{}'::jsonb,
  carbon_intensity_gco2_kwh numeric,
  firmness text not null
    check (firmness in ('firm', 'flex')),
  producer_ref text,
  label text,
  created_at timestamptz not null default now(),
  withdrawn_at timestamptz
);

create index if not exists watt_capacity_offers_status_created_idx
  on public.watt_capacity_offers (status, created_at desc);

create index if not exists watt_capacity_offers_key_hash_idx
  on public.watt_capacity_offers (key_hash, created_at desc);

alter table public.watt_capacity_offers enable row level security;

comment on table public.watt_capacity_offers is
  'AUROS Watts Reserve producer capacity windows — indicative inventory; service role only';
