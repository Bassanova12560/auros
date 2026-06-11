-- AUROS Protocol API keys (Phase 1)

create table if not exists public.api_keys (
  id                  text primary key,
  email               text not null,
  key_hash            text not null unique,
  prefix              text not null check (prefix in ('live', 'test')),
  tier                text not null default 'free' check (tier in ('free')),
  created_at          timestamptz not null default now(),
  requests_this_month integer not null default 0,
  month_key           text not null default to_char(now() at time zone 'utc', 'YYYY-MM')
);

create index if not exists api_keys_email_idx on public.api_keys (email);
create index if not exists api_keys_key_hash_idx on public.api_keys (key_hash);

alter table public.api_keys enable row level security;

-- No public policies: only service-role (SUPABASE_SECRET_KEY) can read/write.
-- Required Vercel env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, DATABASE_URL (optional direct PG).
comment on table public.api_keys is 'AUROS Protocol API keys — server-only via service role';