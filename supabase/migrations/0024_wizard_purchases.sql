-- Wizard Pro purchases (Stripe checkout unlock)

create table if not exists public.wizard_purchases (
  id                  uuid primary key default gen_random_uuid(),
  email               text not null,
  tier                text not null check (tier in ('starter', 'pro', 'institutional')),
  stripe_session_id   text not null unique,
  stripe_payment_intent text,
  amount_cents        integer,
  paid_at             timestamptz not null default now(),
  wizard_unlocked     boolean not null default true,
  locale              text not null default 'fr',
  created_at          timestamptz not null default now()
);

create index if not exists wizard_purchases_email_idx
  on public.wizard_purchases (email, paid_at desc);

alter table public.wizard_purchases enable row level security;
