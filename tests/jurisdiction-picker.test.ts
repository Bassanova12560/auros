import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { JURISDICTIONS } from "../lib/jurisdictions/data";
import { rankJurisdictions } from "../lib/jurisdiction-picker/scoring";

describe("jurisdiction-picker/scoring", () => {
  it("returns exactly three recommendations by default", () => {
    const result = rankJurisdictions({ speed: 50, cost: 50, tax: 50 });
    assert.equal(result.recommendations.length, 3);
    assert.ok(result.recommendations.every((r) => r.score >= 0 && r.score <= 100));
    assert.ok(result.recommendations.every((r) => r.rationaleId.length > 0));
  });

  it("prioritizes fast jurisdictions when speed is high", () => {
    const fast = rankJurisdictions({ speed: 100, cost: 0, tax: 0 });
    const top = fast.recommendations[0]!;
    const fastIds = JURISDICTIONS.filter((j) => j.licenseMaxMonths <= 3).map(
      (j) => j.id
    );
    assert.ok(
      fastIds.includes(top.id),
      `expected fast jurisdiction, got ${top.id}`
    );
  });

  it("prioritizes low-cost jurisdictions when cost sensitivity is high", () => {
    const budget = rankJurisdictions({ speed: 0, cost: 100, tax: 0 });
    const top = budget.recommendations[0]!;
    const cheapIds = JURISDICTIONS.filter((j) => j.totalCostMid <= 15_000).map(
      (j) => j.id
    );
    assert.ok(
      cheapIds.includes(top.id),
      `expected budget jurisdiction, got ${top.id}`
    );
  });

  it("filters by asset type", () => {
    const fundsOnly = rankJurisdictions(
      { speed: 50, cost: 50, tax: 50 },
      "funds"
    );
    for (const rec of fundsOnly.recommendations) {
      const j = JURISDICTIONS.find((row) => row.id === rec.id);
      assert.ok(j?.assetTypes.includes("funds"));
    }
  });

  it("sorts recommendations by descending score", () => {
    const result = rankJurisdictions({ speed: 30, cost: 70, tax: 90 });
    const scores = result.recommendations.map((r) => r.score);
    assert.deepEqual(scores, [...scores].sort((a, b) => b - a));
  });
});
