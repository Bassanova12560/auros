import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeFinalScore,
  gradeFromFinalScore,
  WETS_WEIGHTS,
} from "@/lib/wets/constants";
import { heuristicWetsCriteria } from "@/lib/wets/heuristic";

describe("wets", () => {
  it("grades final score bands", () => {
    assert.equal(gradeFromFinalScore(8.1), "A");
    assert.equal(gradeFromFinalScore(6), "B");
    assert.equal(gradeFromFinalScore(4), "C");
    assert.equal(gradeFromFinalScore(3.9), "D");
  });

  it("heuristic returns five weighted criteria", () => {
    const c = heuristicWetsCriteria({
      name: "Water150",
      description:
        "Tokenized water rights Michigan data center cooling SPV concession",
      jurisdiction: "Michigan",
      legal_structure: "SPV",
      website_url: "https://example.com",
      category: "data_center_water",
    });
    assert.equal(c.length, 5);
    assert.ok(
      Math.abs(
        c.reduce((s, x) => s + x.weight, 0) -
          Object.values(WETS_WEIGHTS).reduce((a, b) => a + b, 0)
      ) < 0.001
    );
    const final = computeFinalScore(c);
    assert.ok(final >= 0 && final <= 10);
  });
});
