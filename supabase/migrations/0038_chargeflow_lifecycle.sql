-- ChargeFlow v0.1 — lifecycle + uniqueness + unit_kind (CFU-E / CFU-W)

alter table public.protocol_chargeflow_units
  add column if not exists unit_kind text not null default 'e',
  add column if not exists status text not null default 'active',
  add column if not exists retired_at timestamptz,
  add column if not exists retire_reason text,
  add column if not exists operator_id text,
  add column if not exists external_ref text;

update public.protocol_chargeflow_units
set external_ref = coalesce(
  external_ref,
  public_snapshot->>'external_session_id',
  public_snapshot->>'external_flow_id',
  id
)
where external_ref is null;

alter table public.protocol_chargeflow_units
  alter column external_ref set not null;

create unique index if not exists protocol_chargeflow_units_active_uniq
  on public.protocol_chargeflow_units (
    unit_kind,
    key_hash,
    (coalesce(nullif(operator_id, ''), key_hash)),
    external_ref
  )
  where status = 'active';

create index if not exists protocol_chargeflow_units_status_idx
  on public.protocol_chargeflow_units (status, created_at desc);

comment on column public.protocol_chargeflow_units.unit_kind is
  'e = CFU-E energy, w = CFU-W water';
comment on column public.protocol_chargeflow_units.status is
  'active | retired — retirement does not re-sign mint hash';
