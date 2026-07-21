-- Explicit deny policies for anon/authenticated on user-data tables.
-- Access remains server-only via service_role (BYPASSRLS).
-- Clears "RLS enabled, no policy" advisor noise without opening public access.

do $$
declare
  t text;
  tables text[] := array[
    'academy_cert_registry',
    'academy_consumed_sessions',
    'academy_diploma_purchases',
    'academy_reminder_prefs',
    'api_keys',
    'concierge_requests',
    'copilot_drafts',
    'dossier_files',
    'dossier_shares',
    'dossiers',
    'green_compare_snapshots',
    'green_impact_report_purchases',
    'green_label_applications',
    'green_praticien_waitlist',
    'green_registry_experts',
    'green_registry_projects',
    'jurisdiction_leads',
    'leads',
    'partner_requests',
    'partners',
    'protocol_attestations',
    'protocol_chargeflow_units',
    'protocol_monitors',
    'protocol_regulatory_subscriptions',
    'protocol_score_history',
    'protocol_usage_logs',
    'protocol_webhook_deliveries',
    'protocol_webhooks',
    'shield_audit',
    'shield_receipts',
    'shield_tap_usage',
    'watt_capacity_offers',
    'watt_reservations',
    'watt_secondary_listings',
    'wizard_purchases'
  ];
begin
  foreach t in array tables
  loop
    if to_regclass(format('public.%I', t)) is null then
      continue;
    end if;

    execute format('alter table public.%I enable row level security', t);

    execute format(
      'drop policy if exists auros_deny_anon_all on public.%I',
      t
    );
    execute format(
      'drop policy if exists auros_deny_authenticated_all on public.%I',
      t
    );

    execute format(
      'create policy auros_deny_anon_all on public.%I for all to anon using (false) with check (false)',
      t
    );
    execute format(
      'create policy auros_deny_authenticated_all on public.%I for all to authenticated using (false) with check (false)',
      t
    );
  end loop;
end $$;
