-- AUROS Green Marketplace — actifs locaux, offres, transactions (MVP schema)

create table if not exists public.green_market_users (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  role        text not null check (role in ('producer', 'storer', 'charger', 'consumer', 'buyer', 'admin')),
  created_at  timestamptz not null default now()
);

create table if not exists public.green_market_assets (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references public.green_market_users(id) on delete set null,
  type            text not null check (type in ('producer', 'storer', 'charger', 'consumer')),
  lat             double precision not null,
  lon             double precision not null,
  capacity_kwh    numeric not null check (capacity_kwh >= 0),
  price_per_kwh   numeric check (price_per_kwh is null or price_per_kwh >= 0),
  energy_type     text not null check (energy_type in ('solar', 'wind', 'hydro', 'battery', 'mixed')),
  is_certified    boolean not null default false,
  status          text not null default 'available' check (status in ('available', 'pending')),
  name            text not null,
  city            text not null,
  region          text,
  description     text,
  contact_email   text,
  created_at      timestamptz not null default now()
);

create index if not exists green_market_assets_type_idx on public.green_market_assets (type);
create index if not exists green_market_assets_geo_idx on public.green_market_assets (lat, lon);

create table if not exists public.green_market_offers (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid references public.green_market_assets(id) on delete cascade,
  volume_kwh      numeric not null check (volume_kwh > 0),
  price_per_kwh   numeric not null check (price_per_kwh >= 0),
  side            text not null check (side in ('sell', 'buy')),
  energy_type     text not null check (energy_type in ('solar', 'wind', 'hydro', 'battery', 'mixed')),
  start_date      date,
  end_date        date,
  status          text not null default 'available' check (status in ('available', 'pending', 'closed')),
  created_at      timestamptz not null default now()
);

create index if not exists green_market_offers_side_idx on public.green_market_offers (side, status);

create table if not exists public.green_market_transactions (
  id              uuid primary key default gen_random_uuid(),
  buyer_id        uuid references public.green_market_users(id) on delete set null,
  seller_id       uuid references public.green_market_users(id) on delete set null,
  offer_id        uuid references public.green_market_offers(id) on delete set null,
  volume_kwh      numeric not null check (volume_kwh > 0),
  price_per_kwh   numeric not null check (price_per_kwh >= 0),
  total_eur       numeric not null check (total_eur >= 0),
  commission_eur  numeric not null default 0 check (commission_eur >= 0),
  status          text not null default 'pending' check (status in ('pending', 'settled', 'cancelled')),
  created_at      timestamptz not null default now()
);

alter table public.green_market_users enable row level security;
alter table public.green_market_assets enable row level security;
alter table public.green_market_offers enable row level security;
alter table public.green_market_transactions enable row level security;

-- Public read for map / marketplace discovery (MVP)
drop policy if exists "green_market_assets_public_read" on public.green_market_assets;
create policy "green_market_assets_public_read"
  on public.green_market_assets for select
  using (true);

drop policy if exists "green_market_offers_public_read" on public.green_market_offers;
create policy "green_market_offers_public_read"
  on public.green_market_offers for select
  using (status in ('available', 'pending'));

-- Authenticated users manage own profile
drop policy if exists "green_market_users_self_read" on public.green_market_users;
create policy "green_market_users_self_read"
  on public.green_market_users for select
  using (auth.uid()::text = id::text);

drop policy if exists "green_market_users_self_insert" on public.green_market_users;
create policy "green_market_users_self_insert"
  on public.green_market_users for insert
  with check (auth.uid()::text = id::text);

-- Asset owners (matched by user_id) can insert/update own assets
drop policy if exists "green_market_assets_owner_write" on public.green_market_assets;
create policy "green_market_assets_owner_write"
  on public.green_market_assets for insert
  with check (user_id is not null and auth.uid() = user_id);

drop policy if exists "green_market_assets_owner_update" on public.green_market_assets;
create policy "green_market_assets_owner_update"
  on public.green_market_assets for update
  using (auth.uid() = user_id);

-- Offer writers via asset ownership
drop policy if exists "green_market_offers_owner_insert" on public.green_market_offers;
create policy "green_market_offers_owner_insert"
  on public.green_market_offers for insert
  with check (
    exists (
      select 1 from public.green_market_assets a
      where a.id = asset_id and a.user_id = auth.uid()
    )
  );

-- Transaction parties can read their rows
drop policy if exists "green_market_transactions_party_read" on public.green_market_transactions;
create policy "green_market_transactions_party_read"
  on public.green_market_transactions for select
  using (auth.uid() = buyer_id or auth.uid() = seller_id);
