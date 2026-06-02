import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { wizardPrefillFromLead, wizardSeedFromLead } from "../lib/jurisdictions/wizard-from-lead";
import { personaHeadline, primaryJurisdictionId } from "../lib/jurisdictions/starter-kit-persona";

describe("jurisdictions/wizard-from-lead", () => {
  it("maps lead to wizard prefill", () => {
    const prefill = wizardPrefillFromLead({
      projectType: "real_estate",
      projectValue: "1to5m",
      jurisdictions: ["luxembourg", "france"],
      firstName: "Ada",
      email: "ada@test.com",
    });
    assert.equal(prefill.assetType, "Real estate");
    assert.equal(prefill.country, "Luxembourg");
    assert.equal(prefill.estimatedValue, 2_500_000);
    assert.equal(prefill.currency, "EUR");
    assert.equal(prefill.fromStarterKit, true);
    assert.equal(prefill.lockedJurisdictionCountry, "Luxembourg");
  });

  it("seeds wizard from starter with locked jurisdiction", () => {
    const seed = wizardSeedFromLead({
      projectType: "real_estate",
      projectValue: "1to5m",
      jurisdictions: ["dubai-difc", "luxembourg"],
      firstName: "Ada",
      email: "ada@test.com",
      locale: "fr",
    });
    assert.equal(seed.fromStarterKit, true);
    assert.deepEqual(seed.lockedJurisdictionIds, ["dubai-difc"]);
    assert.ok(Array.isArray(seed.goals) && seed.goals.length >= 2);
  });
});

describe("jurisdictions/starter-kit-persona", () => {
  it("headline uses project type and jurisdiction", () => {
    const headline = personaHeadline({
      projectType: "real_estate",
      jurisdictions: ["luxembourg"],
      projectValue: "1to5m",
      locale: "fr",
    });
    assert.match(headline, /Immobilier/);
    assert.match(headline, /1–5 M€/);
    assert.match(headline, /Luxembourg/);
    assert.equal(primaryJurisdictionId(["luxembourg", "france"]), "luxembourg");
  });

  it("headline works for bonds", () => {
    const headline = personaHeadline({
      projectType: "bonds",
      jurisdictions: ["ireland"],
      projectValue: null,
      locale: "fr",
    });
    assert.match(headline, /Obligation|Bond|titre/i);
  });
});

describe("jurisdictions/starter-kit-generate", () => {
  it("exports generateStarterKit", async () => {
    const mod = await import("../lib/jurisdictions/starter-kit-generate");
    assert.equal(typeof mod.generateStarterKit, "function");
  });
});
