-- WETS PQC evidence + Shield receipt link

alter table public.wets_projects
  add column if not exists pqc_evidence jsonb not null default '{}'::jsonb,
  add column if not exists shield_receipt_id text;
