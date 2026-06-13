-- Green Impact Report PDF purchases (Stripe checkout)

create table if not exists public.green_impact_report_purchases (
  id                    uuid primary key default gen_random_uuid(),
  email                 text not null,
  tier                  text not null check (tier in ('standard', 'institutional')),
  stripe_session_id     text not null unique,
  stripe_payment_intent text,
  amount_cents          integer,
  paid_at               timestamptz not null default now(),
  locale                text not null default 'fr',
  created_at            timestamptz not null default now()
);

create index if not exists green_impact_report_purchases_email_idx
  on public.green_impact_report_purchases (email, paid_at desc);

alter table public.green_impact_report_purchases enable row level security;
