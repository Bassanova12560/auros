-- Optional nurture timestamp for incomplete dossiers
alter table public.dossiers
  add column if not exists nurture_sent_at timestamptz;

comment on column public.dossiers.nurture_sent_at is
  'When incomplete-dossier nurture email was last sent';
