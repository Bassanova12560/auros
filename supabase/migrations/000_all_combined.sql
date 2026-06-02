-- AUROS — run once in Supabase SQL Editor (Dashboard → SQL → New query)
-- Idempotent: safe to re-run if a step already applied.

-- 0001 dossiers
create table if not exists public.dossiers (
  id          uuid primary key default gen_random_uuid(),
  user_id     text not null,
  asset_type  text,
  data        jsonb not null default '{}'::jsonb,
  score       integer,
  status      text not null default 'draft',
  created_at  timestamptz not null default now()
);

create index if not exists dossiers_user_id_created_at_idx
  on public.dossiers (user_id, created_at desc);

alter table public.dossiers
  add column if not exists submitted_at timestamptz,
  add column if not exists review_note text;

alter table public.dossiers drop constraint if exists dossiers_status_check;
alter table public.dossiers
  add constraint dossiers_status_check
  check (status in (
    'draft', 'generated', 'submitted', 'in_review', 'needs_info', 'approved'
  ));

alter table public.dossiers enable row level security;

-- 0002 leads, concierge, partners, shares
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null,
  asset_type text,
  score integer,
  consent boolean not null default false,
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

-- 0003 consent column (if leads existed before without it)
alter table public.leads
  add column if not exists consent boolean not null default false;

-- 0004 dossier files (data room)
create table if not exists public.dossier_files (
  id            uuid primary key default gen_random_uuid(),
  dossier_id    uuid not null references public.dossiers(id) on delete cascade,
  user_id       text not null,
  document_id   text not null,
  file_name     text not null,
  storage_path  text not null,
  mime_type     text,
  size_bytes    bigint not null default 0,
  created_at    timestamptz not null default now()
);

create index if not exists dossier_files_dossier_id_idx
  on public.dossier_files (dossier_id, document_id);

alter table public.dossier_files enable row level security;

-- 0007 academy reminder prefs
create table if not exists public.academy_reminder_prefs (
  id                  uuid primary key default gen_random_uuid(),
  email               text not null,
  cert_id             text not null,
  cert_token          text not null,
  first_name          text,
  tier                text not null default 'fundamentals',
  expires_at          timestamptz not null,
  locale              text not null default 'fr',
  reminders_enabled   boolean not null default true,
  reminder_14_sent_at timestamptz,
  reminder_3_sent_at  timestamptz,
  unsubscribe_token   text not null unique,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (cert_id, email)
);

create index if not exists academy_reminder_prefs_enabled_expires_idx
  on public.academy_reminder_prefs (reminders_enabled, expires_at)
  where reminders_enabled = true;

create index if not exists academy_reminder_prefs_unsub_idx
  on public.academy_reminder_prefs (unsubscribe_token);

alter table public.academy_reminder_prefs enable row level security;

-- 0008 academy consumed sessions (anti-replay)
create table if not exists public.academy_consumed_sessions (
  session_id   text primary key,
  kind         text not null check (kind in ('challenge', 'renewal')),
  consumed_at  timestamptz not null default now()
);

create index if not exists academy_consumed_sessions_consumed_idx
  on public.academy_consumed_sessions (consumed_at desc);

alter table public.academy_consumed_sessions enable row level security;

-- 0009 academy diploma PDF purchases
create table if not exists public.academy_diploma_purchases (
  id                  text primary key,
  product_type        text not null check (product_type in ('individual', 'institution')),
  cert_id             text,
  cert_snapshot       jsonb,
  organization_name   text,
  contact_email       text not null,
  contact_name        text,
  stripe_session_id   text not null unique,
  stripe_payment_intent text,
  amount_cents        integer not null,
  purchased_at        timestamptz not null default now()
);

create index if not exists academy_diploma_purchases_cert_idx
  on public.academy_diploma_purchases (cert_id)
  where cert_id is not null;

create index if not exists academy_diploma_purchases_email_idx
  on public.academy_diploma_purchases (contact_email);

alter table public.academy_diploma_purchases enable row level security;

-- 0010 academy cert registry (aggregate stats, no PII)
create table if not exists public.academy_cert_registry (
  cert_id             text primary key,
  tier                text not null check (tier in ('fundamentals', 'praticien', 'entreprise')),
  issued_at           timestamptz not null,
  expires_at          timestamptz not null,
  curriculum_version  text not null,
  integrity_level     smallint not null default 2,
  renewal_generation  smallint not null default 0,
  created_at          timestamptz not null default now()
);

