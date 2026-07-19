-- AUROS ChargeFlow — CFU-E units (hash + HMAC). Service role only.

create table if not exists public.protocol_chargeflow_units (
  id               text primary key,
  content_hash     text not null,
  signature        text not null,
  key_hash         text not null,
  public_snapshot  jsonb not null default '{}'::jsonb,
  created_at       timestamptz not null default now(),
  disclaimer       text not null
);

create index if not exists protocol_chargeflow_units_content_hash_idx
  on public.protocol_chargeflow_units (content_hash);

create index if not exists protocol_chargeflow_units_key_hash_idx
  on public.protocol_chargeflow_units (key_hash, created_at desc);

alter table public.protocol_chargeflow_units enable row level security;

comment on table public.protocol_chargeflow_units is
  'AUROS ChargeFlow CFU-E — public snapshot + HMAC, service role only';
