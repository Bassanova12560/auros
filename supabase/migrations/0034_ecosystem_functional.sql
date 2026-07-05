-- Ecosystem gaps: partner registry, embed analytics, waitlists, report signups, label bucket

-- Partner allowlist (empty = open mode — any code ≥2 chars accepted)
create table if not exists public.partner_codes (
  code text primary key,
  label text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists partner_codes_active_idx
  on public.partner_codes (active) where active = true;

alter table public.partner_codes enable row level security;

-- Pilote seeds (safe to re-run)
insert into public.partner_codes (code, label) values
  ('UTILITIES_FR', 'Pilote utilities France'),
  ('CAB-LUX', 'Cabinet Luxembourg'),
  ('FO-GENEVA', 'Family office Genève')
on conflict (code) do nothing;

-- H₂O embed widget events (no email required)
create table if not exists public.partner_embed_events (
  id uuid primary key default gen_random_uuid(),
  partner_code text not null,
  event_type text not null check (event_type in ('h2o_score', 'h2o_passport_cta')),
  rating integer,
  tier text,
  preview_id text,
  locale text,
  created_at timestamptz not null default now()
);

create index if not exists partner_embed_events_code_idx
  on public.partner_embed_events (partner_code, created_at desc);

alter table public.partner_embed_events enable row level security;

-- Academy praticien waitlist (RWA track)
create table if not exists public.academy_waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  track text not null default 'praticien',
  locale text,
  created_at timestamptz not null default now()
);

create index if not exists academy_waitlist_email_idx
  on public.academy_waitlist (email, created_at desc);

alter table public.academy_waitlist enable row level security;

-- State of RWA issuers gated download signups
create table if not exists public.report_download_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text not null,
  edition text not null,
  locale text,
  created_at timestamptz not null default now()
);

create index if not exists report_download_signups_edition_idx
  on public.report_download_signups (edition, created_at desc);

alter table public.report_download_signups enable row level security;

-- Green Label PDF bucket (private)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'green-label-documents',
  'green-label-documents',
  false,
  5242880,
  array['application/pdf']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
