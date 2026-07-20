-- Watts Reserve étape 3 — settle / retire on delivery.

alter table public.watt_reservations
  drop constraint if exists watt_reservations_status_check;

alter table public.watt_reservations
  add constraint watt_reservations_status_check
  check (status in ('pending_confirm', 'confirmed', 'settled', 'cancelled'));

alter table public.watt_reservations
  add column if not exists settled_at timestamptz,
  add column if not exists delivery_ref text,
  add column if not exists delivered_at timestamptz,
  add column if not exists energy_kwh_delivered numeric,
  add column if not exists capacity_kw_delivered numeric,
  add column if not exists settle_reason text;

comment on column public.watt_reservations.settled_at is
  'When reservation was settled and linked CFU retired (étape 3)';
