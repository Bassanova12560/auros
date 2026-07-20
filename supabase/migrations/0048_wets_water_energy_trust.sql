-- AUROS Water/Energy Trust Score (WETS)
-- Prefixed tables to avoid colliding with generic "projects"

create table if not exists public.wets_projects (
  id uuid primary key default gen_random_uuid(),
  owner_user_id text,
  name text not null,
  ticker text,
  category text not null
    check (category in (
      'water_rights',
      'water_credits',
      'energy_infra',
      'data_center_water',
      'other'
    )),
  website_url text,
  description text,
  legal_structure text,
  jurisdiction text,
  status text not null default 'draft'
    check (status in ('draft', 'published')),
  public_slug text unique,
  report_markdown text,
  report_html text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists wets_projects_owner_idx
  on public.wets_projects (owner_user_id, created_at desc);

create index if not exists wets_projects_status_idx
  on public.wets_projects (status);

create table if not exists public.wets_score_criteria (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.wets_projects(id) on delete cascade,
  category text not null
    check (category in (
      'legal_legitimacy',
      'hydrological_risk',
      'social_litigation_risk',
      'operational_transparency',
      'token_economics'
    )),
  score numeric not null check (score >= 0 and score <= 10),
  weight numeric not null check (weight > 0 and weight <= 1),
  justification text,
  sources jsonb not null default '[]'::jsonb,
  scored_at timestamptz not null default now(),
  unique (project_id, category)
);

create index if not exists wets_score_criteria_project_idx
  on public.wets_score_criteria (project_id);

create table if not exists public.wets_risk_events (
  id uuid primary key default gen_random_uuid(),
  region text not null,
  event_type text not null
    check (event_type in (
      'lawsuit',
      'moratorium',
      'rezoning_dispute',
      'settlement',
      'protest'
    )),
  description text,
  source_url text,
  event_date date,
  severity text not null default 'medium'
    check (severity in ('low', 'medium', 'high')),
  related_project_id uuid references public.wets_projects(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists wets_risk_events_region_idx
  on public.wets_risk_events (region);

create index if not exists wets_risk_events_project_idx
  on public.wets_risk_events (related_project_id);

create or replace view public.wets_project_trust_scores
with (security_invoker = true)
as
select
  p.id,
  p.name,
  p.ticker,
  p.category,
  p.status,
  p.jurisdiction,
  p.public_slug,
  p.owner_user_id,
  p.created_at,
  round(sum(sc.score * sc.weight)::numeric, 1) as final_score,
  case
    when sum(sc.score * sc.weight) >= 8 then 'A'
    when sum(sc.score * sc.weight) >= 6 then 'B'
    when sum(sc.score * sc.weight) >= 4 then 'C'
    else 'D'
  end as grade
from public.wets_projects p
join public.wets_score_criteria sc on sc.project_id = p.id
group by
  p.id, p.name, p.ticker, p.category, p.status,
  p.jurisdiction, p.public_slug, p.owner_user_id, p.created_at;

alter table public.wets_projects enable row level security;
alter table public.wets_score_criteria enable row level security;
alter table public.wets_risk_events enable row level security;

-- Public read of published projects + their criteria (anon / authenticated)
create policy wets_projects_public_read
  on public.wets_projects for select
  using (status = 'published');

create policy wets_criteria_public_read
  on public.wets_score_criteria for select
  using (
    exists (
      select 1 from public.wets_projects p
      where p.id = project_id and p.status = 'published'
    )
  );

create policy wets_risk_events_public_read
  on public.wets_risk_events for select
  using (true);

-- Service role bypasses RLS; app writes via SUPABASE_SECRET_KEY
comment on table public.wets_projects is
  'AUROS Water/Energy Trust Score projects — drafts private via service role, published readable.';
