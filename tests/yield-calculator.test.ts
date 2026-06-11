import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  EU_INFLATION_APY,
  YIELD_BENCHMARKS,
  apyRangeFromRows,
  computeYieldEstimate,
  yieldBarPercent,
} from "../lib/yield-calculator/yields";
import type { ComparatorProductRow } from "../lib/comparators/types";

const sampleBonds: ComparatorProductRow[] = [
  {
    id: "a",
    project: "x",
    platform: "X",
    product: "A",
    apy: 4.2,
    apyBase: null,
    apyReward: null,
    tvlUsd: 1,
    chains: [],
    link: "#",
    affiliate_link: "",
    logo: "",
    live: false,
    category: "sovereign",
  },
  {
    id: "b",
    project: "y",
    platform: "Y",
    product: "B",
    apy: 4.8,
    apyBase: null,
    apyReward: null,
    tvlUsd: 1,
    chains: [],
    link: "#",
    affiliate_link: "",
    logo: "",
    live: false,
    category: "sovereign",
  },
  {
    id: "c",
    project: "z",
    platform: "Z",
    product: "C",
    apy: 0,
    apyBase: null,
    apyReward: null,
    tvlUsd: 1,
    chains: [],
    link: "#",
    affiliate_link: "",
    logo: "",
    live: false,
    category: "structured",
  },
];

describe("yield-calculator/yields", () => {
  it("apyRangeFromRows ignores zero APY rows", () => {
    const range = apyRangeFromRows(sampleBonds, (r) => r.category === "sovereign");
    assert.deepEqual(range, { apyMin: 4.2, apyMax: 4.8 });
  });

  it("apyRangeFromRows returns null when no positive APY", () => {
    assert.equal(
      apyRangeFromRows([{ ...sampleBonds[2]! }]),
      null
    );
  });

  it("computes annual and monthly returns from amount and APY range", () => {
    const est = computeYieldEstimate({
      amountEur: 10_000,
      assetClass: "tbills",
      holdingMonths: 12,
    });
    assert.equal(est.annualReturnMinEur, 420);
    assert.equal(est.annualReturnMaxEur, 480);
    assert.equal(est.monthlyReturnMinEur, 35);
    assert.equal(est.monthlyReturnMaxEur, 40);
    assert.equal(est.apyMid, (YIELD_BENCHMARKS.tbills.apyMin + YIELD_BENCHMARKS.tbills.apyMax) / 2);
  });

  it("prorates returns for shorter holding periods", () => {
    const est = computeYieldEstimate({
      amountEur: 10_000,
      assetClass: "stablecoins",
      holdingMonths: 6,
    });
    assert.equal(est.annualReturnMinEur, 420);
    assert.ok(est.monthlyReturnMinEur < est.annualReturnMinEur / 12 + 1);
    assert.equal(Math.round(est.monthlyReturnMinEur * 6), 210);
  });

  it("flags inflation comparison for conservative asset classes", () => {
    const tbills = computeYieldEstimate({
      amountEur: 5_000,
      assetClass: "tbills",
    });
    assert.ok(tbills.beatsInflationMin);
    assert.equal(tbills.inflationApy, EU_INFLATION_APY);

    const commodities = computeYieldEstimate({
      amountEur: 5_000,
      assetClass: "commodities",
    });
    assert.equal(commodities.beatsInflationMin, false);
  });

  it("yieldBarPercent caps at 100", () => {
    assert.equal(yieldBarPercent(15), 100);
    assert.equal(yieldBarPercent(7.5), 50);
    assert.equal(yieldBarPercent(0), 0);
  });
});
