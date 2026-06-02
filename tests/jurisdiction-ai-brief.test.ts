import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { generateJurisdictionBrief } from "../lib/jurisdictions/ai-brief";
import { getJurisdictionMessages } from "../lib/jurisdictions/i18n";

describe("jurisdictions/ai-brief", () => {
  it("falls back to template when no AI providers are configured", async () => {
    const messages = getJurisdictionMessages("fr");
    const { brief, provider } = await generateJurisdictionBrief(
      {
        firstName: "Marie",
        projectType: "real_estate",
        jurisdictionIds: ["luxembourg", "dubai-difc"],
      },
      messages,
      "fr"
    );

    assert.equal(provider, "template");
    assert.match(brief, /Marie/);
    assert.match(brief, /Luxembourg/);
    assert.match(brief, /Dubai DIFC/);
    assert.ok(brief.length > 100);
  });
});