create index if not exists academy_cert_registry_expires_idx
  on public.academy_cert_registry (expires_at desc);

create index if not exists academy_cert_registry_tier_idx
  on public.academy_cert_registry (tier);

alter table public.academy_cert_registry enable row level security;

-- 0011 green label applications
create table if not exists public.green_label_applications (
  id              uuid primary key default gen_random_uuid(),
  project_name    text not null,
  project_type    text not null check (project_type in ('solar', 'wind', 'rec', 'carbon', 'ppa', 'other')),
  contact_name    text not null,
  email           text not null,
  website         text not null,
  country         text not null,
  description     text not null,
  status          text not null default 'pending' check (status in ('pending', 'in_review', 'approved', 'rejected')),
  created_at      timestamptz not null default now()
);

create index if not exists green_label_applications_created_idx
  on public.green_label_applications (created_at desc);

create index if not exists green_label_applications_status_idx
  on public.green_label_applications (status);

alter table public.green_label_applications enable row level security;

-- 0012 green registry + praticien waitlist
create table if not exists public.green_registry_projects (
  id              text primary key,
  name            text not null,
  project_type    text not null check (project_type in ('solar', 'wind', 'rec', 'carbon', 'ppa', 'other')),
  country         text not null,
  label_tier      text not null check (label_tier in ('verified', 'pilot')),
  certified_at    timestamptz not null,
  verify_token    text not null unique,
  summary_fr      text not null,
  summary_en      text not null,
  summary_es      text not null,
  website         text,
  created_at      timestamptz not null default now()
);

create index if not exists green_registry_projects_certified_idx
  on public.green_registry_projects (certified_at desc);

create index if not exists green_registry_projects_tier_idx
  on public.green_registry_projects (label_tier);

create table if not exists public.green_registry_experts (
  id              text primary key,
  display_name    text not null,
  certified_at    timestamptz not null,
  verify_token    text not null unique,
  specialty       text,
  created_at      timestamptz not null default now()
);

create table if not exists public.green_praticien_waitlist (
  id                    uuid primary key default gen_random_uuid(),
  full_name             text not null,
  email                 text not null,
  organization          text,
  fundamentals_cert_id  text,
  message               text,
  locale                text not null default 'fr',
  created_at            timestamptz not null default now()
);

create index if not exists green_praticien_waitlist_created_idx
  on public.green_praticien_waitlist (created_at desc);

alter table public.green_registry_projects enable row level security;
alter table public.green_registry_experts enable row level security;
alter table public.green_praticien_waitlist enable row level security;

-- 0013 green phase 3 — verified publish link + praticien certs
alter table public.green_label_applications
  add column if not exists registry_project_id text,
  add column if not exists reviewed_at timestamptz;

alter table public.green_registry_projects
  add column if not exists source_application_id uuid references public.green_label_applications(id);

create table if not exists public.green_praticien_certs (
  cert_id         text primary key,
  display_name    text not null,
  email           text not null,
  verify_token    text not null unique,
  score           smallint not null,
  quiz_total      smallint not null,
  issued_at       timestamptz not null default now(),
  expires_at      timestamptz not null,
  locale          text not null default 'fr'
);

create index if not exists green_praticien_certs_expires_idx
  on public.green_praticien_certs (expires_at desc);

alter table public.green_praticien_certs enable row level security;

insert into public.green_registry_projects (
  id, name, project_type, country, label_tier, certified_at, verify_token,
  summary_fr, summary_en, summary_es, website
) values (
  'verified-solar-aggregation-pt',
  'Auros Green Verified — Agrégation solaire (Portugal)',
  'solar',
  'Portugal',
  'verified',
  '2026-05-31T12:00:00Z',
  'ag-verified-solar-pt-2026',
  'Premier label Verified AUROS Green — revue RTMS complète sur dossier agrégation solaire anonymisé (PPA + traçabilité MWh). Audit documentaire validé ; pas de promesse de rendement.',
  'First Auros Green Verified label — full RTMS review on anonymized solar aggregation dossier (PPA + MWh traceability). Document audit passed; no return promise.',
  'Primer label Verified AUROS Green — revisión RTMS completa sobre dossier anonimizado de agregación solar (PPA + trazabilidad MWh). Auditoría documental validada; sin promesa de rendimiento.',
  null
)
on conflict (id) do nothing;
