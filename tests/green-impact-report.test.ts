import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GREEN_IMPACT_REPORT_AMOUNTS,
  greenImpactReportProduct,
  isGreenImpactReportTier,
} from "@/lib/green/impact-report-pricing";
import {
  computeWizardChargeCents,
  parseWizardCheckoutMetadata,
} from "@/lib/stripe/wizard-checkout";
import {
  parseGreenImpactCheckoutMetadata,
} from "@/lib/stripe/green-impact-checkout";
import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import { greenCompareRowsToPdfRows } from "@/lib/green/compare-pdf";
import { getGreenMessages } from "@/lib/green/i18n";
import { resolveLiveMarketActors } from "@/lib/green/market/green-market-db";
import { GREEN_MARKET_ACTORS } from "@/lib/green/market/data";
import {
  suggestedGreenImpactReportFilename,
} from "@/lib/green/impact-report-pdf";

describe("green/impact-report-pricing", () => {
  it("defines standard and institutional tiers at 49€ and 199€", () => {
    assert.equal(GREEN_IMPACT_REPORT_AMOUNTS.standard, 4_900);
    assert.equal(GREEN_IMPACT_REPORT_AMOUNTS.institutional, 19_900);
    assert.equal(isGreenImpactReportTier("standard"), true);
    assert.equal(isGreenImpactReportTier("pro"), false);
    assert.ok(greenImpactReportProduct("standard").name.fr.includes("49"));
  });
});

describe("green/impact-report-checkout", () => {
  it("parses stripe metadata for green impact report", () => {
    const parsed = parseGreenImpactCheckoutMetadata({
      product: "green_impact_report",
      tier: "institutional",
      email: "ops@example.com",
      locale: "en",
    });
    assert.ok(parsed);
    assert.equal(parsed!.tier, "institutional");
    assert.equal(parsed!.email, "ops@example.com");
    assert.equal(parseGreenImpactCheckoutMetadata({ product: "wizard" }), null);
  });
});

describe("green/impact-report-pdf", () => {
  it("suggests a dated PDF filename", () => {
    assert.ok(
      suggestedGreenImpactReportFilename({ generatedAt: "2026-06-13T00:00:00.000Z" }).endsWith(
        ".pdf"
      )
    );
    assert.match(suggestedGreenImpactReportFilename({}), /AUROS_Green_Impact_Report_/);
  });
});

describe("green/compare-taxonomy-score", () => {
  it("includes green_taxonomy_score on all compare rows", () => {
    assert.ok(GREEN_COMPARE_ROWS.length >= 10);
    for (const row of GREEN_COMPARE_ROWS) {
      assert.ok("green_taxonomy_score" in row);
      if (row.green_taxonomy_score != null) {
        assert.ok(row.green_taxonomy_score >= 0 && row.green_taxonomy_score <= 100);
      }
    }
    const labels = getGreenMessages("fr").compare;
    const pdfRows = greenCompareRowsToPdfRows(GREEN_COMPARE_ROWS.slice(0, 3), labels);
    assert.ok(pdfRows[0]?.taxonomyScore.includes("/100"));
  });
});

describe("green/market-hide-demo", () => {
  it("hides demo when at least 5 referenced actors exist", () => {
    const referenced = GREEN_MARKET_ACTORS.slice(0, 5).map((a) => ({
      ...a,
      listingTier: "referenced" as const,
    }));
    const { actors } = resolveLiveMarketActors(referenced, []);
    assert.ok(!actors.some((a) => a.listingTier === "demo"));
  });
});

// guard: wizard checkout unchanged
describe("green/wizard-checkout-unchanged", () => {
  it("still parses wizard product separately from impact report", () => {
    assert.equal(
      parseWizardCheckoutMetadata({
        product: "wizard",
        wizard_tier: "starter",
        email: "a@b.co",
        locale: "fr",
      })?.tier,
      "starter"
    );
    assert.equal(computeWizardChargeCents("starter"), 49_000);
  });
});
