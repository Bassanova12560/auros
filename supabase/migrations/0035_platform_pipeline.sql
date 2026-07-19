-- Issuer Pipeline OS MVP — platform kind + per-tenant webhook + dossier routing

alter table public.partners
  add column if not exists kind text not null default 'apporteur';

alter table public.partners
  drop constraint if exists partners_kind_check;

alter table public.partners
  add constraint partners_kind_check
  check (kind in ('apporteur', 'platform'));

alter table public.partners
  add column if not exists webhook_url text;

alter table public.partners
  add column if not exists webhook_secret text;

create index if not exists partners_kind_status_idx
  on public.partners (kind, status);

comment on column public.partners.kind is
  'apporteur = referral attribution; platform = issuer admission inbox';

alter table public.dossiers
  add column if not exists partner_platform_id uuid references public.partners(id);

create index if not exists dossiers_partner_platform_id_idx
  on public.dossiers (partner_platform_id)
  where partner_platform_id is not null;

comment on column public.dossiers.partner_platform_id is
  'Target RWA platform tenant (partners.kind=platform) for admission pipeline';
