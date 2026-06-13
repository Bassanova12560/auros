/**
 * Dispatch `regulatory.update` webhook events to feed subscribers and registered webhooks.
 * Called from /api/cron/protocol-monitor or manual trigger.
 */

import { PROTOCOL_DISCLAIMER } from "../constants";
import { dispatchWebhook, type WebhookEventPayload } from "../webhooks/sign";
import { listWebhooksForKey } from "../webhooks/store";
import {
  filterFeedForSubscription,
  toPublicFeedItem,
  type RegulatoryFeedItem,
} from "./feed";
import {
  listActiveRegulatorySubscriptions,
  markRegulatorySubscriptionNotified,
} from "./subscribe-store";

export type RegulatoryDispatchResult = {
  subscriptions_checked: number;
  webhooks_fired: number;
  errors: number;
};

function buildRegulatoryUpdatePayload(
  item: RegulatoryFeedItem,
  subscriptionId?: string
): WebhookEventPayload {
  return {
    event: "regulatory.update",
    severity: item.severity,
    impact_on_score: item.impact_on_score,
    summary: item.summary,
    details: {
      feed_item: toPublicFeedItem(item),
      subscription_id: subscriptionId ?? null,
      title: item.title,
      source: item.source,
      source_url: item.url,
      published_at: item.published_at,
      tags: item.tags,
      deadline: item.deadline ?? null,
    },
    timestamp: new Date().toISOString(),
    disclaimer: PROTOCOL_DISCLAIMER,
  };
}

export async function dispatchRegulatoryFeedUpdates(): Promise<RegulatoryDispatchResult> {
  const subscriptions = await listActiveRegulatorySubscriptions();
  let webhooksFired = 0;
  let errors = 0;

  for (const sub of subscriptions) {
    const matches = filterFeedForSubscription(sub);
    const item = matches[0];
    if (!item) continue;

    const payload = buildRegulatoryUpdatePayload(item, sub.id);
    const targets: string[] = [];
    if (sub.webhook_url) targets.push(sub.webhook_url);

    const registered = await listWebhooksForKey(sub.key_hash);
    for (const wh of registered) {
      if (wh.active && wh.events.includes("regulatory.update")) {
        targets.push(wh.url);
      }
    }

    let sent = false;
    for (const url of [...new Set(targets)]) {
      const result = await dispatchWebhook(url, payload);
      if (result.ok) {
        sent = true;
        webhooksFired += 1;
      } else {
        errors += 1;
      }
    }

    if (sent) await markRegulatorySubscriptionNotified(sub.id);
  }

  return {
    subscriptions_checked: subscriptions.length,
    webhooks_fired: webhooksFired,
    errors,
  };
}
