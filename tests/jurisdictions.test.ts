import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  applyQuickFilter,
  filterJurisdictions,
  JURISDICTIONS,
  matchesBudgetFilter,
  matchesDelayFilter,
} from "../lib/jurisdictions";
import {
  estimateSetupBudget,
  AUROS_STARTER_KIT_EUR,
} from "../lib/jurisdictions/setup-calculator";
import { computeStarterReadiness } from "../lib/jurisdictions/starter-readiness";
import {
  getAllSeoLandings,
  parseSeoLandingSlug,
  buildSeoSlug,
} from "../lib/jurisdictions/seo-landings";
import type { StarterKitContent } from "../lib/jurisdictions/starter-kit-types";

describe("jurisdictions/filters", () => {
  const dubai = JURISDICTIONS.find((j) => j.id === "dubai-difc")!;

  it("marks dubai as recommended with highest score tier", () => {
    assert.equal(dubai.recommended, true);
    assert.ok(dubai.score >= 4.5);
  });

  it("marks bahrain as best value", () => {
    const bahrain = JURISDICTIONS.find((j) => j.id === "bahrain")!;
    assert.equal(bahrain.bestValue, true);
    assert.ok(bahrain.totalCostMid > 0);
    assert.ok(bahrain.licenseMaxMonths > 0);
  });

  it("filters by budget under 15k", () => {
    assert.equal(matchesBudgetFilter(dubai, "under15k"), true);
    const lux = JURISDICTIONS.find((j) => j.id === "luxembourg")!;
    assert.equal(matchesBudgetFilter(lux, "under15k"), false);
  });

  it("filters by delay under 3 months", () => {
    const bahrain = JURISDICTIONS.find((j) => j.id === "bahrain")!;
    assert.equal(matchesDelayFilter(bahrain, "under3"), true);
    assert.equal(matchesDelayFilter(dubai, "under3"), false);
  });

  it("combines asset and budget filters", () => {
    const out = filterJurisdictions(JURISDICTIONS, "real_estate", "under15k", "all");
    assert.ok(out.some((j) => j.id === "bahrain"));
    assert.ok(!out.some((j) => j.id === "luxembourg"));
  });

  it("sorts by best cost quick filter", () => {
    const sorted = applyQuickFilter(JURISDICTIONS, "bestCost");
    assert.equal(sorted[0]?.id, "bahrain");
    assert.ok(sorted[0]!.totalCostMid <= sorted[1]!.totalCostMid);
  });

  it("filters fast delay quick filter", () => {
    const fast = applyQuickFilter(JURISDICTIONS, "fastDelay");
    assert.ok(fast.every((j) => j.licenseMaxMonths < 6));
    assert.ok(fast.some((j) => j.id === "dubai-difc"));
  });
});

describe("jurisdictions/data", () => {
  it("exposes eight jurisdictions", () => {
    assert.equal(JURISDICTIONS.length, 8);
  });

  it("includes stability metadata on each jurisdiction", () => {
    for (const j of JURISDICTIONS) {
      assert.ok(j.stabilityLevel >= 1 && j.stabilityLevel <= 5);
      assert.ok(["high", "medium", "risky"].includes(j.stabilityTier));
    }
  });
});

describe("jurisdictions/enterprise", () => {
  const sampleKit: StarterKitContent = {
    executiveSummary: "Summary",
    recommendedStructure: "SPV",
    jurisdictionRationale: "DIFC",
    regulatoryChecklist: ["MiCA", "KYC", "AML", "Prospectus"],
    timeline: [
      { phase: "Setup", duration: "2 mo", actions: "Structure" },
      { phase: "Licence", duration: "3 mo", actions: "File" },
    ],
    techProviders: [{ name: "Provider A", fit: "Good", note: "Note" }],
    nextSteps: ["Validate counsel", "Shortlist tech", "Open data room"],
    disclaimer: "Indicative",
  };

  it("includes AUROS starter in setup budget total", () => {
    const est = estimateSetupBudget("dubai-difc", "1to5m");
    assert.ok(est);
    assert.equal(est!.aurosStarterEur, AUROS_STARTER_KIT_EUR);
    assert.equal(
      est!.totalMinEur,
      est!.stateMinEur + est!.advisoryMinEur + AUROS_STARTER_KIT_EUR
    );
  });

  it("computes starter readiness with max 3 priorities", () => {
    const r = computeStarterReadiness(sampleKit);
    assert.ok(r.score > 50 && r.score <= 94);
    assert.equal(r.priorities.length, 3);
  });

  it("parses all SEO landing slugs", () => {
    const landings = getAllSeoLandings();
    assert.ok(landings.length > 20);
    for (const l of landings) {
      assert.deepEqual(parseSeoLandingSlug(l.slug), l);
    }
    assert.equal(buildSeoSlug("dubai-difc", "real_estate"), "dubai-difc-real-estate");
    assert.equal(parseSeoLandingSlug("starter-kit"), null);
  });

  it("value stack totals exceed starter kit price", async () => {
    const { starterKitMarketTotal, starterKitSavingsPercent, STARTER_KIT_PRICE_EUR } =
      await import("../lib/jurisdictions/starter-kit-value");
    assert.ok(starterKitMarketTotal() > STARTER_KIT_PRICE_EUR);
    assert.ok(starterKitSavingsPercent() >= 70);
  });

  it("exposes asset use cases in four categories", async () => {
    const { getAssetUseCases } = await import("../lib/jurisdictions/asset-use-cases");
    assert.equal(getAssetUseCases("fr").length, 4);
  });
});
