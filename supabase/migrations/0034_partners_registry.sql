-- Partner registry for attribution B portal (codes + Clerk bind).

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  company text not null,
  email text not null,
  contact_name text,
  clerk_user_id text,
  status text not null default 'pending'
    check (status in ('pending', 'active', 'disabled')),
  created_at timestamptz not null default now(),
  activated_at timestamptz
);

create unique index if not exists partners_code_unique_idx
  on public.partners (upper(code));

create index if not exists partners_email_idx
  on public.partners (lower(email));

create index if not exists partners_clerk_user_id_idx
  on public.partners (clerk_user_id)
  where clerk_user_id is not null;

create index if not exists partners_status_idx
  on public.partners (status);

alter table public.partners enable row level security;

comment on table public.partners is
  'AUROS partner apporteur registry — referral codes + Clerk bind, service role only';

alter table public.partner_requests
  add column if not exists partner_id uuid references public.partners(id);

create index if not exists partner_requests_partner_id_idx
  on public.partner_requests (partner_id)
  where partner_id is not null;
