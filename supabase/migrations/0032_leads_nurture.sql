-- Lead score nurturing: wizard reminder sequence after score_widget capture

alter table public.leads
  add column if not exists locale text,
  add column if not exists nurture_step integer not null default 0,
  add column if not exists last_nurture_at timestamptz;

create index if not exists leads_score_nurture_idx
  on public.leads (source, nurture_step, created_at desc)
  where source = 'score_widget' and consent = true;

comment on column public.leads.nurture_step is
  'Nurture sequence step for score_widget leads (0=none, 1=wizard reminder, 2=final reminder).';
