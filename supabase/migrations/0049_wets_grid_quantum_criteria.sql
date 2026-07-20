-- WETS v2: grid interconnection + post-quantum legal recourse + microgrid category

alter table public.wets_projects
  drop constraint if exists wets_projects_category_check;

alter table public.wets_projects
  add constraint wets_projects_category_check
  check (category in (
    'water_rights',
    'water_credits',
    'energy_infra',
    'energy_microgrid',
    'data_center_water',
    'other'
  ));

alter table public.wets_score_criteria
  drop constraint if exists wets_score_criteria_category_check;

alter table public.wets_score_criteria
  add constraint wets_score_criteria_category_check
  check (category in (
    'legal_legitimacy',
    'hydrological_risk',
    'social_litigation_risk',
    'grid_interconnection_realism',
    'operational_transparency',
    'token_economics',
    'post_quantum_legal_recourse'
  ));

alter table public.wets_risk_events
  drop constraint if exists wets_risk_events_event_type_check;

alter table public.wets_risk_events
  add constraint wets_risk_events_event_type_check
  check (event_type in (
    'lawsuit',
    'moratorium',
    'rezoning_dispute',
    'settlement',
    'protest',
    'interconnection_delay',
    'queue_update'
  ));
