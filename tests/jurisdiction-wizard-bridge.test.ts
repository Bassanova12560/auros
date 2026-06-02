import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildJurisdictionsUrl,
  jurisdictionIdFromWizardCountry,
  jurisdictionsUrlFromWizardCountry,
} from "../lib/jurisdictions/wizard-bridge";

describe("jurisdictions/wizard-bridge", () => {
  it("maps wizard countries to jurisdiction ids", () => {
    assert.equal(jurisdictionIdFromWizardCountry("France"), "france");
    assert.equal(jurisdictionIdFromWizardCountry("UAE"), "dubai-difc");
    assert.equal(jurisdictionIdFromWizardCountry("Germany"), null);
  });

  it("builds urls with query and hash", () => {
    assert.equal(
      buildJurisdictionsUrl({
        compareA: "france",
        from: "wizard",
        hash: "guide",
      }),
      "/jurisdictions?compareA=france&from=wizard#guide"
    );
  });

  it("builds wizard url with mapped country", () => {
    assert.equal(
      jurisdictionsUrlFromWizardCountry("Singapore"),
      "/jurisdictions?compareA=singapore&from=wizard#guide"
    );
  });

  it("builds wizard url without compare when country unmapped", () => {
    assert.equal(
      jurisdictionsUrlFromWizardCountry("Germany"),
      "/jurisdictions?from=wizard#guide"
    );
  });
});
