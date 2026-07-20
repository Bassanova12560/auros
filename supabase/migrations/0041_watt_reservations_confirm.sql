-- Watts Reserve étape 2 — confirm → CFU link columns + confirmed status.

alter table public.watt_reservations
  drop constraint if exists watt_reservations_status_check;

alter table public.watt_reservations
  add constraint watt_reservations_status_check
  check (status in ('pending_confirm', 'confirmed', 'cancelled'));

alter table public.watt_reservations
  add column if not exists cfu_unit_id text,
  add column if not exists cfu_verify_url text,
  add column if not exists confirmed_at timestamptz;

create index if not exists watt_reservations_cfu_unit_id_idx
  on public.watt_reservations (cfu_unit_id)
  where cfu_unit_id is not null;

comment on column public.watt_reservations.cfu_unit_id is
  'ChargeFlow unit id minted on explicit confirm (étape 2)';
