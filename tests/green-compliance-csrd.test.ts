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
    assert.equal(result.scope_key, "large_undertaking");
    assert.ok(result.priority_keys.length <= 3);
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
    assert.equal(result.scope_key, "listed_sme");
    assert.ok(result.preparation_score >= 50);
  });

  it("treats revenue+balance threshold as large undertaking without 250 employees", () => {
    const result = computeCsrdScope(
      csrdAnswers({
        employees250: false,
        revenue40m: true,
        balance20m: true,
        listedEu: false,
      })
    );
    assert.equal(result.in_scope, true);
    assert.equal(result.scope_from_year, 2026);
    assert.equal(result.scope_key, "large_undertaking");
  });

  it("does not scope on revenue or balance alone", () => {
    for (const answers of [
      csrdAnswers({ revenue40m: true, balance20m: false }),
      csrdAnswers({ revenue40m: false, balance20m: true }),
    ]) {
      const result = computeCsrdScope(answers);
      assert.equal(result.in_scope, false);
      assert.equal(result.scope_from_year, null);
    }
  });

  it("prefers 2026 scope when listed and also a large undertaking", () => {
    const result = computeCsrdScope(
      csrdAnswers({
        employees250: true,
        listedEu: true,
      })
    );
    assert.equal(result.in_scope, true);
    assert.equal(result.scope_from_year, 2026);
  });

  it("returns out-of-scope label when no criteria match", () => {
    const result = computeCsrdScope(
      csrdAnswers({
        employees250: false,
        revenue40m: false,
        balance20m: false,
        listedEu: false,
      })
    );
    assert.equal(result.in_scope, false);
    assert.equal(result.scope_from_year, null);
    assert.equal(result.scope_key, "out_of_scope");
  });

  it("caps preparation score at 100 and assigns tiers", () => {
    const ready = computeCsrdScope(
      csrdAnswers({
        employees250: true,
        greenAssets: true,
        hasSustainabilityReport: true,
      })
    );
    assert.equal(ready.preparation_score, 90);
    assert.equal(ready.preparation_tier, "ready");

    const early = computeCsrdScope(csrdAnswers({}));
    assert.equal(early.preparation_tier, "early");
    assert.ok(early.preparation_score < 45);
  });

  it("limits priorities to three items", () => {
    const result = computeCsrdScope(
      csrdAnswers({
        employees250: true,
        greenAssets: true,
        hasSustainabilityReport: false,
      })
    );
    assert.ok(result.priority_keys.length <= 3);
    assert.ok(result.priority_keys.includes("sustainability_report"));
    assert.ok(result.priority_keys.includes("esrs_datapoints"));
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
    assert.ok(score.priority_keys.length <= 3);
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
