import assert from "node:assert/strict";
import { describe, it, before } from "node:test";

import {
  buildChargeflowCanonical,
  buildChargeflowWCanonical,
  chargeflowContentSha256,
  chargeflowCreateRequestSchema,
  chargeflowWCreateRequestSchema,
  createChargeflowUnit,
  createChargeflowWUnit,
  enrichChargeflowWithH2o,
  enrichChargeflowWithWatt,
  isChargeflowContentHash,
  retireChargeflowRecord,
  signChargeflowHash,
  stableStringify,
  verifyChargeflowSignature,
} from "../lib/chargeflow";

const sampleE = {
  session: {
    external_session_id: "sess_test_uniq_001",
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

const sampleW = {
  flow: {
    external_flow_id: "flow_test_uniq_001",
    started_at: "2026-07-01T00:00:00Z",
    ended_at: "2026-07-31T23:59:59Z",
    volume_m3: 125000,
    location: { country: "FR", basin_id: "seine" },
    operator_id: "utility_demo",
    source_format: "json_custom" as const,
  },
  attributes: {
    asset_class_hint: "concession" as const,
  },
};

describe("chargeflow signing", () => {
  before(() => {
    if (!process.env.ATTEST_SIGNING_KEY && !process.env.CRON_SECRET) {
      process.env.ATTEST_SIGNING_KEY = "test-chargeflow-signing-key-v1";
    }
  });

  it("signs and verifies content hash for E and W prefixes", () => {
    const hash = "a".repeat(64);
    const sigE = signChargeflowHash(hash, "e");
    const sigW = signChargeflowHash(hash, "w");
    assert.ok(sigE);
    assert.ok(sigW);
    assert.notEqual(sigE, sigW);
    assert.equal(verifyChargeflowSignature(hash, sigE!, "e"), true);
    assert.equal(verifyChargeflowSignature(hash, sigW!, "w"), true);
    assert.equal(verifyChargeflowSignature(hash, sigE!, "w"), false);
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

  it("parses CFU-E and CFU-W samples", () => {
    assert.equal(chargeflowCreateRequestSchema.safeParse(sampleE).success, true);
    assert.equal(chargeflowWCreateRequestSchema.safeParse(sampleW).success, true);
  });

  it("produces stable sha256 for CFU-E", () => {
    const parsed = chargeflowCreateRequestSchema.parse(sampleE);
    const auros = enrichChargeflowWithWatt(parsed);
    const canonical = buildChargeflowCanonical(
      "cfu_e_testunit0001",
      parsed,
      auros,
      "2026-07-19T12:00:00.000Z"
    );
    const hash1 = chargeflowContentSha256(canonical);
    assert.equal(hash1, chargeflowContentSha256(canonical));
    assert.equal(isChargeflowContentHash(hash1), true);
    assert.equal(canonical.standard, "AUROS-ChargeFlow-CFU-E");
  });

  it("produces stable sha256 for CFU-W", () => {
    const parsed = chargeflowWCreateRequestSchema.parse(sampleW);
    const auros = enrichChargeflowWithH2o(parsed);
    const canonical = buildChargeflowWCanonical(
      "cfu_w_testunit0001",
      parsed,
      auros,
      "2026-07-19T12:00:00.000Z"
    );
    const hash1 = chargeflowContentSha256(canonical);
    assert.equal(hash1, chargeflowContentSha256(canonical));
    assert.equal(canonical.standard, "AUROS-ChargeFlow-CFU-W");
    assert.ok(typeof auros.h2o_rating === "number");
    const sig = signChargeflowHash(hash1, "w");
    assert.ok(sig);
    assert.equal(verifyChargeflowSignature(hash1, sig!, "w"), true);
  });
});

describe("chargeflow uniqueness + retirement", () => {
  before(() => {
    if (!process.env.ATTEST_SIGNING_KEY && !process.env.CRON_SECRET) {
      process.env.ATTEST_SIGNING_KEY = "test-chargeflow-signing-key-v1";
    }
  });

  it("rejects duplicate active CFU-E mint then allows after retire", async () => {
    const key = `test_key_${Date.now()}_e`;
    const input = {
      ...sampleE,
      session: {
        ...sampleE.session,
        external_session_id: `sess_${Date.now()}`,
      },
    };
    const first = await createChargeflowUnit(key, input);
    assert.ok(!("error" in first));
    assert.equal(first.record.status, "active");

    const dup = await createChargeflowUnit(key, input);
    assert.ok("error" in dup);
    assert.equal(dup.status, 409);

    const retired = await retireChargeflowRecord(
      first.record.id,
      key,
      "test retire"
    );
    assert.ok(!("error" in retired));
    assert.equal(retired.record.status, "retired");

    const remint = await createChargeflowUnit(key, input);
    assert.ok(!("error" in remint));
    assert.equal(remint.record.status, "active");
    assert.notEqual(remint.record.id, first.record.id);
  });

  it("mints CFU-W with h2o companion", async () => {
    const key = `test_key_${Date.now()}_w`;
    const input = {
      ...sampleW,
      flow: {
        ...sampleW.flow,
        external_flow_id: `flow_${Date.now()}`,
      },
    };
    const result = await createChargeflowWUnit(key, input);
    assert.ok(!("error" in result));
    assert.ok(result.record.id.startsWith("cfu_w_"));
    assert.equal(result.record.unit_kind, "w");
    assert.ok(typeof result.record.public.h2o_rating === "number");
  });
});
