-- AUROS Academy — opt-in reminder emails (J-14, J-3, renewal confirmation)
create table if not exists public.academy_reminder_prefs (
  id                  uuid primary key default gen_random_uuid(),
  email               text not null,
  cert_id             text not null,
  cert_token          text not null,
  first_name          text,
  tier                text not null default 'fundamentals',
  expires_at          timestamptz not null,
  locale              text not null default 'fr',
  reminders_enabled   boolean not null default true,
  reminder_14_sent_at timestamptz,
  reminder_3_sent_at  timestamptz,
  unsubscribe_token   text not null unique,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (cert_id, email)
);

create index if not exists academy_reminder_prefs_enabled_expires_idx
  on public.academy_reminder_prefs (reminders_enabled, expires_at)
  where reminders_enabled = true;

create index if not exists academy_reminder_prefs_unsub_idx
  on public.academy_reminder_prefs (unsubscribe_token);

alter table public.academy_reminder_prefs enable row level security;
