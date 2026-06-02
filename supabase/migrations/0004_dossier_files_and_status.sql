-- Dossier files (data room uploads) + extended review statuses

alter table public.dossiers
  add column if not exists submitted_at timestamptz,
  add column if not exists review_note text;

alter table public.dossiers drop constraint if exists dossiers_status_check;
alter table public.dossiers
  add constraint dossiers_status_check
  check (status in (
    'draft',
    'generated',
    'submitted',
    'in_review',
    'needs_info',
    'approved'
  ));

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

-- Storage bucket (Dashboard → Storage → New bucket "dossier-files", private)
-- Server uploads via SUPABASE_SECRET_KEY. Optional SQL if storage schema exists:
-- insert into storage.buckets (id, name, public) values ('dossier-files', 'dossier-files', false) on conflict do nothing;
