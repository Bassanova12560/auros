-- Green Label Stripe payment (300 € document review)
alter table public.green_label_applications
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent text,
  add column if not exists amount_cents integer,
  add column if not exists paid_at timestamptz;

create unique index if not exists green_label_applications_stripe_session_idx
  on public.green_label_applications (stripe_session_id)
  where stripe_session_id is not null;

create index if not exists green_label_applications_paid_at_idx
  on public.green_label_applications (paid_at desc)
  where paid_at is not null;

comment on column public.green_label_applications.paid_at is
  'Stripe checkout completed — 300 EUR label document review fee';
