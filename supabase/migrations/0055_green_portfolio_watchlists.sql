-- Portfolio watchlists for daily alert digests (service role)

create table if not exists public.green_portfolio_watchlists (
  id                      uuid primary key default gen_random_uuid(),
  email                   text not null unique,
  asset_dna_ids           text[] not null default '{}',
  locale                  text not null default 'fr',
  active                  boolean not null default true,
  last_digest_at          timestamptz,
  last_digest_fingerprint text,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists green_portfolio_watchlists_active_idx
  on public.green_portfolio_watchlists (active)
  where active = true;

alter table public.green_portfolio_watchlists enable row level security;

comment on table public.green_portfolio_watchlists is
  'AUROS Green portfolio watchlists — digest subscriptions, service role only';
