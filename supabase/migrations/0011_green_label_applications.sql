-- AUROS Green label applications (Phase 1 — document review queue)
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
