-- Monitor Regulatory Twin lite + subscriptions hardening
--
-- - Twin snapshot columns on protocol_monitors
-- - monitor_plan on api_keys (starter|pro)
-- - protocol_regulatory_subscriptions (was used in code without migration)

alter table public.protocol_monitors
  add column if not exists rules_version text,
  add column if not exists baseline_feed_ids text[] not null default '{}';

comment on column public.protocol_monitors.rules_version is
  'REGULATORY_RULES_VERSION at monitor creation (Twin snapshot)';
comment on column public.protocol_monitors.baseline_feed_ids is
  'Curated feed item ids matched at creation — delta = new matches outside this set';

alter table public.api_keys
  add column if not exists monitor_plan text
  check (monitor_plan is null or monitor_plan in ('starter', 'pro'));

comment on column public.api_keys.monitor_plan is
  'Monitor Starter (5) vs Pro (25) when tier=monitor; null for non-monitor keys';

create table if not exists public.protocol_regulatory_subscriptions (
  id              text primary key,
  key_hash        text not null,
  email           text,
  jurisdictions   text[] not null default '{}',
  tags            text[] not null default '{}',
  webhook_url     text,
  status          text not null default 'active' check (status in ('active', 'deleted')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  last_notified_at timestamptz
);

create index if not exists protocol_regulatory_subscriptions_key_hash_idx
  on public.protocol_regulatory_subscriptions (key_hash);
create index if not exists protocol_regulatory_subscriptions_status_idx
  on public.protocol_regulatory_subscriptions (status);

alter table public.protocol_regulatory_subscriptions enable row level security;

comment on table public.protocol_regulatory_subscriptions is
  'AUROS Protocol regulatory feed subscriptions — service role only';
