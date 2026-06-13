-- AUROS Protocol — webhook delivery log, retry queue, dead letter (roadmap item #9)
-- Service role only (RLS enabled, no public policies).

create table if not exists public.protocol_webhook_deliveries (
  id            text primary key,
  webhook_id    text,
  key_hash      text not null,
  url           text not null,
  event         text not null,
  payload       jsonb not null default '{}'::jsonb,
  status        text not null default 'pending'
    check (status in ('pending', 'delivered', 'failed', 'dead_letter')),
  attempts      integer not null default 0 check (attempts >= 0),
  last_error    text,
  created_at    timestamptz not null default now(),
  next_retry_at timestamptz,
  delivered_at  timestamptz
);

create index if not exists protocol_webhook_deliveries_webhook_id_idx
  on public.protocol_webhook_deliveries (webhook_id, created_at desc);

create index if not exists protocol_webhook_deliveries_key_hash_idx
  on public.protocol_webhook_deliveries (key_hash, created_at desc);

create index if not exists protocol_webhook_deliveries_retry_idx
  on public.protocol_webhook_deliveries (status, next_retry_at)
  where status in ('pending', 'failed');

alter table public.protocol_webhook_deliveries enable row level security;

comment on table public.protocol_webhook_deliveries is
  'AUROS Protocol outbound webhook delivery log with retry and dead letter — service role only';
