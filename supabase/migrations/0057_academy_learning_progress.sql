-- Learner progress for AUROS Academy curriculum hub (Clerk-bound, server-only).
create table if not exists public.academy_learning_progress (
  clerk_user_id      text not null,
  school_id          text not null,
  module_id          text not null,
  lessons_completed  text[] not null default '{}',
  quiz_passed        boolean not null default false,
  quiz_score         smallint,
  updated_at         timestamptz not null default now(),
  primary key (clerk_user_id, school_id, module_id)
);

create index if not exists academy_learning_progress_user_idx
  on public.academy_learning_progress (clerk_user_id);

create index if not exists academy_learning_progress_school_idx
  on public.academy_learning_progress (school_id);

alter table public.academy_learning_progress enable row level security;

drop policy if exists auros_deny_anon_all on public.academy_learning_progress;
drop policy if exists auros_deny_authenticated_all on public.academy_learning_progress;

create policy auros_deny_anon_all on public.academy_learning_progress
  for all to anon using (false) with check (false);

create policy auros_deny_authenticated_all on public.academy_learning_progress
  for all to authenticated using (false) with check (false);
