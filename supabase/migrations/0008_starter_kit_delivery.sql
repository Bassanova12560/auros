-- Starter Kit: automated delivery after Stripe payment
alter table public.jurisdiction_leads
  add column if not exists deliverable_token text unique,
  add column if not exists starter_kit jsonb,
  add column if not exists starter_kit_plain text,
  add column if not exists starter_kit_provider text,
  add column if not exists delivered_at timestamptz,
  add column if not exists delivery_status text not null default 'pending'
    check (delivery_status in ('pending', 'ready', 'failed'));

create index if not exists jurisdiction_leads_deliverable_token_idx
  on public.jurisdiction_leads (deliverable_token)
  where deliverable_token is not null;

create index if not exists jurisdiction_leads_stripe_session_deliver_idx
  on public.jurisdiction_leads (stripe_session_id)
  where stripe_session_id is not null;
