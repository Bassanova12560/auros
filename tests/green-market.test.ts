import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getAllAiFirstPages } from "../lib/ai-first/catalog";
import {
  GREEN_CHARGERS_ROUTE,
  GREEN_CONSUMERS_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_PRODUCERS_ROUTE,
  GREEN_RTMS_ASSISTANT_ROUTE,
  GREEN_STORERS_ROUTE,
} from "../lib/green/constants";
import {
  GREEN_MARKET_ACTORS,
  GREEN_MARKET_OFFERS,
  getGreenMarketActorsByType,
} from "../lib/green/market/data";
import {
  withinRadiusKm,
  resolveCityCoordinates,
  globalLatLngBounds,
  greenMarketCentroid,
} from "../lib/green/market/geo";
import { GREEN_MARKET_CENTER } from "../lib/green/market/types";
import { GLOBAL_DEMO_ACTORS } from "../lib/green/market/global-demo-data";
import { getGreenMarketSnapshot, resolveLiveMarketActors } from "../lib/green/market/green-market-db";
import { geocodeCity } from "../lib/green/market/geocode";
import { greenMarketMarkerHtml } from "../lib/green/market/markers";
import { matchesGreenMarketSearch } from "../lib/green/market/search";
import {
  formatGreenMarketLocation,
  getGreenMarketMessages,
} from "../lib/green/market-i18n";
import { getGreenMessages } from "../lib/green/i18n";
import { greenCompareRowsToCsv } from "../lib/green/compare-csv";
import { GREEN_COMPARE_ROWS } from "../lib/green/compare-data";

describe("green/market-data", () => {
  it("has mock actors across four types including non-France", () => {
    assert.ok(GREEN_MARKET_ACTORS.length >= 30);
    assert.ok(GREEN_MARKET_ACTORS.some((a) => a.country !== "France"));
    for (const type of ["producer", "storer", "charger", "consumer"] as const) {
      assert.ok(getGreenMarketActorsByType(type).length >= 5, type);
    }
  });

  it("has sourced offers with coordinates", () => {
    assert.ok(GREEN_MARKET_OFFERS.length >= 5);
    for (const offer of GREEN_MARKET_OFFERS) {
      assert.ok(offer.volumeKwh > 0);
      assert.ok(offer.pricePerKwh >= 0);
      assert.ok(offer.city.length > 0);
    }
  });

  it("filters actors within radius from map centroid", () => {
    const center = greenMarketCentroid(GREEN_MARKET_ACTORS);
    const near = GREEN_MARKET_ACTORS.filter((a) =>
      withinRadiusKm(a.lat, a.lon, center.lat, center.lon, 5)
    );
    assert.ok(near.length >= 0);
    const wide = GREEN_MARKET_ACTORS.filter((a) =>
      withinRadiusKm(a.lat, a.lon, center.lat, center.lon, 20_000)
    );
    assert.equal(wide.length, GREEN_MARKET_ACTORS.length);
  });

  it("resolves city coordinates from registry or falls back to centre", () => {
    const lyon = resolveCityCoordinates("Lyon");
    assert.ok(Math.abs(lyon.lat - 45.75) < 1);
    const unknown = resolveCityCoordinates("Ville Inconnue XYZ");
    assert.equal(unknown.lat, GREEN_MARKET_CENTER.lat);
    assert.equal(unknown.lon, GREEN_MARKET_CENTER.lon);
  });

  it("defines worldwide map bounds", () => {
    const [[swLat, swLon], [neLat, neLon]] = globalLatLngBounds();
    assert.ok(swLat < neLat);
    assert.ok(swLon < neLon);
    assert.ok(swLat < 0 && neLat > 50);
  });

  it("includes worldwide demo actors outside France seed", () => {
    assert.ok(GLOBAL_DEMO_ACTORS.length >= 25);
    assert.ok(GLOBAL_DEMO_ACTORS.every((a) => a.country !== "France"));
    const countries = new Set(GLOBAL_DEMO_ACTORS.map((a) => a.country));
    assert.ok(countries.size >= 20);
    for (const type of ["producer", "storer", "charger", "consumer"] as const) {
      assert.ok(
        GLOBAL_DEMO_ACTORS.filter((a) => a.type === type).length >= 3,
        type
      );
    }
  });

  it("formats city and country for display", () => {
    assert.equal(formatGreenMarketLocation("Lyon", "France"), "Lyon, France");
    assert.equal(formatGreenMarketLocation("  ", "Germany"), "Germany");
  });

  it("exports geocodeCity for worldwide registration", () => {
    assert.equal(typeof geocodeCity, "function");
  });
});

