import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeNatureScoreForCompareRow,
  computeNatureScoreFromProfile,
  computeNatureScoreFromWizardText,
} from "@/lib/green/scoring/nature-score";
import { computeIcvcmReadiness } from "@/lib/green/scoring/icvcm-readiness";
import { computeScoreBenchmark } from "@/lib/green/scoring/benchmark";
import { computeCarbonQualityFromProfile } from "@/lib/green/scoring/carbon-quality";
import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import { lookupGreenScoreById } from "@/lib/green/api";

describe("green/nature-score", () => {
  it("scores moss above klim on nature dimensions", () => {
    const moss = GREEN_COMPARE_ROWS.find((r) => r.id === "moss")!;
    const klim = GREEN_COMPARE_ROWS.find((r) => r.id === "klim")!;
    const mossScore = computeNatureScoreForCompareRow(moss);
    const klimScore = computeNatureScoreForCompareRow(klim);
    assert.ok(mossScore && klimScore);
    assert.ok(mossScore!.score > klimScore!.score);
  });

  it("returns null for pure solar assets", () => {
    const solar = GREEN_COMPARE_ROWS.find((r) => r.id === "sunexchange")!;
    assert.equal(computeNatureScoreForCompareRow(solar), null);
  });

  it("scores from wizard biodiversity text", () => {
    const result = computeNatureScoreFromWizardText(
      "TNFD nature-based forest conservation credits with community land rights"
    );
    assert.ok(result);
    assert.ok(result!.score >= 45 && result!.score <= 100);
    assert.ok(result!.priority_keys.length <= 3);
  });

  it("profile tiers are consistent", () => {
    const leading = computeNatureScoreFromProfile({
      ecosystem: "forest",
      biodiversity_outcome: "strong",
      tnfd_disclosure: "strong",
      permanence: "strong",
      community_land: "strong",
      mrv_quality: "strong",
    });
    assert.equal(leading.tier, "leading");
  });
});

describe("green/icvcm-readiness", () => {
  it("marks gold standard CCP as ready", () => {
    const cqs = computeCarbonQualityFromProfile({
      registry: "gold_standard",
      ccp_aligned: true,
      additionality: "strong",
      permanence: "strong",
      vintage_risk: "low",
    });
    const readiness = computeIcvcmReadiness(cqs);
    assert.ok(readiness);
    assert.equal(readiness!.status, "ready");
  });
});

describe("green/benchmark", () => {
  it("unified lookup includes benchmark and nature fields", () => {
    const score = lookupGreenScoreById("moss");
    assert.ok(score);
    assert.ok(score!.benchmark.percentile >= 0 && score!.benchmark.percentile <= 100);
    assert.ok(score!.nature_score);
    assert.ok(score!.icvcm_readiness);
    assert.ok(score!.urls.nature.includes("/api/green/nature-score/moss"));
  });

  it("computeScoreBenchmark returns catalog size", () => {
    const bench = computeScoreBenchmark("toucan", 55);
    assert.equal(bench.catalog_size, GREEN_COMPARE_ROWS.length);
  });
});
