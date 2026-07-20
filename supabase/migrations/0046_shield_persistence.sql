-- AUROS Shield — multi-instance persistence (service role only)

create table if not exists public.shield_receipts (
  id               text primary key,
  shield_version   text not null,
  kind             text not null default 'tap',
  content_hash     text not null,
  local_signature  text,
  cloud_signature  text not null,
  profile          text not null,
  tenant_ref       text,
  label            text,
  plan             text not null default 'free',
  verify_url       text not null,
  created_at       timestamptz not null default now(),
  disclaimer       text not null
);

create index if not exists shield_receipts_tenant_created_idx
  on public.shield_receipts (tenant_ref, created_at desc);

create index if not exists shield_receipts_hash_idx
  on public.shield_receipts (content_hash);

create table if not exists public.shield_tap_usage (
  key_hash text not null,
  month    text not null,
  count    int not null default 0,
  primary key (key_hash, month)
);

create table if not exists public.shield_audit (
  id           text primary key,
  key_hash     text not null,
  action       text not null,
  receipt_id   text,
  pack_id      text,
  content_hash text,
  meta         jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index if not exists shield_audit_key_created_idx
  on public.shield_audit (key_hash, created_at desc);

alter table public.shield_receipts enable row level security;
alter table public.shield_tap_usage enable row level security;
alter table public.shield_audit enable row level security;

comment on table public.shield_receipts is
  'AUROS Shield proof taps — hash-only receipts, service role only';
