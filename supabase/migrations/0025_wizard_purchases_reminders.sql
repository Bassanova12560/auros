-- Wizard purchase completion tracking + 48h resume reminders

alter table public.wizard_purchases
  add column if not exists completed_at timestamptz,
  add column if not exists reminder_sent_at timestamptz,
  add column if not exists upgrade_from text check (
    upgrade_from is null or upgrade_from in ('starter', 'pro', 'institutional')
  );

create index if not exists wizard_purchases_incomplete_idx
  on public.wizard_purchases (paid_at)
  where completed_at is null and reminder_sent_at is null;
