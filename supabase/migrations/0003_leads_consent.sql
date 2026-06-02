alter table public.leads
  add column if not exists consent boolean not null default false;
