-- Asset DNA v1 + Proof Stream v0 (service role; RLS deny public)

alter table public.green_market_assets
  add column if not exists asset_dna_id text;

alter table public.green_registry_projects
  add column if not exists asset_dna_id text;

alter table public.green_label_applications
  add column if not exists asset_dna_id text;

create index if not exists green_market_assets_asset_dna_idx
  on public.green_market_assets (asset_dna_id)
  where asset_dna_id is not null;

create index if not exists green_registry_projects_asset_dna_idx
  on public.green_registry_projects (asset_dna_id)
  where asset_dna_id is not null;

create table if not exists public.asset_dna_records (
  id            text primary key,
  spec_version  text not null default '1.0.0',
  asset_class   text not null,
  display_name  text not null,
  jurisdiction  jsonb not null default '{}'::jsonb,
  origin        jsonb not null default '{}'::jsonb,
  documents     jsonb not null default '[]'::jsonb,
  compliance    jsonb not null default '{}'::jsonb,
  links         jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists asset_dna_records_class_idx
  on public.asset_dna_records (asset_class);

create table if not exists public.proof_stream_events (
  id            text primary key,
  asset_dna_id  text not null,
  action        text not null,
  content_hash  text,
  meta          jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

create index if not exists proof_stream_events_dna_created_idx
  on public.proof_stream_events (asset_dna_id, created_at desc);

alter table public.asset_dna_records enable row level security;
alter table public.proof_stream_events enable row level security;

comment on table public.asset_dna_records is
  'AUROS Asset DNA v1 canonical records — service role only';
comment on table public.proof_stream_events is
  'AUROS Proof Stream v0 append-only events keyed by Asset DNA — service role only';
