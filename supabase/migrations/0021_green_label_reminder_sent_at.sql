-- One-shot incomplete dossier reminder per label application
alter table public.green_label_applications
  add column if not exists reminder_sent_at timestamptz;

comment on column public.green_label_applications.reminder_sent_at is
  'Timestamp when incomplete dossier reminder email was sent (max one per application)';

create index if not exists green_label_applications_reminder_idx
  on public.green_label_applications (status, created_at)
  where reminder_sent_at is null;
