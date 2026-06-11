import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { JURISDICTIONS } from "../lib/jurisdictions/data";
import {
  ASSET_MULTIPLIER,
  DEAL_SIZE_MULTIPLIER,
  SETUP_SPLIT,
  computeCostEstimate,
} from "../lib/cost-estimator/estimates";

describe("cost-estimator/estimates", () => {
  it("returns a breakdown that sums to setup totals (within rounding)", () => {
    const est = computeCostEstimate({
      assetType: "bonds",
      dealSize: "500k_2m",
      jurisdiction: "france",
    });
    const splitSumMin = est.breakdown
      .filter((l) => l.id !== "ongoing")
      .reduce((s, l) => s + l.minEur, 0);
    const splitSumMax = est.breakdown
      .filter((l) => l.id !== "ongoing")
      .reduce((s, l) => s + l.maxEur, 0);
    assert.ok(splitSumMin >= est.setupMinEur * 0.95);
    assert.ok(splitSumMax <= est.setupMaxEur * 1.05);
    assert.ok(est.setupMinEur <= est.setupMaxEur);
    assert.ok(est.ongoingMinEur <= est.ongoingMaxEur);
    assert.equal(
      est.totalFirstYearMinEur,
      est.setupMinEur + est.ongoingMinEur
    );
    assert.equal(
      est.totalFirstYearMaxEur,
      est.setupMaxEur + est.ongoingMaxEur
    );
  });

  it("uses jurisdiction data for France bonds baseline", () => {
    const france = JURISDICTIONS.find((j) => j.id === "france")!;
    const est = computeCostEstimate({
      assetType: "bonds",
      dealSize: "under_500k",
      jurisdiction: "france",
    });
    assert.equal(est.jurisdictionId, "france");
    assert.equal(est.jurisdictionRecommended, false);
    assert.ok(est.setupMinEur >= france.feeMinEur);
    assert.ok(est.setupMaxEur >= est.setupMinEur);
    assert.equal(est.delayMinMonths, france.delayMinMonths);
    assert.equal(est.delayMaxMonths, france.delayMaxMonths);
  });

  it("scales up with deal size and asset complexity", () => {
    const small = computeCostEstimate({
      assetType: "bonds",
      dealSize: "under_500k",
      jurisdiction: "bahrain",
    });
    const large = computeCostEstimate({
      assetType: "real_estate",
      dealSize: "over_10m",
      jurisdiction: "bahrain",
    });
    assert.ok(large.setupMinEur > small.setupMinEur);
    assert.ok(large.ongoingMaxEur > small.ongoingMaxEur);
  });

  it("recommends a jurisdiction when choice is recommend", () => {
    const est = computeCostEstimate({
      assetType: "funds",
      dealSize: "500k_2m",
      jurisdiction: "recommend",
    });
    assert.equal(est.jurisdictionRecommended, true);
    assert.ok(JURISDICTIONS.some((j) => j.id === est.jurisdictionId));
  });

  it("setup split ratios sum to 1", () => {
    const sum = SETUP_SPLIT.legal + SETUP_SPLIT.licensing + SETUP_SPLIT.audit;
    assert.equal(sum, 1);
  });

  it("documents asset and deal multipliers above baseline", () => {
    assert.equal(ASSET_MULTIPLIER.bonds, 1);
    assert.ok(ASSET_MULTIPLIER.real_estate > ASSET_MULTIPLIER.bonds);
    assert.equal(DEAL_SIZE_MULTIPLIER.under_500k, 1);
    assert.ok(DEAL_SIZE_MULTIPLIER.over_10m > DEAL_SIZE_MULTIPLIER["500k_2m"]);
  });
});
