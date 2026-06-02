-- Public stats for AUROS Academy certifications (no PII — cert_id only)
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
