-- AUROS Green — owner linkage (Clerk) + geo alerts

alter table public.green_market_assets
  add column if not exists owner_clerk_id text;

alter table public.green_market_offers
  add column if not exists owner_clerk_id text;

create index if not exists green_market_assets_owner_clerk_idx
  on public.green_market_assets (owner_clerk_id)
  where owner_clerk_id is not null;

create index if not exists green_market_offers_owner_clerk_idx
  on public.green_market_offers (owner_clerk_id)
  where owner_clerk_id is not null;

create table if not exists public.green_market_alerts (
  id              uuid primary key default gen_random_uuid(),
  email           text not null,
  owner_clerk_id  text,
  city            text not null,
  lat             double precision not null,
  lon             double precision not null,
  radius_km       smallint not null default 20 check (radius_km in (5, 10, 20)),
  actor_type      text check (actor_type is null or actor_type in ('producer', 'storer', 'charger', 'consumer')),
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

create index if not exists green_market_alerts_active_idx
  on public.green_market_alerts (active, created_at desc);

alter table public.green_market_alerts enable row level security;
