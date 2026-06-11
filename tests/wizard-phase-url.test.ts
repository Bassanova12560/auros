import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  isWizardPhaseUrlSlug,
  phaseIndexFromSlug,
  phaseSlugFromIndex,
  WIZARD_PHASE_URL_SLUGS,
} from "@/lib/wizard-phase-url";
import { firstStepOfPhase } from "@/lib/wizard-phases";

describe("wizard/phase-url", () => {
  it("maps slugs to phase indices and first steps", () => {
    assert.equal(WIZARD_PHASE_URL_SLUGS.length, 4);
    assert.equal(phaseIndexFromSlug("actif"), 0);
    assert.equal(phaseIndexFromSlug("strategie"), 1);
    assert.equal(phaseIndexFromSlug("conformite"), 2);
    assert.equal(phaseIndexFromSlug("recap"), 3);
    assert.equal(phaseIndexFromSlug("invalid"), null);
    assert.equal(firstStepOfPhase(phaseIndexFromSlug("strategie")!), 6);
  });

  it("round-trips index to slug", () => {
    for (let i = 0; i < 4; i++) {
      const slug = phaseSlugFromIndex(i);
      assert.ok(slug);
      assert.equal(phaseIndexFromSlug(slug!), i);
      assert.equal(isWizardPhaseUrlSlug(slug!), true);
    }
  });
});
