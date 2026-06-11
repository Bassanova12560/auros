import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeUnifiedWizardScore,
  wizardToProtocolInput,
} from "../lib/wizard-scoring-unified";
import { initialWizardData } from "../lib/wizard-constants";

describe("wizard-scoring-unified", () => {
  it("explore mode returns ease summary and wizard score", () => {
    const data = {
      ...initialWizardData,
      assetType: "Real estate",
      description: "Luxury apartment Paris 2M EUR professional investors",
      valueBucket: "500k_2m" as const,
      country: "France",
      goals: ["liquidity"],
      email: "test@example.com",
      marketingConsent: true,
    };
    const result = computeUnifiedWizardScore("explore", data, "fr");
    assert.equal(result.mode, "explore");
    if (result.mode !== "explore") return;
    assert.ok(result.score.score >= 0 && result.score.score <= 100);
    assert.equal(result.ease.priorities.length <= 3, true);
  });

  it("pro mode returns protocol breakdown with 5 dimensions", () => {
    const data = {
      ...initialWizardData,
      assetType: "Real estate",
      description:
        "Luxembourg retail warehouse €3M SPV whitepaper ready professional investors KYC AML data room",
      estimatedValue: 3_000_000,
      country: "Luxembourg",
      city: "Luxembourg",
      legalStructure: "Through a company / SCI",
      investorProfile: "Institutional investors",
      documents: ["proof_of_ownership", "valuation_report", "spv_documents"],
      mica: {
        issuerType: "company_spv",
        assetClass: "financial_instrument",
        euNexus: "issuer_eu",
        whitepaper: "ready",
        investorType: "professional",
      },
    };
    const result = computeUnifiedWizardScore("pro", data, "fr");
    assert.equal(result.mode, "pro");
    if (result.mode !== "pro") return;
    assert.ok(result.protocol.score >= 0 && result.protocol.score <= 100);
    assert.equal(Object.keys(result.protocol.breakdown).length, 5);
    assert.ok(result.jurisdictions.recommendations.length >= 1);
    assert.ok(result.mica !== null);
  });

  it("maps wizard data to protocol input", () => {
    const input = wizardToProtocolInput({
      ...initialWizardData,
      assetType: "Real estate",
      description: "Paris apartment",
      estimatedValue: 1_500_000,
      legalStructure: "Through a company / SCI",
      investorProfile: "Accredited investors only",
      documents: ["proof_of_ownership"],
    });
    assert.equal(input.asset_type, "real_estate");
    assert.equal(input.issuer_type, "company_spv");
    assert.equal(input.investor_type, "professional");
    assert.equal(input.documents_count, 1);
  });
});
