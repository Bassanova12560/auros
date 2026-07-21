-- AUROS Asset Trust Packs assessments

create table if not exists public.trust_pack_assessments (
  id uuid primary key default gen_random_uuid(),
  owner_user_id text,
  pack_id text not null
    check (pack_id in (
      'water_energy',
      'capacity_rights',
      'real_estate',
      'luxury_collectible',
      'vehicle',
      'vessel',
      'sports_rights'
    )),
  name text not null,
  jurisdiction text,
  description text,
  website_url text,
  checklist jsonb not null default '{}'::jsonb,
  evidence jsonb not null default '{}'::jsonb,
  shield_receipt_id text,
  final_score numeric not null default 0
    check (final_score >= 0 and final_score <= 10),
  grade text not null default 'D'
    check (grade in ('A', 'B', 'C', 'D')),
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  public_slug text unique,
  is_demo boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists trust_pack_assessments_owner_idx
  on public.trust_pack_assessments (owner_user_id, updated_at desc);

create index if not exists trust_pack_assessments_published_idx
  on public.trust_pack_assessments (status, pack_id, created_at desc);

alter table public.trust_pack_assessments enable row level security;

create policy trust_pack_assessments_public_read
  on public.trust_pack_assessments for select
  using (status = 'published');

comment on table public.trust_pack_assessments is
  'AUROS Asset Trust Pack assessments — sourced checklist screens for RWA admission.';
