import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { resolveScoreWeights, requiresPremiumWeights } from "@/lib/protocol/scoring/weight-profiles";
import { computeProtocolScore } from "@/lib/protocol/scoring/compute-score";

describe("protocol scoring weights", () => {
  it("default weights sum to 100", () => {
    const r = resolveScoreWeights({});
    const sum = Object.values(r.applied).reduce((a, b) => a + b, 0);
    assert.equal(r.source, "default");
    assert.ok(Math.abs(sum - 100) < 0.1);
  });

  it("real_estate_fund profile shifts legal_structure weight", () => {
    const r = resolveScoreWeights({ profile: "real_estate_fund" });
    assert.equal(r.source, "profile");
    assert.equal(r.applied.legal_structure, 30);
  });

  it("normalizes custom weights when sum != 100", () => {
    const r = resolveScoreWeights({
      weights: { legal_structure: 50, mica_compliance: 60 },
    });
    assert.equal(r.source, "custom");
    assert.equal(r.normalized, true);
  });

  it("requires premium for custom weights", () => {
    assert.equal(requiresPremiumWeights({ weights: { legal_structure: 40 } }), true);
    assert.equal(requiresPremiumWeights({ profile: "credit_fund" }), true);
    assert.equal(requiresPremiumWeights({}), false);
  });

  it("custom weights change aggregate score", () => {
    const base = computeProtocolScore({
      description: "Luxembourg warehouse SPV professional investors whitepaper draft KYC data room",
      asset_type: "real_estate",
    });
    const weighted = computeProtocolScore({
      description: "Luxembourg warehouse SPV professional investors whitepaper draft KYC data room",
      asset_type: "real_estate",
      weights: { legal_structure: 70, kyc_aml: 10, mica_compliance: 10, data_room: 5, investor_protection: 5 },
    });
    assert.ok(base.meta.weights_applied);
    assert.ok(weighted.meta.weights_applied);
    assert.notEqual(base.score, weighted.score);
  });
});
