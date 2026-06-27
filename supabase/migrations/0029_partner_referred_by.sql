-- Partner apporteur attribution (?partner=CODE → referred_by on leads + dossiers)

alter table public.leads
  add column if not exists referred_by text;

alter table public.dossiers
  add column if not exists referred_by text;

create index if not exists leads_referred_by_idx
  on public.leads (referred_by)
  where referred_by is not null;

create index if not exists dossiers_referred_by_idx
  on public.dossiers (referred_by)
  where referred_by is not null;

comment on column public.leads.referred_by is
  'Partner attribution code from ?partner=CODE landing URL.';

comment on column public.dossiers.referred_by is
  'Partner attribution code from ?partner=CODE landing URL.';
