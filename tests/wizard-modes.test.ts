import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  bucketMidpoint,
  EXPLORE_STEPS,
  firstStepOfPhaseForMode,
  modeFromLegacyExpert,
  nextStepForMode,
  parseWizardMode,
  phaseIndexForStep,
  PRO_STEPS,
  stepCountForMode,
  WIZARD_TIER_AMOUNTS,
} from "../lib/wizard-modes";

describe("wizard-modes", () => {
  it("parses explore and pro modes", () => {
    assert.equal(parseWizardMode("explore"), "explore");
    assert.equal(parseWizardMode("pro"), "pro");
    assert.equal(parseWizardMode("invalid"), null);
  });

  it("maps legacy expert to explore", () => {
    assert.equal(modeFromLegacyExpert(true), "explore");
    assert.equal(modeFromLegacyExpert(false), "pro");
  });

  it("explore has 5 question steps + recap", () => {
    assert.deepEqual(EXPLORE_STEPS, [1, 2, 3, 6, 9, 15]);
    assert.equal(stepCountForMode("explore"), 5);
  });

  it("pro has 19 question steps + recap", () => {
    assert.equal(PRO_STEPS.filter((s) => s !== 15).length, 19);
    assert.equal(stepCountForMode("pro"), 19);
  });

  it("navigates explore forward", () => {
    assert.equal(nextStepForMode("explore", 3), 6);
    assert.equal(nextStepForMode("explore", 9), 15);
    assert.equal(nextStepForMode("explore", 15), null);
  });

  it("maps explore steps to 4 phases", () => {
    assert.equal(phaseIndexForStep("explore", 1), 0);
    assert.equal(phaseIndexForStep("explore", 6), 1);
    assert.equal(phaseIndexForStep("explore", 9), 2);
    assert.equal(phaseIndexForStep("explore", 15), 3);
    assert.equal(firstStepOfPhaseForMode("explore", 0), 1);
    assert.equal(firstStepOfPhaseForMode("explore", 3), 15);
  });

  it("value bucket midpoints are sensible", () => {
    assert.equal(bucketMidpoint("under_100k"), 50_000);
    assert.equal(bucketMidpoint("100k_500k"), 300_000);
    assert.equal(bucketMidpoint("over_2m"), 3_000_000);
  });

  it("tier amounts match spec", () => {
    assert.equal(WIZARD_TIER_AMOUNTS.starter, 49_000);
    assert.equal(WIZARD_TIER_AMOUNTS.pro, 199_000);
    assert.equal(WIZARD_TIER_AMOUNTS.institutional, 499_000);
  });
});
