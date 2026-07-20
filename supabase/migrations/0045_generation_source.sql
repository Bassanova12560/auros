-- generation_source for Watts capacity offers (low-carbon / nuclear prep).
-- Indicative technology claim — not GO/REC or Green Verified.

alter table public.watt_capacity_offers
  add column if not exists generation_source text
  check (
    generation_source is null
    or generation_source in (
      'solar', 'wind', 'hydro', 'nuclear', 'battery', 'mixed', 'unknown'
    )
  );

comment on column public.watt_capacity_offers.generation_source is
  'Indicative generation technology — not a certificate or Green Verified label';
