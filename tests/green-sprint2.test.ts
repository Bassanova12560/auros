import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GREEN_RTMS_PILLARS, GREEN_WIZARD_ASSET_TYPE, GREEN_MIN_REFERENCED_TO_HIDE_DEMO } from "../lib/green/constants";
import {
  computeGreenRtmsScore,
  isGreenWizardAsset,
} from "../lib/green/rtms-scoring";
import {
  greenMarketReceivedEmail,
  greenLabelReceivedEmail,
  greenMarketAlertEmail,
} from "../lib/emails/templates";
import { GREEN_REFERENCED_PILOTS } from "../lib/green/market/referenced-seed";
import { initialWizardData } from "../lib/wizard-constants";

describe("green/rtms-scoring", () => {
  it("detects green wizard asset type", () => {
    assert.equal(isGreenWizardAsset(GREEN_WIZARD_ASSET_TYPE), true);
    assert.equal(isGreenWizardAsset("Real estate"), false);
  });

  it("scores four RTMS pillars from wizard data", () => {
    const score = computeGreenRtmsScore({
      ...initialWizardData,
      assetType: GREEN_WIZARD_ASSET_TYPE,
      description:
        "Parc solaire 2 MWh/an, contrat PPA et registre carbone — production mesurable sur 12 mois.",
      estimatedValue: 500_000,
      email: "ops@example.com",
      platform: "Tokeny",
      timeline: "3-6 months",
      country: "France",
      city: "Lyon",
      legalStructure: "Through a company / SCI",
      legalStatus: ["Clear title — no disputes"],
      documents: ["Phase 1 — Asset proof", "Phase 2 — Valuation"],
    });

    assert.ok(score.overall >= 50);
    assert.equal(Object.keys(score.pillars).length, GREEN_RTMS_PILLARS.length);
    for (const pillar of GREEN_RTMS_PILLARS) {
      assert.equal(score.pillars[pillar].checks.length, 3);
      assert.ok(score.pillars[pillar].score >= 0 && score.pillars[pillar].score <= 100);
    }
  });
});

describe("green/sprint4", () => {
  it("includes worldwide referenced marketplace pilots", () => {
    assert.equal(GREEN_REFERENCED_PILOTS.length, 10);
    assert.ok(GREEN_REFERENCED_PILOTS.some((p) => p.country !== "France"));
    const countries = new Set(GREEN_REFERENCED_PILOTS.map((p) => p.country));
    assert.ok(countries.size >= 6);
    assert.ok(
      GREEN_REFERENCED_PILOTS.every((p) => p.externalId.startsWith("ref-pilot-"))
    );
  });
});

describe("green/sprint3", () => {
  it("defines demo hide threshold", () => {
    assert.equal(GREEN_MIN_REFERENCED_TO_HIDE_DEMO, 5);
  });

  it("builds geo alert email", () => {
    const { subject, html } = greenMarketAlertEmail({
      alertCity: "Lyon",
      actorName: "Solar Storage Co",
      actorCity: "Villeurbanne",
      actorType: "storer",
      locale: "fr",
    });
    assert.ok(subject.includes("acteur"));
    assert.ok(html.includes("Solar Storage Co"));
  });
});

describe("green/emails", () => {
  it("builds marketplace received email", () => {
    const { subject, html } = greenMarketReceivedEmail({
      name: "Solar Lyon",
      kind: "actor",
      city: "Lyon",
      country: "France",
      locale: "fr",
    });
    assert.ok(subject.includes("Green"));
    assert.ok(html.includes("Solar Lyon"));
    assert.ok(html.includes("Lyon, France"));
    assert.ok(html.includes("48 h"));
  });

  it("builds label received email", () => {
    const { subject, html } = greenLabelReceivedEmail({
      contactName: "Ada",
      projectName: "Wind Farm PT",
      locale: "en",
    });
    assert.ok(subject.includes("label"));
    assert.ok(html.includes("Wind Farm PT"));
  });
});
