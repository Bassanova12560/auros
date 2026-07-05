-- Hydrological infrastructure: water project type on Green registry & label applications

alter table public.green_registry_projects
  drop constraint if exists green_registry_projects_project_type_check;

alter table public.green_registry_projects
  add constraint green_registry_projects_project_type_check
  check (project_type in ('solar', 'wind', 'rec', 'carbon', 'ppa', 'water', 'other'));

alter table public.green_label_applications
  drop constraint if exists green_label_applications_project_type_check;

alter table public.green_label_applications
  add constraint green_label_applications_project_type_check
  check (project_type in ('solar', 'wind', 'rec', 'carbon', 'ppa', 'water', 'other'));
