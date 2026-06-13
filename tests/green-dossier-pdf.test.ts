import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { suggestedGreenFilename } from "@/lib/green/green-pdf";
import { computeGreenComplianceScore } from "@/lib/green/scoring/green-compliance";
import { GREEN_WIZARD_ASSET_TYPE } from "@/lib/green/constants";
import { DOC_NONE } from "@/lib/wizard-constants";
import type { WizardData } from "@/lib/wizard-types";

describe("green/green-pdf", () => {
  it("suggests a dated RTMS PDF filename", () => {
    assert.ok(
      suggestedGreenFilename({ generatedAt: "2026-06-13T00:00:00.000Z" }).endsWith(".pdf")
    );
    assert.match(suggestedGreenFilename({}), /AUROS_Green_RTMS_/);
  });

  it("caps compliance priorities at 3 for PDF export input", () => {
    const data: WizardData = {
      assetType: GREEN_WIZARD_ASSET_TYPE,
      description: "Solar farm 50MW with PPA and EU taxonomy documentation",
      estimatedValue: 5_000_000,
      currency: "EUR",
      country: "France",
      city: "Montpellier",
      documents: [DOC_NONE],
      goals: [],
      timeline: "6-12 months",
      platform: "Direct",
      firstName: "Test",
      email: "test@example.com",
      legalStructure: "SPV",
      incomeType: "future",
      legalStatus: [],
      investorProfile: "Institutional",
    };
    const score = computeGreenComplianceScore(data);
    assert.ok(score.priority_keys.length <= 3);
  });
});