describe("green/market-markers", () => {
  it("uses SVG markers instead of unicode symbols", () => {
    const forbidden = ["☀", "⚡", "▣", "⌂"];
    for (const type of ["producer", "storer", "charger", "consumer"] as const) {
      const html = greenMarketMarkerHtml(type);
      for (const ch of forbidden) {
        assert.equal(html.includes(ch), false, `${type} must not include ${ch}`);
      }
      assert.ok(html.includes("<svg"), type);
    }
  });
});

describe("green/market-search", () => {
  it("matches city, country and actor name case-insensitively", () => {
    assert.ok(
      matchesGreenMarketSearch("lyon", {
        name: "Solar Lyon",
        city: "Lyon",
        country: "France",
      })
    );
    assert.ok(
      matchesGreenMarketSearch("casablanca", {
        name: "Atlas Storage",
        city: "Casablanca",
        country: "Morocco",
      })
    );
    assert.ok(!matchesGreenMarketSearch("tokyo", { name: "Paris PV", city: "Paris", country: "France" }));
    assert.ok(matchesGreenMarketSearch("", { name: "Any", city: "X", country: "Y" }));
  });
});

describe("green/market-i18n", () => {
  for (const locale of ["fr", "en", "es"] as const) {
    it(`returns market messages for ${locale}`, () => {
      const m = getGreenMarketMessages(locale);
      assert.ok(m.market.title.length > 0);
      assert.ok(m.market.filters.searchPlaceholder.length > 0);
      assert.ok(m.market.form.errorRateLimit.length > 0);
      assert.ok(m.market.mapEmptyWiden.length > 0);
      assert.ok(m.market.mapEmptyRegister.length > 0);
      assert.ok(m.actors.producer.title.length > 0);
    });
  }
});

describe("green/hub-onboarding", () => {
  for (const locale of ["fr", "en", "es"] as const) {
    it(`exposes 3 onboarding steps for ${locale}`, () => {
      const o = getGreenMessages(locale).hub.onboarding;
      assert.equal(o.steps.length, 3);
      assert.ok(o.stepLabel(1, 3).includes("1"));
      assert.ok(o.toggle.length > 0);
    });
  }
});

describe("green/compare-csv", () => {
  it("builds CSV header and rows from compare data", () => {
    const labels = getGreenMessages("fr").compare;
    const csv = greenCompareRowsToCsv(GREEN_COMPARE_ROWS, labels);
    assert.ok(csv.startsWith(labels.table.project));
    assert.ok(csv.includes("Toucan Protocol"));
    assert.ok(csv.split("\n").length >= GREEN_COMPARE_ROWS.length + 1);
  });
});

describe("green/compare-pdf", () => {
  it("maps compare rows to PDF row data", async () => {
    const { greenCompareRowsToPdfRows, suggestedGreenCompareFilename } =
      await import("../lib/green/compare-pdf");
    const labels = getGreenMessages("fr").compare;
    const pdfRows = greenCompareRowsToPdfRows(GREEN_COMPARE_ROWS, labels);
    assert.equal(pdfRows.length, GREEN_COMPARE_ROWS.length);
    assert.ok(pdfRows[0]?.project.includes("Toucan"));
    assert.ok(suggestedGreenCompareFilename("fr").endsWith(".pdf"));
  });
});

describe("green/rtms-assistant", () => {
  it("scores preliminary RTMS from summary text", async () => {
    const { computePreliminaryRtmsFromSummary, countSummaryWords, MIN_SUMMARY_WORDS } =
      await import("../lib/green/rtms-assistant");
    const summary =
      "Parc solaire 2 MWh/an en France, contrat PPA signé, registre carbone et traçabilité on-chain, structure SPV avec revue juridique MiCA.";
    assert.ok(countSummaryWords(summary) >= MIN_SUMMARY_WORDS);
    const score = computePreliminaryRtmsFromSummary({
      projectSummary: summary,
      country: "France",
      hasDocument: true,
    });
    assert.ok(score.overall >= 40);
    assert.equal(Object.keys(score.pillars).length, 4);
    const { extractTopRtmsGapPriorities } = await import("../lib/green/rtms-assistant");
    const gaps = extractTopRtmsGapPriorities(score, "fr");
    assert.ok(gaps.length <= 3);
  });

  it("merges PDF excerpt into rule-based corpus", async () => {
    const { buildRtmsAnalysisCorpus, computePreliminaryRtmsFromSummary } =
      await import("../lib/green/rtms-assistant");
    const summary = "Projet solaire en développement avec partenaires locaux identifiés.";
    const doc =
      "Production annuelle 5000 MWh PPA corporate registre carbone méthodologie VCS audit tiers structure SPV Luxembourg compliance MiCA risques climatiques documentés.";
    const corpus = buildRtmsAnalysisCorpus({
      projectSummary: summary,
      country: "Luxembourg",
      hasDocument: true,
      documentText: doc,
    });
    assert.ok(corpus.includes("ppa"));
    const withDoc = computePreliminaryRtmsFromSummary({
      projectSummary: summary,
      country: "Luxembourg",
      hasDocument: true,
      documentText: doc,
    });
    const withoutDoc = computePreliminaryRtmsFromSummary({
      projectSummary: summary,
      country: "Luxembourg",
      hasDocument: false,
    });
    assert.ok(withDoc.overall >= withoutDoc.overall);
  });

  it("normalizes PDF text and validates file constraints", async () => {
    const { normalizeRtmsPdfText, validateRtmsPdfFile, MAX_RTMS_PDF_BYTES } =
      await import("../lib/green/rtms-pdf");
    assert.equal(normalizeRtmsPdfText("  hello   world  "), "hello world");
    assert.equal(
      validateRtmsPdfFile(new File(["x"], "dossier.pdf", { type: "application/pdf" })),
      "ok"
    );
    assert.equal(
      validateRtmsPdfFile(
        new File([new Uint8Array(MAX_RTMS_PDF_BYTES + 1)], "big.pdf", {
          type: "application/pdf",
        })
      ),
      "file_size"
    );
  });

  it("detects when RTMS AI providers are configured", async () => {
    const { hasRtmsAiProvider } = await import("../lib/green/rtms-ai");
    assert.equal(typeof hasRtmsAiProvider(), "boolean");
  });
});

