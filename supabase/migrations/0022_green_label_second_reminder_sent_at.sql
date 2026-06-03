-- Second incomplete dossier reminder (7 days after first)
alter table public.green_label_applications
  add column if not exists second_reminder_sent_at timestamptz;

comment on column public.green_label_applications.second_reminder_sent_at is
  'Timestamp when second incomplete dossier reminder was sent (max two reminders per application)';

create index if not exists green_label_applications_second_reminder_idx
  on public.green_label_applications (status, reminder_sent_at)
  where second_reminder_sent_at is null and reminder_sent_at is not null;
