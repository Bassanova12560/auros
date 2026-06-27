-- Repair prod gaps: core ops tables missing on some Supabase projects (idempotent).

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null,
  asset_type text,
  score integer,
  consent boolean not null default false,
  referred_by text,
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

alter table public.dossiers
  add column if not exists submitted_at timestamptz,
  add column if not exists review_note text;

alter table public.dossiers drop constraint if exists dossiers_status_check;
alter table public.dossiers
  add constraint dossiers_status_check
  check (status in (
    'draft', 'generated', 'submitted', 'in_review', 'needs_info', 'approved'
  ));

create table if not exists public.dossier_files (
  id uuid primary key default gen_random_uuid(),
  dossier_id uuid not null references public.dossiers(id) on delete cascade,
  user_id text not null,
  document_id text not null,
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists dossier_files_dossier_id_idx
  on public.dossier_files (dossier_id, document_id);

alter table public.dossier_files enable row level security;

-- Partner attribution (0029) — safe if column already exists
alter table public.leads
  add column if not exists referred_by text;

alter table public.dossiers
  add column if not exists referred_by text;

create index if not exists leads_referred_by_idx
  on public.leads (referred_by)
  where referred_by is not null;

create index if not exists dossiers_referred_by_idx
  on public.dossiers (referred_by)
  where referred_by is not null;
