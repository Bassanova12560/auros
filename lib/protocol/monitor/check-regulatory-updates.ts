/**
 * Cron / Trigger.dev job stub — checks curated ESMA feed and fires monitor webhooks.
 *
 * Wire on Vercel Cron or Trigger.dev:
 *   GET /api/cron/protocol-monitor  (protect with CRON_SECRET)
 * Or import `checkRegulatoryUpdates` in your scheduler.
 */

import { PROTOCOL_DISCLAIMER } from "../constants";
import { dispatchRegulatoryFeedUpdates } from "../regulatory/dispatch-updates";
import { filterFeedForMonitor } from "../regulatory/feed";
import { dispatchWebhook, type WebhookEventPayload } from "../webhooks/sign";
import { listWebhooksForKey } from "../webhooks/store";
import { listActiveMonitors, markMonitorChecked } from "./store";

const CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

export type RegulatoryCheckResult = {
  monitors_checked: number;
  alerts_sent: number;
  errors: number;
  regulatory_subscriptions_checked: number;
  regulatory_webhooks_fired: number;
};

export async function checkRegulatoryUpdates(): Promise<RegulatoryCheckResult> {
  const monitors = await listActiveMonitors();
  let alertsSent = 0;
  let errors = 0;

  for (const monitor of monitors) {
    const now = Date.now();
    const lastChecked = monitor.last_checked_at
      ? new Date(monitor.last_checked_at).getTime()
      : 0;
    if (now - lastChecked < CHECK_INTERVAL_MS) continue;

    const updates = filterFeedForMonitor(monitor);
    const recentUpdate = updates[0];
    let alertSent = false;

    if (recentUpdate) {
      const payload: WebhookEventPayload = {
        event: recentUpdate.event_type,
        severity: recentUpdate.severity,
        impact_on_score: recentUpdate.impact_on_score,
        monitor_id: monitor.id,
        asset_type: monitor.asset_type,
        jurisdiction: monitor.jurisdiction,
        structure: monitor.structure,
        summary: recentUpdate.summary,
        details: {
          title: recentUpdate.title,
          source_url: recentUpdate.url,
          published_at: recentUpdate.published_at,
          deadline: recentUpdate.deadline,
          update_id: recentUpdate.id,
        },
        timestamp: new Date().toISOString(),
        disclaimer: PROTOCOL_DISCLAIMER,
      };

      const targets: string[] = [];
      if (monitor.webhook_url) targets.push(monitor.webhook_url);

      const registered = await listWebhooksForKey(monitor.key_hash);
      for (const wh of registered) {
        if (wh.active && wh.events.includes(recentUpdate.event_type)) {
          targets.push(wh.url);
        }
      }

      for (const url of [...new Set(targets)]) {
        const result = await dispatchWebhook(url, payload);
        if (result.ok) {
          alertSent = true;
          alertsSent += 1;
        } else {
          errors += 1;
        }
      }
    }

    await markMonitorChecked(monitor.id, alertSent);
  }

  const feedDispatch = await dispatchRegulatoryFeedUpdates();

  return {
    monitors_checked: monitors.length,
    alerts_sent: alertsSent,
    errors: errors + feedDispatch.errors,
    regulatory_subscriptions_checked: feedDispatch.subscriptions_checked,
    regulatory_webhooks_fired: feedDispatch.webhooks_fired,
  };
}
