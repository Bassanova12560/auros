import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  dueLeadNurtureStep,
  LEAD_NURTURE_MS_DAY,
} from "../lib/leads/nurture-schedule";
import { wizardUrlForLead } from "../lib/leads/wizard-url";

describe("leads/nurture-schedule", () => {
  const now = Date.parse("2026-07-05T12:00:00.000Z");

  it("returns step 1 after 24h with nurture_step 0", () => {
    const created = now - LEAD_NURTURE_MS_DAY - 1;
    assert.equal(dueLeadNurtureStep(created, 0, now), 1);
  });

  it("returns null before 24h", () => {
    const created = now - LEAD_NURTURE_MS_DAY + 60_000;
    assert.equal(dueLeadNurtureStep(created, 0, now), null);
  });

  it("returns step 2 after 72h with nurture_step 1", () => {
    const created = now - LEAD_NURTURE_MS_DAY * 3 - 1;
    assert.equal(dueLeadNurtureStep(created, 1, now), 2);
  });

  it("returns null when nurture_step is already 2", () => {
    const created = now - LEAD_NURTURE_MS_DAY * 10;
    assert.equal(dueLeadNurtureStep(created, 2, now), null);
  });
});

describe("leads/wizard-url", () => {
  it("builds explore wizard URL", () => {
    const url = wizardUrlForLead({ assetType: "Real estate" });
    assert.match(url, /\/wizard\?/);
    assert.match(url, /mode=explore/);
    assert.doesNotMatch(url, /asset=renewable/);
  });

  it("adds renewable prefill for energy assets", () => {
    const url = wizardUrlForLead({ assetType: "Renewable energy" });
    assert.match(url, /asset=renewable/);
  });
});


describe("emails/lead-nurture", () => {
  it("renders step 1 and step 2 subjects", async () => {
    const { leadNurtureEmail } = await import("../lib/emails/templates");
    const step1 = leadNurtureEmail({
      step: 1,
      wizardUrl: "https://getauros.com/wizard",
      score: 72,
      assetType: "Real estate",
      locale: "fr",
    });
    assert.match(step1.subject, /score AUROS/i);
    assert.match(step1.html, /72\/100/);

    const step2 = leadNurtureEmail({
      step: 2,
      wizardUrl: "https://getauros.com/wizard",
      locale: "en",
    });
    assert.match(step2.subject, /Last step/i);
  });
});
