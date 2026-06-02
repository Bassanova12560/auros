-- Jurisdiction leads: scoring, payments, nurture automation
alter table public.jurisdiction_leads
  add column if not exists status text not null default 'new'
    check (status in ('new', 'nurtured', 'paid', 'lost')),
  add column if not exists lead_score integer not null default 0,
  add column if not exists lead_tier text
    check (lead_tier is null or lead_tier in ('hot', 'warm', 'cold')),
  add column if not exists ai_quote text,
  add column if not exists ai_quote_provider text,
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent text,
  add column if not exists paid_at timestamptz,
  add column if not exists paid_tier text,
  add column if not exists nurture_step integer not null default 0,
  add column if not exists last_nurture_at timestamptz;

create index if not exists jurisdiction_leads_status_nurture_idx
  on public.jurisdiction_leads (status, nurture_step, created_at desc)
  where paid_at is null;

create index if not exists jurisdiction_leads_stripe_session_idx
  on public.jurisdiction_leads (stripe_session_id)
  where stripe_session_id is not null;
