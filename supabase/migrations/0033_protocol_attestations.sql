-- AUROS Protocol — readiness attestations (hash + HMAC). Service role only.

create table if not exists public.protocol_attestations (
  id               text primary key,
  content_hash     text not null,
  signature        text not null,
  key_hash         text not null,
  dossier_id       text not null,
  locale           text not null default 'fr',
  public_snapshot  jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  disclaimer       text not null
);

create index if not exists protocol_attestations_content_hash_idx
  on public.protocol_attestations (content_hash);

create index if not exists protocol_attestations_key_hash_idx
  on public.protocol_attestations (key_hash, created_at desc);

alter table public.protocol_attestations enable row level security;

comment on table public.protocol_attestations is
  'AUROS Protocol readiness attestations — public snapshot + HMAC, service role only';
