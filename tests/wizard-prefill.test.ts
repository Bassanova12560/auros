import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  prefillFromCostEstimator,
  prefillFromEstimate,
  prefillFromJurisdictionPicker,
  prefillFromMicaChecker,
} from "../lib/wizard-prefill";

describe("wizard-prefill extensions", () => {
  it("builds mica-checker prefill with pro mode", () => {
    const prefill = prefillFromMicaChecker({
      answers: {
        issuerType: "company_spv",
        assetClass: "financial_instrument",
        euNexus: "issuer_eu",
        whitepaper: "draft",
        investorType: "professional",
      },
      score: 72,
    });
    assert.equal(prefill.mode, "pro");
    assert.equal(prefill.fromTool, "mica-checker");
    assert.equal(prefill.mica?.issuerType, "company_spv");
    assert.equal(prefill.quickScore, 72);
  });

  it("builds estimate prefill with description", () => {
    const prefill = prefillFromEstimate({
      description: "Villa Cannes tokenization",
      quickScore: 65,
    });
    assert.equal(prefill.mode, "explore");
    assert.equal(prefill.fromTool, "estimate");
    assert.equal(prefill.description, "Villa Cannes tokenization");
  });

  it("builds cost-estimator prefill with jurisdiction", () => {
    const prefill = prefillFromCostEstimator({
      assetType: "real_estate",
      dealSize: "500k_2m",
      jurisdictionId: "luxembourg",
    });
    assert.equal(prefill.mode, "explore");
    assert.equal(prefill.fromTool, "cost-estimator");
    assert.equal(prefill.assetType, "Real estate");
    assert.equal(prefill.country, "Luxembourg");
    assert.equal(prefill.valueBucket, "500k_2m");
  });

  it("builds jurisdiction-picker prefill with pro mode", () => {
    const prefill = prefillFromJurisdictionPicker({
      asset: "real_estate",
      priorities: { speed: 80, cost: 20, tax: 50 },
      topJurisdictionId: "dubai-difc",
    });
    assert.equal(prefill.mode, "pro");
    assert.equal(prefill.fromTool, "jurisdiction-picker");
    assert.equal(prefill.country, "UAE");
    assert.deepEqual(prefill.jurisdictionPriorities, {
      speed: 80,
      cost: 20,
      tax: 50,
    });
  });
});
