-- AUROS Green public registry (Phase 2)
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

-- Pilot RTMS case studies (methodology demos — not third-party endorsements)
insert into public.green_registry_projects (
  id, name, project_type, country, label_tier, certified_at, verify_token,
  summary_fr, summary_en, summary_es
) values
(
  'pilot-solar-surplus-eu',
  'Cas pilote RTMS — Surplus solaire (EU)',
  'solar',
  'EU (anonymisé)',
  'pilot',
  '2026-05-29T10:00:00Z',
  'ag-pilot-solar-2026',
  'Dossier RTMS anonymisé — autoconsommation + injection, traçabilité kWh on-chain simulée. Démonstration méthodologique AUROS Green, pas un projet investissable listé.',
  'Anonymized RTMS dossier — self-consumption + feed-in, simulated on-chain kWh traceability. AUROS Green methodology demo, not a listed investable project.',
  'Dossier RTMS anonimizado — autoconsumo + inyección, trazabilidad kWh on-chain simulada. Demostración metodológica AUROS Green, no un proyecto invertible listado.'
),
(
  'pilot-rec-traceability',
  'Cas pilote RTMS — Traçabilité REC',
  'rec',
  'EU (anonymisé)',
  'pilot',
  '2026-05-29T10:00:00Z',
  'ag-pilot-rec-2026',
  'Revue documentaire RTMS sur chaîne REC agrégée — registre off-chain, mapping token, risques de double comptage identifiés. Cas pédagogique interne.',
  'RTMS document review on aggregated REC chain — off-chain registry, token mapping, double-counting risks flagged. Internal pedagogical case.',
  'Revisión documental RTMS sobre cadena REC agregada — registro off-chain, mapeo token, riesgos de doble conteo señalados. Caso pedagógico interno.'
)
on conflict (id) do nothing;
