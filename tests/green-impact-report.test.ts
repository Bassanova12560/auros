import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GREEN_IMPACT_REPORT_AMOUNTS,
  GREEN_IMPACT_REPORT_LABELS,
  greenImpactReportProduct,
  isGreenImpactReportTier,
} from "@/lib/green/impact-report-pricing";
import {
  computeWizardChargeCents,
  parseWizardCheckoutMetadata,
} from "@/lib/stripe/wizard-checkout";
import { parseGreenImpactCheckoutMetadata } from "@/lib/stripe/green-impact-checkout";
import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import {
  compareGreenTaxonomyScore,
  formatGreenTaxonomyScoreDisplay,
  formatGreenTaxonomyScorePdf,
  sortGreenCompareRowsByTaxonomy,
} from "@/lib/green/compare-taxonomy";
import { greenCompareRowsToPdfRows } from "@/lib/green/compare-pdf";
import { greenCompareRowsToCsv } from "@/lib/green/compare-csv";
import { getGreenMessages } from "@/lib/green/i18n";
import { getCsrdCheckerCopy } from "@/lib/green/csrd-check/i18n";
import { getGreenComplianceCopy } from "@/lib/green/compliance-i18n";
import { getGreenImpactReportCopy } from "@/lib/green/impact-report-i18n";
import { resolveLiveMarketActors } from "@/lib/green/market/green-market-db";
import { GREEN_MARKET_ACTORS } from "@/lib/green/market/data";
import { GREEN_MIN_REFERENCED_TO_HIDE_DEMO } from "@/lib/green/constants";
import { suggestedGreenImpactReportFilename } from "@/lib/green/impact-report-pdf";

