-- Leads, concierge, partners, public dossier shares (run in Supabase SQL editor)

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null,
  asset_type text,
  score integer,
  created_at timestamptz default now()
);

create table if not exists public.concierge_requests (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null,
  phone text,
  message text,
  asset_type text,
  value numeric,
  score integer,
  created_at timestamptz default now()
);

create table if not exists public.partner_requests (
  id uuid primary key default gen_random_uuid(),
  company text,
  contact_name text,
  email text not null,
  platform_type text,
  volume text,
  message text,
  created_at timestamptz default now()
);

create table if not exists public.dossier_shares (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  dossier_data jsonb not null,
  asset_type text,
  score integer,
  views integer default 0,
  created_at timestamptz default now(),
  expires_at timestamptz default now() + interval '30 days'
);

alter table public.leads enable row level security;
alter table public.concierge_requests enable row level security;
alter table public.partner_requests enable row level security;
alter table public.dossier_shares enable row level security;
