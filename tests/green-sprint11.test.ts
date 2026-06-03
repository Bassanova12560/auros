import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { greenLabelReceivedEmail, greenLabelStatusEmail } from "@/lib/emails/templates";
import {
  GREEN_COMPARE_ROWS,
  getGreenMessages,
} from "@/lib/green";
import {
  greenCompareFullToCsv,
  greenCompareMarketOffersToCsv,
} from "@/lib/green/compare-csv";
import { normalizeGreenLabelPreferredLocale } from "@/lib/green/label-locale";
import { GREEN_MARKET_OFFERS } from "@/lib/green/market/data";
import { getGreenMarketOfferById } from "@/lib/green/market/green-market-db";
import { getGreenMarketMessages } from "@/lib/green/market-i18n";
import {
  GREEN_REGISTRY_TIER_URL_PARAM,
  parseRegistryTierParam,
} from "@/lib/green/registry-routes";

describe("green/sprint11-compare-export", () => {
  it("includes marketplace offers in combined CSV export", async () => {
    const offer = GREEN_MARKET_OFFERS[0];
    assert.ok(offer);
    const detail = await getGreenMarketOfferById(offer.id);
    assert.ok(detail);

    const compareLabels = getGreenMessages("fr").compare;
    const marketLabels = getGreenMarketMessages("fr").market;
    const csv = greenCompareFullToCsv(
      GREEN_COMPARE_ROWS.slice(0, 1),
      [detail],
      compareLabels,
      marketLabels,
      "fr"
    );

    assert.ok(csv.includes(compareLabels.table.project));
    assert.ok(csv.includes(compareLabels.marketExport.sectionTitle));
    assert.ok(csv.includes(marketLabels.table.actor));
    assert.ok(csv.includes(marketLabels.energyTypes[detail.energyType]));
    assert.ok(csv.includes(marketLabels.sides[detail.side]));
  });

  it("builds marketplace-only CSV section with i18n headers", async () => {
    const offer = GREEN_MARKET_OFFERS[0];
    assert.ok(offer);
    const detail = await getGreenMarketOfferById(offer.id);
    assert.ok(detail);

    const compareLabels = getGreenMessages("en").compare;
    const marketLabels = getGreenMarketMessages("en").market;
    const csv = greenCompareMarketOffersToCsv(
      [detail],
      compareLabels,
      marketLabels,
      "en"
    );

    assert.ok(csv.includes("Energy"));
    assert.ok(csv.includes("Selected marketplace listings"));
  });

  it("maps marketplace offers to PDF rows", async () => {
    const offer = GREEN_MARKET_OFFERS[0];
    assert.ok(offer);
    const detail = await getGreenMarketOfferById(offer.id);
    assert.ok(detail);

    const { greenCompareMarketOffersToPdfRows } = await import("@/lib/green/compare-pdf");
    const compareLabels = getGreenMessages("es").compare;
    const marketLabels = getGreenMarketMessages("es").market;
    const rows = greenCompareMarketOffersToPdfRows(
      [detail],
      compareLabels,
      marketLabels,
      "es"
    );

    assert.equal(rows.length, 1);
    assert.ok(rows[0]?.actor.includes(detail.actorName));
    assert.ok(rows[0]?.energy.length > 0);
  });
});

describe("green/sprint11-label-locale", () => {
  it("normalizes preferred locale to fr/en/es", () => {
    assert.equal(normalizeGreenLabelPreferredLocale("en"), "en");
    assert.equal(normalizeGreenLabelPreferredLocale("es"), "es");
    assert.equal(normalizeGreenLabelPreferredLocale("de"), "fr");
    assert.equal(normalizeGreenLabelPreferredLocale(null), "fr");
  });

  it("builds label emails in candidate locale", () => {
    const received = greenLabelReceivedEmail({
      contactName: "Ada",
      projectName: "Solar PT",
      locale: "en",
    });
    assert.ok(received.subject.includes("application received"));

    const status = greenLabelStatusEmail("in_review", {
      contactName: "Ada",
      projectName: "Solar PT",
      myUrl: "https://auros.example/green/my",
      locale: "es",
    });
    assert.ok(status.subject.includes("revisión"));
  });
});

describe("green/sprint11-registry-tier", () => {
  it("parses registry tier URL param", () => {
    assert.equal(parseRegistryTierParam("verified"), "verified");
    assert.equal(parseRegistryTierParam("pilot"), "pilot");
    assert.equal(parseRegistryTierParam("invalid"), "all");
    assert.equal(parseRegistryTierParam(null), "all");
    assert.equal(GREEN_REGISTRY_TIER_URL_PARAM, "tier");
  });

  it("exposes registry tier filter i18n", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const r = getGreenMessages(locale).registry;
      assert.ok(r.tierFilterAll.length > 0);
      assert.ok(r.tierFilterVerified.length > 0);
      assert.ok(r.tierFilterPilot.length > 0);
      assert.ok(r.tierFilterEmpty.length > 0);
    }
  });
});
