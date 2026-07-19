import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { KEY_PREFIX_LIVE, KEY_PREFIX_TEST } from "../lib/protocol/constants";
import { checkPremiumAccess } from "../lib/protocol/auth/premium";
import {
  createMonitor,
  getMonitor,
  deleteMonitor,
  countActiveMonitors,
} from "../lib/protocol/monitor/store";
import { updatesForMonitor } from "../lib/protocol/monitor/esma-feed";
import {
  generateDossierPayload,
  getDossierPayload,
} from "../lib/protocol/dossier/generate";
import {
  createDossierDownloadToken,
  verifyDossierDownloadToken,
} from "../lib/protocol/dossier/download-token";
import {
  signWebhookPayload,
  verifyWebhookSignature,
  webhookSignatureHeader,
} from "../lib/protocol/webhooks/sign";
import { registerWebhook, deleteWebhook } from "../lib/protocol/webhooks/store";

describe("protocol/premium", () => {
  it("blocks live-prefixed keys without a paid tier record", () => {
    const result = checkPremiumAccess(`${KEY_PREFIX_LIVE}abc123`);
    assert.equal(result.allowed, false);
  });

  it("blocks free test keys", () => {
    const result = checkPremiumAccess(`${KEY_PREFIX_TEST}abc123`);
    assert.equal(result.allowed, false);
  });

  it("allows premium tier records even on test prefix", () => {
    const result = checkPremiumAccess(`${KEY_PREFIX_TEST}x`, { tier: "premium", prefix: "test" });
    assert.equal(result.allowed, true);
  });

  it("allows monitor tier on live prefix", () => {
    const result = checkPremiumAccess(`${KEY_PREFIX_LIVE}x`, {
      tier: "monitor",
      prefix: "live",
    });
    assert.equal(result.allowed, true);
  });

  it("blocks free tier on live prefix (production free keys)", () => {
    const result = checkPremiumAccess(`${KEY_PREFIX_LIVE}free`, {
      tier: "free",
      prefix: "live",
    });
    assert.equal(result.allowed, false);
  });
});

describe("protocol/monitor", () => {
  it("creates and retrieves a monitor", async () => {
    const keyHash = `test-${Date.now()}`;
    const monitor = await createMonitor(keyHash, {
      asset_type: "real_estate",
      jurisdiction: "luxembourg",
      structure: "spv",
      alert_on: ["regulation_update"],
    });
    assert.ok(monitor.id.startsWith("mon_"));
    const fetched = await getMonitor(monitor.id, keyHash);
    assert.ok(fetched);
    assert.equal(fetched?.jurisdiction, "luxembourg");

    const count = await countActiveMonitors(keyHash);
    assert.equal(count, 1);

    const deleted = await deleteMonitor(monitor.id, keyHash);
    assert.equal(deleted, true);
  });

  it("matches ESMA feed to monitor profile", () => {
    const updates = updatesForMonitor({
      jurisdiction: "luxembourg",
      asset_type: "real_estate",
      alert_on: ["regulation_update", "deadline_approaching"],
    });
    assert.ok(updates.length >= 1);
    assert.ok(updates.every((u) => u.url.includes("esma.europa.eu") || u.url.includes("amf-france.org") || u.url.includes("bafin.de")));
  });
});

describe("protocol/dossier", () => {
  it("generates dossier payload and signed download token", async () => {
    const keyHash = `dos-${Date.now()}`;
    const payload = await generateDossierPayload(keyHash, {
      score: {
        description: "Entrepôt retail Luxembourg €2.5M SPV investisseurs professionnels",
        asset_type: "real_estate",
      },
      format: "pdf",
    });
    assert.ok(payload.score.score >= 0);
    assert.ok(payload.checklist);

    const stored = await getDossierPayload(payload.id, keyHash);
    assert.ok(stored);

    const token = createDossierDownloadToken({
      dossierId: payload.id,
      keyHash,
      format: "pdf",
    });
    const verified = verifyDossierDownloadToken(token);
    assert.ok(verified);
    assert.equal(verified?.dossierId, payload.id);
  });
});

describe("protocol/webhooks", () => {
  it("signs and verifies webhook payloads", () => {
    const body = JSON.stringify({ event: "regulation_update", test: true });
    const header = webhookSignatureHeader(body);
    assert.ok(header.startsWith("sha256="));
    assert.equal(verifyWebhookSignature(body, header), true);
    assert.equal(verifyWebhookSignature(body, "sha256=invalid"), false);
    assert.equal(signWebhookPayload(body).length, 64);
  });

  it("registers and deletes webhooks", async () => {
    const keyHash = `wh-${Date.now()}`;
    const wh = await registerWebhook(keyHash, {
      url: "https://example.com/hook",
      events: ["regulation_update"],
    });
    assert.ok(wh.id.startsWith("wh_"));
    const deleted = await deleteWebhook(wh.id, keyHash);
    assert.equal(deleted, true);
  });

  it("logs failed deliveries and moves to dead_letter after max attempts", async () => {
    const { webhookRetryDelayMs, WEBHOOK_MAX_DELIVERY_ATTEMPTS } = await import(
      "../lib/protocol/webhooks/constants"
    );
    const {
      enqueueWebhookDelivery,
      attemptDelivery,
      getDelivery,
      listDeliveriesForWebhook,
      replayDelivery,
    } = await import("../lib/protocol/webhooks/deliveries");

    assert.equal(webhookRetryDelayMs(1), 60_000);
    assert.equal(WEBHOOK_MAX_DELIVERY_ATTEMPTS, 5);

    const keyHash = `whd-${Date.now()}`;
    const webhookId = `wh_test_${Date.now()}`;
    const payload = {
      event: "regulation_update",
      severity: "low" as const,
      impact_on_score: 0,
      summary: "test delivery",
      timestamp: new Date().toISOString(),
      disclaimer: "test",
    };

    const first = await enqueueWebhookDelivery({
      url: "http://127.0.0.1:1/unreachable",
      payload,
      key_hash: keyHash,
      webhook_id: webhookId,
    });
    assert.equal(first.ok, false);
    assert.equal(first.delivery.status, "failed");
    assert.equal(first.delivery.attempts, 1);
    assert.ok(first.delivery.next_retry_at);

    let record = first.delivery;
    while (record.attempts < WEBHOOK_MAX_DELIVERY_ATTEMPTS) {
      const next = await attemptDelivery(record);
      record = next.delivery;
    }
    assert.equal(record.status, "dead_letter");
    assert.equal(record.attempts, WEBHOOK_MAX_DELIVERY_ATTEMPTS);

    const fetched = await getDelivery(record.id, keyHash);
    assert.ok(fetched);
    assert.equal(fetched?.status, "dead_letter");

    const { total } = await listDeliveriesForWebhook(webhookId, keyHash);
    assert.ok(total >= 1);

    const replay = await replayDelivery(record.id, keyHash);
    assert.ok(replay);
    assert.equal(replay?.delivery.attempts, 1);
    assert.notEqual(replay?.delivery.status, "dead_letter");
  });
});
