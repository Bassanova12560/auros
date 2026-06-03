-- Optional candidate locale for label application emails (FR/EN/ES)
alter table public.green_label_applications
  add column if not exists preferred_locale text
  check (preferred_locale is null or preferred_locale in ('fr', 'en', 'es'));

comment on column public.green_label_applications.preferred_locale is
  'Candidate preferred locale for status notification emails (fr, en, es).';
