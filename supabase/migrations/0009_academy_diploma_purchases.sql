-- Academy diploma PDF purchases (individual lifetime + institution)
create table if not exists public.academy_diploma_purchases (
  id                  text primary key,
  product_type        text not null check (product_type in ('individual', 'institution')),
  cert_id             text,
  cert_snapshot       jsonb,
  organization_name   text,
  contact_email       text not null,
  contact_name        text,
  stripe_session_id   text not null unique,
  stripe_payment_intent text,
  amount_cents        integer not null,
  purchased_at        timestamptz not null default now()
);

create index if not exists academy_diploma_purchases_cert_idx
  on public.academy_diploma_purchases (cert_id)
  where cert_id is not null;

create index if not exists academy_diploma_purchases_email_idx
  on public.academy_diploma_purchases (contact_email);

alter table public.academy_diploma_purchases enable row level security;
