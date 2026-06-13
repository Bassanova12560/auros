import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeCsrdScope } from "@/lib/green/csrd-check/scoring";
import type { CsrdAnswers } from "@/lib/green/csrd-check/types";
import {
  computeGreenComplianceScore,
  detectGreenAssetClass,
  isGreenWizardContext,
} from "@/lib/green/scoring/green-compliance";
import { GREEN_WIZARD_ASSET_TYPE } from "@/lib/green/constants";
import { normalizeWizardData } from "@/lib/wizard-types";

function csrdAnswers(partial: Partial<CsrdAnswers>): CsrdAnswers {
  return {
    employees250: null,
    revenue40m: null,
    balance20m: null,
    listedEu: null,
    greenAssets: null,
    hasSustainabilityReport: null,
    ...partial,
  };
}

describe("green/csrd-check", () => {
  it("flags large undertaking in scope from 2026", () => {
    const result = computeCsrdScope(
      csrdAnswers({
        employees250: true,
        revenue40m: false,
        balance20m: false,
        listedEu: false,
        greenAssets: true,
        hasSustainabilityReport: false,
      })
    );
    assert.equal(result.in_scope, true);
    assert.equal(result.scope_from_year, 2026);
    assert.ok(result.priorities.length <= 3);
  });

  it("flags listed SME scope from 2027", () => {
    const result = computeCsrdScope(
      csrdAnswers({
        employees250: false,
        revenue40m: false,
        balance20m: false,
        listedEu: true,
        greenAssets: false,
        hasSustainabilityReport: true,
      })
    );
    assert.equal(result.in_scope, true);
    assert.equal(result.scope_from_year, 2027);
    assert.ok(result.preparation_score >= 50);
  });
});

describe("green/compliance-score", () => {
  it("detects renewable asset class from wizard data", () => {
    const data = normalizeWizardData({
      assetType: GREEN_WIZARD_ASSET_TYPE,
      description: "Parc solaire 5 MW PPA et REC en France",
      documents: ["proof_of_ownership", "valuation_report"],
      legalStructure: "SPV",
      country: "France",
    });
    assert.equal(detectGreenAssetClass(data), "renewable");
    assert.equal(isGreenWizardContext(data), true);
    const score = computeGreenComplianceScore(data);
    assert.ok(score.eu_taxonomy_alignment >= 50);
    assert.ok(score.priorities.length <= 3);
    assert.match(score.disclaimer, /indicatif/i);
  });

  it("detects carbon credits from description", () => {
    const data = normalizeWizardData({
      assetType: "Other",
      description: "Portefeuille crédits carbone Verra VCS avec additionnalité documentée",
      documents: ["legal_opinion", "valuation_report", "prospectus"],
    });
    assert.equal(detectGreenAssetClass(data), "carbon");
    const score = computeGreenComplianceScore(data);
    assert.equal(score.asset_class, "carbon");
  });
});
