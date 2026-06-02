-- AUROS Green Marketplace — country for worldwide actors & offers

alter table public.green_market_assets
  add column if not exists country text;

alter table public.green_market_offers
  add column if not exists country text;

update public.green_market_assets
set country = 'France'
where country is null and city is not null;

update public.green_market_offers
set country = 'France'
where country is null and city is not null;

create index if not exists green_market_assets_country_idx
  on public.green_market_assets (country);
