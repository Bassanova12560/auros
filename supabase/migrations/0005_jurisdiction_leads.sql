-- Jurisdiction comparator leads (guide + quote)
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

create index if not exists jurisdiction_leads_kind_created_at_idx
  on public.jurisdiction_leads (kind, created_at desc);

alter table public.jurisdiction_leads enable row level security;