describe("green/compare-i18n", () => {
  for (const locale of ["fr", "en", "es"] as const) {
    it(`exposes compare PDF export labels for ${locale}`, () => {
      const c = getGreenMessages(locale).compare;
      assert.ok(c.exportPdf.length > 0);
      assert.ok(c.exportPdfGenerating.length > 0);
    });

    it(`exposes RTMS assistant quick-nav for ${locale}`, () => {
      const s = getGreenMessages(locale).standards.quickNav;
      assert.ok(s.assistant.length > 0);
    });
  }
});

describe("green/register-form-ssr", () => {
  it("register page source includes server input elements", async () => {
    const { readFile } = await import("node:fs/promises");
    const page = await readFile("app/green/register/page.tsx", "utf8");
    const serverForm = await readFile("app/green/_components/GreenRegisterFormServer.tsx", "utf8");
    const clientForm = await readFile(
      "app/green/_components/market/GreenActorRegisterForm.tsx",
      "utf8"
    );
    assert.ok(page.includes("GreenRegisterFormServer"));
    assert.ok(serverForm.includes('type="email"'));
    assert.ok(clientForm.includes("<input"));
  });
});

describe("green/market-routes", () => {
  it("registers marketplace pages in catalog", () => {
    const pages = getAllAiFirstPages();
    for (const path of [
      GREEN_MARKET_ROUTE,
      GREEN_PRODUCERS_ROUTE,
      GREEN_STORERS_ROUTE,
      GREEN_CHARGERS_ROUTE,
      GREEN_CONSUMERS_ROUTE,
      GREEN_RTMS_ASSISTANT_ROUTE,
    ]) {
      const page = pages.find((p) => p.path === path);
      assert.ok(page, `missing ${path}`);
      assert.equal(page!.indexable, true);
    }
  });

  it("hub routes actors to marketplace paths", () => {
    const m = getGreenMessages("fr");
    assert.equal(m.hub.actors.length, 4);
    assert.ok(m.hub.actors.some((a) => a.href === GREEN_STORERS_ROUTE));
    assert.ok(m.hub.map.cta.length > 0);
  });

  it("snapshot falls back without supabase credentials", async () => {
    const snap = await getGreenMarketSnapshot();
    assert.equal(snap.mode, "demo");
    assert.equal(snap.available, false);
    assert.ok(snap.actors.length >= 20);
    assert.ok(snap.actors.every((a) => a.listingTier === "demo"));
    assert.ok(snap.offers.length >= 5);
  });

  it("keeps demo actors when live DB referenced pilots lack country diversity", () => {
    const franceReferenced = GREEN_MARKET_ACTORS.filter((a) => a.country === "France")
      .slice(0, 6)
      .map((a) => ({ ...a, listingTier: "referenced" as const }));
    const { actors } = resolveLiveMarketActors(franceReferenced, []);
    assert.ok(actors.some((a) => a.listingTier === "demo"));
    assert.ok(countActorCountries(actors) >= 10);
  });

  it("merges worldwide demo fallback when filtered live actors are too local", () => {
    const franceOnly = GREEN_MARKET_ACTORS.filter((a) => a.country === "France")
      .slice(0, 8)
      .map((a) => ({ ...a, listingTier: "referenced" as const }));
    const { actors } = resolveLiveMarketActors(franceOnly, []);
    assert.ok(countActorCountries(actors) >= 10);
    assert.ok(actors.some((a) => a.country !== "France"));
  });
});

function countActorCountries(
  actors: ReadonlyArray<{ country: string }>
): number {
  return new Set(actors.map((a) => a.country.trim()).filter(Boolean)).size;
}
