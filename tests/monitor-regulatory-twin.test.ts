import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { monitorAssetLimitForRecord, PREMIUM_PRICING } from "@/lib/protocol/auth/premium";
import {
  baselineFeedIdsForMonitor,
  computeMonitorRegulatoryDelta,
  REGULATORY_RULES_VERSION,
} from "@/lib/protocol/monitor/delta";
import { createMonitor, deleteMonitor } from "@/lib/protocol/monitor/store";
import { REGULATORY_FEED } from "@/lib/protocol/regulatory/feed";
import { parseMonitorCheckoutMetadata } from "@/lib/stripe/monitor-checkout";
import { MONITOR_PRODUCT } from "@/lib/protocol/monitor/pricing";

describe("monitor regulatory twin", () => {
  it("exposes enterprise pricing packaging", () => {
    assert.equal(PREMIUM_PRICING.monitor_starter.assets, 5);
    assert.equal(PREMIUM_PRICING.monitor_pro.assets, 25);
    assert.equal(PREMIUM_PRICING.monitor_enterprise.assets, 100);
    assert.equal(PREMIUM_PRICING.monitor_enterprise.price_eur, null);
  });

  it("applies distinct Starter / Pro / Enterprise asset caps", () => {
    assert.equal(
      monitorAssetLimitForRecord({ tier: "monitor", monitor_plan: "starter" }),
      5
    );
    assert.equal(
      monitorAssetLimitForRecord({ tier: "monitor", monitor_plan: "pro" }),
      25
    );
    assert.equal(monitorAssetLimitForRecord({ tier: "monitor" }), 25);
    assert.equal(monitorAssetLimitForRecord({ tier: "premium" }), 25);
    assert.equal(monitorAssetLimitForRecord({ tier: "enterprise" }), 100);
    assert.equal(monitorAssetLimitForRecord({ tier: "free" }), 5);
  });

  it("snapshots baseline feed ids and returns empty delta initially", async () => {
    const keyHash = `test_twin_${Date.now()}`;
    const monitor = await createMonitor(keyHash, {
      asset_type: "real_estate",
      jurisdiction: "luxembourg",
      structure: "spv",
      alert_on: ["regulation_update", "new_requirement", "deadline_approaching"],
    });

    assert.equal(monitor.rules_version, REGULATORY_RULES_VERSION);
    assert.ok(monitor.baseline_feed_ids.length >= 1);
    assert.deepEqual(
      monitor.baseline_feed_ids,
      baselineFeedIdsForMonitor(monitor)
    );

    const delta = computeMonitorRegulatoryDelta(monitor);
    assert.equal(delta.item_count, 0);
    assert.equal(delta.impact_sum, 0);
    assert.equal(delta.rules_version, REGULATORY_RULES_VERSION);

    await deleteMonitor(monitor.id, keyHash);
  });

  it("delta includes items outside the baseline set", () => {
    const baseline = REGULATORY_FEED.slice(0, 3).map((i) => i.id);
    const delta = computeMonitorRegulatoryDelta({
      jurisdiction: "eu",
      asset_type: "real_estate",
      alert_on: ["regulation_update", "new_requirement", "deadline_approaching", "score_change"],
      rules_version: REGULATORY_RULES_VERSION,
      baseline_feed_ids: baseline,
    });
    assert.ok(delta.item_count >= 0);
    for (const item of delta.items) {
      assert.equal(baseline.includes(item.id), false);
      assert.equal(typeof item.impact_on_score, "number");
    }
  });

  it("parses Monitor Stripe checkout metadata", () => {
    const parsed = parseMonitorCheckoutMetadata({
      product: MONITOR_PRODUCT,
      plan: "pro",
      email: "ops@cabinet.eu",
      locale: "fr",
    });
    assert.ok(parsed);
    assert.equal(parsed?.plan, "pro");
    assert.equal(parsed?.email, "ops@cabinet.eu");
    assert.equal(
      parseMonitorCheckoutMetadata({ product: "other", plan: "pro", email: "a@b.c" }),
      null
    );
  });
});
