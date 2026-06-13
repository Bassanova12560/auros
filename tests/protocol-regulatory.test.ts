import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  queryRegulatoryFeed,
  filterFeedForMonitor,
  filterFeedForSubscription,
  REGULATORY_FEED,
  REGULATORY_FEED_LAST_UPDATED,
  toPublicFeedItem,
} from "../lib/protocol/regulatory/feed";
import {
  createRegulatorySubscription,
  deleteRegulatorySubscription,
  getRegulatorySubscription,
} from "../lib/protocol/regulatory/subscribe-store";
import { regulatoryFeedQuerySchema, regulatorySubscribeSchema } from "../lib/protocol/schemas/regulatory";
import { WEBHOOK_EVENT_TYPES } from "../lib/protocol/schemas/webhooks";

describe("protocol/regulatory/feed", () => {
  it("has at least 10 curated items with last_updated", () => {
    assert.ok(REGULATORY_FEED.length >= 10);
    assert.match(REGULATORY_FEED_LAST_UPDATED, /^\d{4}-\d{2}-\d{2}$/);
  });

  it("items include ESMA, AMF and BaFin references", () => {
    const sources = new Set(REGULATORY_FEED.map((i) => i.source));
    assert.ok(sources.has("ESMA"));
    assert.ok(sources.has("AMF"));
    assert.ok(sources.has("BaFin"));
  });

  it("filters by jurisdiction and tag", () => {
    const fr = queryRegulatoryFeed({ jurisdiction: "france", limit: 5 });
    assert.ok(fr.length >= 1);
    assert.ok(fr.every((i) => i.tags.length >= 1));

    const amf = queryRegulatoryFeed({ tag: "amf" });
    assert.ok(amf.every((i) => i.tags.includes("amf")));
  });

  it("toPublicFeedItem omits internal monitor fields", () => {
    const pub = toPublicFeedItem(REGULATORY_FEED[0]!);
    assert.ok(pub.id);
    assert.equal("jurisdictions" in pub, false);
    assert.equal("impact_on_score" in pub, false);
  });

  it("matches monitor profiles", () => {
    const updates = filterFeedForMonitor({
      jurisdiction: "luxembourg",
      asset_type: "real_estate",
      alert_on: ["regulation_update", "deadline_approaching"],
    });
    assert.ok(updates.length >= 1);
  });

  it("matches subscription filters", () => {
    const updates = filterFeedForSubscription({
      jurisdictions: ["france"],
      tags: ["amf"],
    });
    assert.ok(updates.length >= 1);
    assert.ok(updates.every((u) => u.tags.includes("amf")));
  });
});

describe("protocol/regulatory/subscribe", () => {
  it("validates subscribe schema", () => {
    const parsed = regulatorySubscribeSchema.safeParse({
      jurisdictions: ["france", "eu"],
      tags: ["amf", "mica"],
    });
    assert.equal(parsed.success, true);
  });

  it("creates and deletes a subscription", async () => {
    const keyHash = `reg-${Date.now()}`;
    const sub = await createRegulatorySubscription(keyHash, {
      jurisdictions: ["germany"],
      tags: ["bafin"],
    });
    assert.ok(sub.id.startsWith("regsub_"));

    const fetched = await getRegulatorySubscription(sub.id, keyHash);
    assert.ok(fetched);
    assert.deepEqual(fetched?.jurisdictions, ["germany"]);

    const deleted = await deleteRegulatorySubscription(sub.id, keyHash);
    assert.equal(deleted, true);
  });
});

describe("protocol/regulatory/schemas", () => {
  it("includes regulatory.update webhook event", () => {
    assert.ok(WEBHOOK_EVENT_TYPES.includes("regulatory.update"));
  });

  it("parses feed query params", () => {
    const parsed = regulatoryFeedQuerySchema.safeParse({
      jurisdiction: "france",
      tag: "amf",
      limit: "10",
    });
    assert.equal(parsed.success, true);
    if (parsed.success) assert.equal(parsed.data.limit, 10);
  });
});
