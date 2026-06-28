/**
 * Dispatch `green.index.changelog` to premium Protocol webhooks subscribed to the event.
 * Triggered monthly via /api/cron/green-index-changelog.
 */

import { buildGreenIndexChangelog } from "@/lib/green/api/changelog";
import { findKeyRecord } from "@/lib/protocol/auth/keys";
import { PROTOCOL_DISCLAIMER } from "@/lib/protocol/constants";
import { dispatchWebhook, type WebhookEventPayload } from "@/lib/protocol/webhooks/sign";
import { listWebhooksForEvent } from "@/lib/protocol/webhooks/store";

import {
  markGreenChangelogDispatched,
  shouldDispatchGreenChangelog,
} from "./dispatch-state";

export type GreenChangelogDispatchResult = {
  edition: string;
  skipped: boolean;
  webhooks_matched: number;
  webhooks_fired: number;
  errors: number;
};

function isPremiumKey(keyHash: string): boolean {
  return keyHash !== "demo";
}

async function isPremiumTierKey(keyHash: string): Promise<boolean> {
  if (!isPremiumKey(keyHash)) return false;
  const record = await findKeyRecord(keyHash);
  if (!record) return false;
  return (
    record.tier === "premium" ||
    record.tier === "monitor" ||
    record.tier === "enterprise"
  );
}

function buildChangelogPayload(
  changelog: ReturnType<typeof buildGreenIndexChangelog>
): WebhookEventPayload {
  const topMover = changelog.top_movers[0];
  const summary = topMover
    ? `Green Index ${changelog.edition}: top mover ${topMover.name} (${topMover.mom_pct ?? 0}% MoM)`
    : `Green Index ${changelog.edition} monthly changelog`;

  return {
    event: "green.index.changelog",
    severity: "low",
    impact_on_score: 0,
    summary,
    details: {
      edition: changelog.edition,
      generated_at: changelog.generated_at,
      top_movers: changelog.top_movers,
      new_in_top: changelog.new_in_top,
      reference_count: changelog.reference_count,
      feed_url: "https://getauros.com/api/green/changelog",
      rss_url: "https://getauros.com/api/green/changelog/rss",
    },
    timestamp: new Date().toISOString(),
    disclaimer: PROTOCOL_DISCLAIMER,
  };
}

export async function dispatchGreenIndexChangelogWebhooks(options?: {
  force?: boolean;
}): Promise<GreenChangelogDispatchResult> {
  const changelog = buildGreenIndexChangelog();
  const edition = changelog.edition;

  if (!options?.force && !shouldDispatchGreenChangelog(edition)) {
    return {
      edition,
      skipped: true,
      webhooks_matched: 0,
      webhooks_fired: 0,
      errors: 0,
    };
  }

  const hooks = await listWebhooksForEvent("green.index.changelog");
  const payload = buildChangelogPayload(changelog);
  let webhooksFired = 0;
  let errors = 0;
  let matched = 0;

  for (const wh of hooks) {
    if (!(await isPremiumTierKey(wh.key_hash))) continue;
    matched += 1;
    const result = await dispatchWebhook(wh.url, payload);
    if (result.ok) webhooksFired += 1;
    else errors += 1;
  }

  if (webhooksFired > 0 || matched === 0) {
    markGreenChangelogDispatched(edition);
  }

  return {
    edition,
    skipped: false,
    webhooks_matched: matched,
    webhooks_fired: webhooksFired,
    errors,
  };
}
