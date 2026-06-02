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
  drop constraint if exists dossiers_status_check;
alter table public.dossiers
  add  constraint dossiers_status_check
       check (status in ('draft', 'generated', 'submitted'));

alter table public.dossiers enable row level security;