describe("green/impact-report-pricing", () => {
  it("defines standard and institutional tiers at 49€ and 199€", () => {
    assert.equal(GREEN_IMPACT_REPORT_AMOUNTS.standard, 4_900);
    assert.equal(GREEN_IMPACT_REPORT_AMOUNTS.institutional, 19_900);
    assert.equal(isGreenImpactReportTier("standard"), true);
    assert.equal(isGreenImpactReportTier("institutional"), true);
    assert.equal(isGreenImpactReportTier("pro"), false);
    assert.equal(isGreenImpactReportTier(""), false);
    assert.ok(greenImpactReportProduct("standard").name.fr.includes("49"));
  });

  it("returns eur product metadata for each tier", () => {
    for (const tier of ["standard", "institutional"] as const) {
      const product = greenImpactReportProduct(tier);
      assert.equal(product.tier, tier);
      assert.equal(product.currency, "eur");
      assert.equal(product.amountCents, GREEN_IMPACT_REPORT_AMOUNTS[tier]);
      assert.ok(product.name.en.length > 0);
      assert.ok(product.name.es.length > 0);
      assert.equal(product.name.en, GREEN_IMPACT_REPORT_LABELS[tier].en);
    }
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
    assert.equal(
      parseGreenImpactCheckoutMetadata({
        product: "green_impact_report",
        tier: "invalid",
        email: "a@b.co",
      }),
      null
    );
    assert.equal(
      parseGreenImpactCheckoutMetadata({
        product: "green_impact_report",
        tier: "standard",
        email: "not-an-email",
      }),
      null
    );
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

describe("green/i18n-csrd-impact", () => {
  for (const locale of ["fr", "en", "es"] as const) {
    it(`provides CSRD checker copy for ${locale}`, () => {
      const copy = getCsrdCheckerCopy(locale);
      assert.equal(copy.questions.length, 6);
      assert.ok(copy.scopeLabels.out_of_scope.length > 0);
      assert.equal(copy.faq.length, 3);
    });

    it(`provides compliance panel copy for ${locale}`, () => {
      const copy = getGreenComplianceCopy(locale);
      assert.ok(copy.sfdrLabels.article_8.length > 0);
      assert.ok(copy.priorities.document_taxonomy.length > 0);
    });

    it(`provides impact report copy for ${locale}`, () => {
      const copy = getGreenImpactReportCopy(locale);
      assert.ok(copy.cta.orderStandard.includes("49"));
      assert.ok(copy.ready.download.length > 0);
    });
  }
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
  });

  it("formats display and PDF taxonomy scores", () => {
    assert.equal(formatGreenTaxonomyScoreDisplay(76), "76");
    assert.equal(formatGreenTaxonomyScoreDisplay(null), "—");
    assert.equal(formatGreenTaxonomyScorePdf(76), "76/100");
    assert.equal(formatGreenTaxonomyScorePdf(null), "—");
  });

  it("sorts rows by taxonomy score descending with nulls last", () => {
    const rows = [
      { id: "a", green_taxonomy_score: 55 },
      { id: "b", green_taxonomy_score: 76 },
      { id: "c", green_taxonomy_score: null },
      { id: "d", green_taxonomy_score: 71 },
    ] as typeof GREEN_COMPARE_ROWS;
    const sorted = sortGreenCompareRowsByTaxonomy(rows);
    assert.deepEqual(
      sorted.map((r) => r.id),
      ["b", "d", "a", "c"]
    );
    assert.ok(compareGreenTaxonomyScore(rows[1], rows[0]) < 0);
    assert.ok(compareGreenTaxonomyScore(rows[2], rows[0]) > 0);
  });

  it("maps taxonomy scores consistently in CSV and PDF exports", () => {
    const labels = getGreenMessages("fr").compare;
    const sample = GREEN_COMPARE_ROWS.slice(0, 3);
    const pdfRows = greenCompareRowsToPdfRows(sample, labels);
    assert.ok(pdfRows[0]?.taxonomyScore.includes("/100"));
    const csv = greenCompareRowsToCsv(sample, labels);
    const topScore = String(sample[0]!.green_taxonomy_score);
    assert.ok(csv.includes(topScore));
    assert.ok(!csv.includes("/100"));
  });
});

describe("green/market-hide-demo", () => {
  function referencedActors(count: number) {
    return GREEN_MARKET_ACTORS.slice(0, count).map((a) => ({
      ...a,
      listingTier: "referenced" as const,
    }));
  }

  it("hides demo when at least 5 referenced actors exist", () => {
    const { actors } = resolveLiveMarketActors(referencedActors(5), []);
    assert.ok(!actors.some((a) => a.listingTier === "demo"));
  });

  it(`keeps demo when fewer than ${GREEN_MIN_REFERENCED_TO_HIDE_DEMO} referenced actors`, () => {
    const { actors } = resolveLiveMarketActors(
      referencedActors(GREEN_MIN_REFERENCED_TO_HIDE_DEMO - 1),
      []
    );
    assert.ok(actors.some((a) => a.listingTier === "demo"));
  });

  it("counts verified actors toward the hide-demo threshold", () => {
    const mixed = [
      ...referencedActors(3),
      ...GREEN_MARKET_ACTORS.slice(10, 12).map((a) => ({
        ...a,
        listingTier: "verified" as const,
      })),
    ];
    const { actors } = resolveLiveMarketActors(mixed, []);
    assert.ok(!actors.some((a) => a.listingTier === "demo"));
  });

  it("filters demo offers when demo actors are hidden", () => {
    const dbOffers = [
      {
        id: "o1",
        actorId: "a1",
        actorName: "Ref",
        side: "sell" as const,
        volumeKwh: 1000,
        pricePerKwh: 0.1,
        energyType: "solar" as const,
        lat: 48,
        lon: 2,
        city: "Paris",
        country: "France",
        createdAt: "2026-01-01",
        status: "available" as const,
        listingTier: "referenced" as const,
      },
      {
        id: "o2",
        actorId: "demo",
        actorName: "Demo",
        side: "sell" as const,
        volumeKwh: 500,
        pricePerKwh: 0.05,
        energyType: "solar" as const,
        lat: 48,
        lon: 2,
        city: "Lyon",
        country: "France",
        createdAt: "2026-01-02",
        status: "available" as const,
        listingTier: "demo" as const,
      },
    ];
    const { offers } = resolveLiveMarketActors(referencedActors(5), dbOffers);
    assert.ok(!offers.some((o) => o.listingTier === "demo"));
  });
});

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
