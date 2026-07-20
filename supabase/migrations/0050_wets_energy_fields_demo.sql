-- WETS energy fields + demo flag + PQC checklist

alter table public.wets_projects
  add column if not exists interconnection_queue_position text,
  add column if not exists permits_status text
    check (permits_status is null or permits_status in (
      'unknown', 'none', 'filed', 'obtained'
    )),
  add column if not exists behind_the_meter boolean not null default false,
  add column if not exists pqc_checklist jsonb not null default '{}'::jsonb,
  add column if not exists is_demo boolean not null default false;

create index if not exists wets_projects_published_demo_idx
  on public.wets_projects (status, is_demo, created_at desc);

drop view if exists public.wets_project_trust_scores;

create view public.wets_project_trust_scores
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
  p.is_demo,
  p.behind_the_meter,
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
  p.jurisdiction, p.public_slug, p.owner_user_id, p.is_demo,
  p.behind_the_meter, p.created_at;
