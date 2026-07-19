import assert from "node:assert/strict";
import { describe, it, before } from "node:test";

import {
  buildChargeflowCanonical,
  chargeflowContentSha256,
  chargeflowCreateRequestSchema,
  isChargeflowContentHash,
  signChargeflowHash,
  stableStringify,
  verifyChargeflowSignature,
  enrichChargeflowWithWatt,
} from "../lib/chargeflow";

const sampleInput = {
  session: {
    external_session_id: "sess_test_001",
    started_at: "2026-07-19T10:00:00Z",
    ended_at: "2026-07-19T10:42:00Z",
    energy_kwh: 48.2,
    location: { country: "FR", site_id: "site_lyon_01" },
    vehicle_ref: "veh_opaque_9f2a",
    operator_id: "cpo_demo",
    source_format: "json_custom" as const,
  },
  attributes: {
    renewable_claim: "go" as const,
  },
};

describe("chargeflow signing", () => {
  before(() => {
    if (!process.env.ATTEST_SIGNING_KEY && !process.env.CRON_SECRET) {
      process.env.ATTEST_SIGNING_KEY = "test-chargeflow-signing-key-v1";
    }
  });

  it("signs and verifies content hash", () => {
    const hash = "a".repeat(64);
    const sig = signChargeflowHash(hash);
    assert.ok(sig);
    assert.equal(sig!.length, 64);
    assert.equal(verifyChargeflowSignature(hash, sig!), true);
    assert.equal(verifyChargeflowSignature(hash, "b".repeat(64)), false);
  });

  it("rejects malformed hashes", () => {
    assert.equal(isChargeflowContentHash("short"), false);
    assert.equal(signChargeflowHash("not-a-hash"), null);
  });

  it("stableStringify sorts object keys", () => {
    assert.equal(stableStringify({ b: 1, a: 2 }), '{"a":2,"b":1}');
  });
});

describe("chargeflow schema + canonical", () => {
  before(() => {
    if (!process.env.ATTEST_SIGNING_KEY && !process.env.CRON_SECRET) {
      process.env.ATTEST_SIGNING_KEY = "test-chargeflow-signing-key-v1";
    }
  });

  it("parses sample session", () => {
    const parsed = chargeflowCreateRequestSchema.safeParse(sampleInput);
    assert.equal(parsed.success, true);
  });

  it("produces stable sha256 for same session", () => {
    const parsed = chargeflowCreateRequestSchema.parse(sampleInput);
    const auros = enrichChargeflowWithWatt(parsed);
    const canonical = buildChargeflowCanonical(
      "cfu_e_testunit0001",
      parsed,
      auros,
      "2026-07-19T12:00:00.000Z"
    );
    const hash1 = chargeflowContentSha256(canonical);
    const hash2 = chargeflowContentSha256(canonical);
    assert.equal(hash1, hash2);
    assert.equal(isChargeflowContentHash(hash1), true);
    assert.equal(canonical.standard, "AUROS-ChargeFlow-CFU-E");
    assert.ok(typeof auros.watt_rating === "number");

    const sig = signChargeflowHash(hash1);
    assert.ok(sig);
    assert.equal(verifyChargeflowSignature(hash1, sig!), true);
  });
});
