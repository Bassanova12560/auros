import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeMicaReadiness } from "../lib/mica-checker/scoring";
import type { MicaAnswers } from "../lib/mica-checker/types";

const STRONG: Required<MicaAnswers> = {
  issuerType: "company_spv",
  assetClass: "art_utility",
  euNexus: "no_eu",
  whitepaper: "ready",
  investorType: "professional",
};

const WEAK: Required<MicaAnswers> = {
  issuerType: "individual",
  assetClass: "e_money",
  euNexus: "unsure",
  whitepaper: "none",
  investorType: "retail",
};

describe("mica-checker/scoring", () => {
  it("returns null for incomplete answers", () => {
    assert.equal(computeMicaReadiness({ ...STRONG, whitepaper: null }), null);
  });

  it("scores strong profile higher than weak profile", () => {
    const strong = computeMicaReadiness(STRONG);
    const weak = computeMicaReadiness(WEAK);
    assert.ok(strong);
    assert.ok(weak);
    assert.ok(strong.score > weak.score);
    assert.ok(strong.score >= 72);
    assert.ok(weak.score < 48);
  });

  it("returns at most three recommendations", () => {
    const result = computeMicaReadiness(WEAK);
    assert.ok(result);
    assert.equal(result.recommendations.length, 3);
    assert.ok(result.recommendations.every((r) => r.id.length > 0));
  });
});
