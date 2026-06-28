import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildGreenIndexChangelog } from "@/lib/green/api/changelog";
import { dispatchGreenIndexChangelogWebhooks } from "@/lib/green/webhooks/dispatch-changelog";
import {
  resetGreenChangelogDispatchState,
  shouldDispatchGreenChangelog,
} from "@/lib/green/webhooks/dispatch-state";
import { WEBHOOK_EVENT_TYPES } from "@/lib/protocol/schemas/webhooks";
import { registerWebhook, listWebhooksForEvent } from "@/lib/protocol/webhooks/store";
import { createApiKey, upgradeApiKeyTierByEmail, validateApiKey } from "@/lib/protocol/auth/keys";

describe("green/changelog-webhook", () => {
  it("includes green.index.changelog in webhook event types", () => {
    assert.ok(WEBHOOK_EVENT_TYPES.includes("green.index.changelog"));
  });

  it("builds changelog with top movers", () => {
    const log = buildGreenIndexChangelog();
    assert.ok(log.edition);
    assert.ok(Array.isArray(log.top_movers));
  });

  it("dispatch skips duplicate edition unless forced", async () => {
    resetGreenChangelogDispatchState();
    const log = buildGreenIndexChangelog();
    assert.equal(shouldDispatchGreenChangelog(log.edition), true);

    const first = await dispatchGreenIndexChangelogWebhooks();
    assert.equal(first.skipped, false);

    const second = await dispatchGreenIndexChangelogWebhooks();
    assert.equal(second.skipped, true);

    resetGreenChangelogDispatchState();
  });

  it("lists webhooks registered for green.index.changelog", async () => {
    const { apiKey } = await createApiKey(`wh-green-${Date.now()}@example.com`);
    const validation = await validateApiKey(apiKey);
    assert.ok(validation.keyHash);
    await registerWebhook(validation.keyHash!, {
      url: "https://example.com/hooks/green",
      events: ["green.index.changelog"],
    });
    const hooks = await listWebhooksForEvent("green.index.changelog");
    assert.ok(hooks.some((h) => h.url === "https://example.com/hooks/green"));
  });
});
