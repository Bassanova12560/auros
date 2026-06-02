-- AUROS Green Phase 3 — verified publish link + praticien certs
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

-- First Auros Green Verified (RTMS audit complete — anonymized public dossier)
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
