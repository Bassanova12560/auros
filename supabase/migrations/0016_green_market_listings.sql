-- AUROS Green Marketplace — listing tiers, moderation, public read filter

alter table public.green_market_assets
  add column if not exists listing_tier text not null default 'referenced'
    check (listing_tier in ('demo', 'referenced', 'verified'));

alter table public.green_market_offers
  add column if not exists listing_tier text not null default 'referenced'
    check (listing_tier in ('demo', 'referenced', 'verified')),
  add column if not exists contact_email text;

-- Public discovery: published listings only
drop policy if exists "green_market_assets_public_read" on public.green_market_assets;
create policy "green_market_assets_public_read"
  on public.green_market_assets for select
  using (status = 'available');

drop policy if exists "green_market_offers_public_read" on public.green_market_offers;
create policy "green_market_offers_public_read"
  on public.green_market_offers for select
  using (status = 'available');
