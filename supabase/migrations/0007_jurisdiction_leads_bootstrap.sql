-- Safe bootstrap: table + automation columns (run once in Supabase SQL editor if forms fail)

create table if not exists public.jurisdiction_leads (
  id              uuid primary key default gen_random_uuid(),
  kind            text not null check (kind in ('guide', 'quote')),
  first_name      text not null,
  email           text not null,
  project_type    text,
  jurisdictions   text[] not null default '{}',
  project_value   text,
  message         text,
  ai_brief        text,
  locale          text not null default 'fr',
  created_at      timestamptz not null default now()
);

alter table public.jurisdiction_leads enable row level security;

alter table public.jurisdiction_leads
  add column if not exists status text not null default 'new',
  add column if not exists lead_score integer not null default 0,
  add column if not exists lead_tier text,
  add column if not exists ai_quote text,
  add column if not exists ai_quote_provider text,
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent text,
  add column if not exists paid_at timestamptz,
  add column if not exists paid_tier text,
  add column if not exists nurture_step integer not null default 0,
  add column if not exists last_nurture_at timestamptz,
  add column if not exists deliverable_token text unique,
  add column if not exists starter_kit jsonb,
  add column if not exists starter_kit_plain text,
  add column if not exists starter_kit_provider text,
  add column if not exists delivered_at timestamptz,
  add column if not exists delivery_status text not null default 'pending';

create index if not exists jurisdiction_leads_kind_created_at_idx
  on public.jurisdiction_leads (kind, created_at desc);

create index if not exists jurisdiction_leads_status_nurture_idx
  on public.jurisdiction_leads (status, nurture_step, created_at desc)
  where paid_at is null;
