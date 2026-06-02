import assert from "node:assert/strict";
import test from "node:test";

import {
  isDemoContactEmail,
  isDemoContactFirstName,
  sanitizeWizardContactPatch,
} from "@/lib/wizard-test-data";

test("isDemoContactEmail detects test addresses", () => {
  assert.equal(isDemoContactEmail("thomas.martin@test.com"), true);
  assert.equal(isDemoContactEmail("user@example.com"), true);
  assert.equal(isDemoContactEmail("real@company.fr"), false);
});

test("sanitizeWizardContactPatch strips demo values", () => {
  assert.deepEqual(
    sanitizeWizardContactPatch({
      firstName: "Thomas",
      email: "thomas.martin@test.com",
    }),
    {}
  );
  assert.deepEqual(
    sanitizeWizardContactPatch({
      firstName: "Marie",
      email: "marie@entreprise.fr",
    }),
    { firstName: "Marie", email: "marie@entreprise.fr" }
  );
});

test("isDemoContactFirstName", () => {
  assert.equal(isDemoContactFirstName("Thomas"), true);
  assert.equal(isDemoContactFirstName("Marie"), false);
});
