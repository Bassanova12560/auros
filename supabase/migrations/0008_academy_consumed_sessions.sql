-- One-time consumption of quiz/challenge sessions (anti-replay)
create table if not exists public.academy_consumed_sessions (
  session_id   text primary key,
  kind         text not null check (kind in ('challenge', 'renewal')),
  consumed_at  timestamptz not null default now()
);

create index if not exists academy_consumed_sessions_consumed_idx
  on public.academy_consumed_sessions (consumed_at desc);

alter table public.academy_consumed_sessions enable row level security;
