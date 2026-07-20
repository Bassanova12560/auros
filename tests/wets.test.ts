import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  WETS_CRITERIA,
  computeFinalScore,
  gradeFromFinalScore,
  weightsForCategory,
} from "@/lib/wets/constants";
import { heuristicWetsCriteria } from "@/lib/wets/heuristic";
import { mergeCriteriaWithDefaults } from "@/lib/wets/merge-criteria";
import { QUANTUM_EXPOSURE_VERTICALS } from "@/lib/wets/quantum-exposure";

describe("wets v2", () => {
  it("has seven criteria with weights summing to 1", () => {
    assert.equal(WETS_CRITERIA.length, 7);
    for (const cat of [
      "water_rights",
      "energy_infra",
      "energy_microgrid",
      "data_center_water",
    ] as const) {
      const w = weightsForCategory(cat);
      const sum = Object.values(w).reduce((a, b) => a + b, 0);
      assert.ok(Math.abs(sum - 1) < 0.001, `${cat} weights=${sum}`);
    }
  });

  it("energy weights prioritize grid interconnection", () => {
    const e = weightsForCategory("energy_infra");
    const w = weightsForCategory("water_rights");
    assert.ok(e.grid_interconnection_realism > w.grid_interconnection_realism);
  });

  it("heuristic returns seven criteria", () => {
    const c = heuristicWetsCriteria({
      name: "AI campus microgrid",
      description:
        "Behind-the-meter SMR + battery, SPV, transfer agent re-issue on key compromise, Michigan cooling",
      jurisdiction: "Michigan",
      legal_structure: "SPV + transfer agent",
      website_url: "https://example.com",
      category: "energy_microgrid",
    });
    assert.equal(c.length, 7);
    assert.ok(computeFinalScore(c) > 0);
    assert.ok(c.find((x) => x.category === "grid_interconnection_realism")!.score >= 6);
  });

  it("merge fills missing v1 criteria", () => {
    const merged = mergeCriteriaWithDefaults("energy_infra", [
      {
        category: "legal_legitimacy",
        score: 5,
        weight: 0.3,
        justification: "old",
        sources: [],
      },
    ]);
    assert.equal(merged.length, 7);
    assert.equal(merged[0]!.score, 5);
    assert.ok(
      merged.some((c) => c.category === "post_quantum_legal_recourse")
    );
  });

  it("grades bands", () => {
    assert.equal(gradeFromFinalScore(8.1), "A");
    assert.equal(gradeFromFinalScore(3.9), "D");
  });

  it("quantum exposure index has verticals", () => {
    assert.ok(QUANTUM_EXPOSURE_VERTICALS.length >= 5);
  });
});
