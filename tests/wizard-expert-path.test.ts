import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyExpertDefaults,
  expertStepCount,
  nextExpertStep,
  prevExpertStep,
  WIZARD_EXPERT_STEPS,
} from "../lib/wizard-expert-path";

describe("wizard-expert-path", () => {
  it("has 8 express steps ending at summary", () => {
    assert.equal(expertStepCount(), 8);
    assert.deepEqual(WIZARD_EXPERT_STEPS, [1, 2, 3, 4, 5, 8, 9, 15]);
  });

  it("navigates forward and back", () => {
    assert.equal(nextExpertStep(5), 8);
    assert.equal(nextExpertStep(9), 15);
    assert.equal(nextExpertStep(15), null);
    assert.equal(prevExpertStep(8), 5);
    assert.equal(prevExpertStep(1), null);
  });

  it("fills indicative compliance defaults", () => {
    const d = applyExpertDefaults({
      assetType: "Real estate",
      description: "Test",
      estimatedValue: 100_000,
      currency: "EUR",
      country: "France",
      city: "Paris",
      documents: [],
      goals: [],
      timeline: "",
      platform: "AUROS dossier",
      firstName: "A",
      email: "a@test.com",
      legalStructure: "",
      incomeType: "",
      incomeAmountYear: 0,
      incomeDescription: "",
      legalStatus: [],
      investorProfile: "",
      additionalNotes: "",
      marketingConsent: true,
    });
    assert.ok(d.legalStructure);
    assert.ok(d.legalStatus.length > 0);
    assert.equal(d.investorProfile, "I don't know yet");
  });
});
