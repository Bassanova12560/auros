-- AUROS Green Marketplace MVP — external_id + denormalized offer fields for public listings

alter table public.green_market_assets
  add column if not exists external_id text;

create unique index if not exists green_market_assets_external_id_idx
  on public.green_market_assets (external_id)
  where external_id is not null;

alter table public.green_market_offers
  add column if not exists external_id text,
  add column if not exists actor_name text,
  add column if not exists city text,
  add column if not exists lat double precision,
  add column if not exists lon double precision;

create unique index if not exists green_market_offers_external_id_idx
  on public.green_market_offers (external_id)
  where external_id is not null;

create index if not exists green_market_offers_created_idx
  on public.green_market_offers (created_at desc);
