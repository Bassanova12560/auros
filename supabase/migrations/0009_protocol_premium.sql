-- AUROS Protocol Phase 3 — premium monitors, webhooks, usage logs
--
-- Required Vercel env (production):
--   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY
--   WEBHOOK_SECRET — HMAC signing for outbound webhooks
--   DOSSIER_DOWNLOAD_SECRET — optional; falls back to WEBHOOK_SECRET
--   AUROS_PREMIUM_LIVE_KEYS — optional comma-separated key hashes for premium bypass in staging

-- Expand api_keys tier for premium plans (non-breaking: existing rows stay 'free')
alter table public.api_keys drop constraint if exists api_keys_tier_check;
alter table public.api_keys add constraint api_keys_tier_check
  check (tier in ('free', 'premium', 'monitor', 'enterprise'));

comment on column public.api_keys.tier is
  'free=100 req/mo; premium|monitor|enterprise unlock /monitor, /dossier, /webhooks';

-- Asset monitoring subscriptions (premium)
create table if not exists public.protocol_monitors (
  id              text primary key,
  key_hash        text not null,
  email           text,
  asset_type      text not null,
  jurisdiction    text not null,
  structure       text not null default 'spv',
  webhook_url     text,
  alert_on        text[] not null default '{score_change,regulation_update}',
  baseline_score  integer,
  status          text not null default 'active' check (status in ('active', 'paused', 'deleted')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  last_checked_at timestamptz,
  last_alert_at   timestamptz
);

create index if not exists protocol_monitors_key_hash_idx on public.protocol_monitors (key_hash);
create index if not exists protocol_monitors_status_idx on public.protocol_monitors (status);

-- Registered webhook endpoints per API key
create table if not exists public.protocol_webhooks (
  id          text primary key,
  key_hash    text not null,
  url         text not null,
  events      text[] not null default '{score_change,regulation_update,new_requirement,deadline_approaching}',
  secret_hint text,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists protocol_webhooks_key_hash_idx on public.protocol_webhooks (key_hash);

-- Optional usage audit trail for dashboard
create table if not exists public.protocol_usage_logs (
  id         bigserial primary key,
  key_hash   text not null,
  endpoint   text not null,
  method     text not null default 'POST',
  status     integer not null default 200,
  created_at timestamptz not null default now()
);

create index if not exists protocol_usage_logs_key_hash_idx on public.protocol_usage_logs (key_hash, created_at desc);

alter table public.protocol_monitors enable row level security;
alter table public.protocol_webhooks enable row level security;
alter table public.protocol_usage_logs enable row level security;

comment on table public.protocol_monitors is 'AUROS Protocol premium asset monitors — service role only';
comment on table public.protocol_webhooks is 'AUROS Protocol outbound webhook registrations — service role only';
comment on table public.protocol_usage_logs is 'AUROS Protocol API usage audit — service role only';
