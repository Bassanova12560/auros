import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  pickPlatformFromCandidates,
  resolveWebhookTarget,
} from "@/lib/platforms/resolve-platform-pure";
import type { PartnerRecord } from "@/lib/partners/types";

function platform(
  partial: Partial<PartnerRecord> & Pick<PartnerRecord, "id" | "code" | "company">
): PartnerRecord {
  return {
    email: "ops@example.com",
    contact_name: null,
    clerk_user_id: null,
    status: "active",
    kind: "platform",
    webhook_url: null,
    webhook_secret: null,
    created_at: "2026-07-19T00:00:00.000Z",
    activated_at: "2026-07-19T00:00:00.000Z",
    ...partial,
  };
}

describe("platform resolve", () => {
  it("prefers referred_by code over wizard platform string", () => {
    const a = platform({ id: "1", code: "PLAT-A", company: "Alpha" });
    const b = platform({ id: "2", code: "PLAT-B", company: "Beta RWA" });
    const picked = pickPlatformFromCandidates([a, b], "Beta RWA", "PLAT-A");
    assert.equal(picked?.code, "PLAT-A");
  });

  it("matches wizard platform by company substring", () => {
    const a = platform({ id: "1", code: "PLAT-A", company: "Alpha Chain" });
    const b = platform({ id: "2", code: "PLAT-B", company: "Beta RWA" });
    const picked = pickPlatformFromCandidates([a, b], "beta rwa france", null);
    assert.equal(picked?.code, "PLAT-B");
  });

  it("ignores apporteur candidates", () => {
    const a = platform({
      id: "1",
      code: "CAB",
      company: "Notaire",
      kind: "apporteur",
    });
    assert.equal(pickPlatformFromCandidates([a], "Notaire", "CAB"), null);
  });
});

describe("webhook target", () => {
  it("uses tenant webhook when set", () => {
    const p = platform({
      id: "1",
      code: "P",
      company: "X",
      webhook_url: "https://hooks.example/x",
      webhook_secret: "sec",
    });
    const t = resolveWebhookTarget(p);
    assert.equal(t.source, "tenant");
    assert.equal(t.url, "https://hooks.example/x");
    assert.equal(t.secret, "sec");
  });

  it("falls back to env when tenant has no URL", () => {
    const prev = process.env.PARTNER_WEBHOOK_URL;
    process.env.PARTNER_WEBHOOK_URL = "https://env.example/hook";
    process.env.PARTNER_WEBHOOK_SECRET = "envsec";
    try {
      const p = platform({ id: "1", code: "P", company: "X" });
      const t = resolveWebhookTarget(p);
      assert.equal(t.source, "env");
      assert.equal(t.url, "https://env.example/hook");
    } finally {
      if (prev === undefined) delete process.env.PARTNER_WEBHOOK_URL;
      else process.env.PARTNER_WEBHOOK_URL = prev;
      delete process.env.PARTNER_WEBHOOK_SECRET;
    }
  });
});
