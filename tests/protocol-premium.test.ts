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
  it("allows live keys", () => {
    const result = checkPremiumAccess(`${KEY_PREFIX_LIVE}abc123`);
    assert.equal(result.allowed, true);
  });

  it("blocks free test keys", () => {
    const result = checkPremiumAccess(`${KEY_PREFIX_TEST}abc123`);
    assert.equal(result.allowed, false);
  });

  it("allows premium tier records", () => {
    const result = checkPremiumAccess(`${KEY_PREFIX_TEST}x`, { tier: "premium", prefix: "test" });
    assert.equal(result.allowed, true);
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
    assert.ok(updates.every((u) => u.source_url.includes("esma.europa.eu")));
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
});
