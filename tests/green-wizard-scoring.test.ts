import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getGreenScoringCopy } from "@/lib/green/scoring-i18n";
import { resolveCarbonQualityBatchItem } from "@/lib/green/scoring/carbon-quality-batch";
import { computeWizardGreenScores } from "@/lib/green/scoring/wizard-green-scores";
import { GREEN_WIZARD_ASSET_TYPE } from "@/lib/green/constants";
import type { WizardData } from "@/lib/wizard-types";

function baseWizard(overrides: Partial<WizardData> = {}): WizardData {
  return {
    assetType: GREEN_WIZARD_ASSET_TYPE,
    description: "Parc solaire 10 MW PPA signé production MWh",
    estimatedValue: 2_000_000,
    currency: "EUR",
    city: "Marseille",
    country: "France",
    documents: ["business_plan"],
    goals: [],
    timeline: "",
    platform: "",
    firstName: "",
    email: "",
    legalStructure: "",
    incomeType: "",
    incomeAmountYear: 0,
    incomeDescription: "",
    legalStatus: [],
    investorProfile: "",
    additionalNotes: "",
    ...overrides,
  };
}

describe("green/wizard-scores", () => {
  it("computes watt score for renewable wizard", () => {
    const scores = computeWizardGreenScores(baseWizard());
    assert.ok(scores);
    assert.ok(scores!.watt);
    assert.ok(scores!.watt!.rating >= 0 && scores!.watt!.rating <= 100);
    assert.equal(scores!.carbon_quality, null);
  });

  it("computes CQS for carbon wizard text", () => {
    const scores = computeWizardGreenScores(
      baseWizard({
        description: "Portfolio crédits carbone Verra VCS retired Gold Standard CCP",
        assetType: "other",
      })
    );
    assert.ok(scores);
    assert.ok(scores!.carbon_quality);
    assert.ok(scores!.carbon_quality!.score >= 0);
  });

  it("limits priorities to three", () => {
    const scores = computeWizardGreenScores(
      baseWizard({
        description: "carbon offset on-chain polygon token vintage expir",
        assetType: "other",
      })
    );
    assert.ok(scores);
    assert.ok(scores!.priority_keys.length <= 3);
  });

  it("returns null for non-green context", () => {
    const scores = computeWizardGreenScores(
      baseWizard({
        assetType: "real_estate",
        description: "Immeuble bureaux Paris",
      })
    );
    assert.equal(scores, null);
  });
});

describe("green/carbon-quality-batch", () => {
  it("resolves compare id toucan", () => {
    const out = resolveCarbonQualityBatchItem({ id: "toucan" });
    assert.equal(out.ok, true);
    if (out.ok) assert.ok(out.result.score > 0);
  });

  it("resolves free text profile", () => {
    const out = resolveCarbonQualityBatchItem({
      text: "Gold Standard credits retired additionality permanence CCP",
    });
    assert.equal(out.ok, true);
    if (out.ok) assert.ok(out.result.score >= 40);
  });

  it("rejects unknown compare id", () => {
    const out = resolveCarbonQualityBatchItem({ id: "unknown-protocol-xyz" });
    assert.equal(out.ok, false);
    if (!out.ok) assert.equal(out.code, "not_found");
  });
});

describe("green/scoring-i18n", () => {
  it("exposes copy in FR/EN/ES", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const copy = getGreenScoringCopy(locale);
      assert.ok(copy.wattLabel.length > 3);
      assert.ok(copy.priorities.cqs_ccp.length > 10);
    }
  });
});
