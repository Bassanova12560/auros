import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  estimatedMinutesLeft,
  phaseCount,
  stepPositionInPhase,
  stepReassuranceForStep,
} from "../lib/wizard-journey-i18n";

describe("wizard journey", () => {
  it("estimates remaining time decreases toward end", () => {
    assert.ok(estimatedMinutesLeft(1) > estimatedMinutesLeft(14));
    assert.equal(estimatedMinutesLeft(15), 1);
  });

  it("maps step position within phase", () => {
    assert.deepEqual(stepPositionInPhase(1), {
      indexInPhase: 1,
      totalInPhase: 5,
    });
    assert.deepEqual(stepPositionInPhase(6), {
      indexInPhase: 1,
      totalInPhase: 4,
    });
    assert.deepEqual(stepPositionInPhase(15), {
      indexInPhase: 1,
      totalInPhase: 1,
    });
  });

  it("exposes four phases", () => {
    assert.equal(phaseCount(), 4);
  });

  it("returns reassurance only on selected heavy steps", () => {
    assert.ok(stepReassuranceForStep(2, "fr"));
    assert.equal(stepReassuranceForStep(3, "fr"), null);
  });
});
