import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildGreenMarketShareUrl,
  decodeGreenMarketFilters,
  encodeGreenMarketFilters,
} from "@/lib/green/market/market-share";
import {
  readGreenMarketSavedSearches,
  saveGreenMarketSearch,
  GREEN_MARKET_SAVED_SEARCHES_MAX,
} from "@/lib/green/market/saved-searches";
import { greenRtmsChecklistToCsv } from "@/lib/green/rtms-checklist";
import { getGreenMessages } from "@/lib/green/i18n";
import { GREEN_RTMS_PILLARS } from "@/lib/green/constants";

describe("green/sprint7-market-share", () => {
  it("round-trips market filters in query string", () => {
    const params = encodeGreenMarketFilters({
      actor: "producer",
      radius: 10,
      energy: "solar",
      side: "sell",
      q: "Lyon",
    });
    const decoded = decodeGreenMarketFilters(params);
    assert.equal(decoded.actor, "producer");
    assert.equal(decoded.radius, 10);
    assert.equal(decoded.energy, "solar");
    assert.equal(decoded.side, "sell");
    assert.equal(decoded.q, "Lyon");
  });

  it("builds share URL with origin", () => {
    const url = buildGreenMarketShareUrl({ q: "Paris" }, "https://auros.example");
    assert.ok(url.startsWith("https://auros.example/green/market?"));
    assert.ok(url.includes("q=Paris"));
  });
});

describe("green/sprint7-rtms-checklist", () => {
  it("exports CSV with pillar bullets", () => {
    const csv = greenRtmsChecklistToCsv(getGreenMessages("fr").standards);
    assert.ok(csv.includes("Pilier RTMS"));
    assert.ok(csv.includes("Réel"));
    for (const pillar of GREEN_RTMS_PILLARS) {
      const bullet = getGreenMessages("fr").standards.pillars[pillar].bullets[0];
      assert.ok(csv.includes(bullet));
    }
  });
});

describe("green/sprint7-saved-searches", () => {
  it("caps saved searches at max", () => {
    const original = globalThis.localStorage;
    const store = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => store.set(k, v),
        removeItem: (k: string) => store.delete(k),
      },
      configurable: true,
    });
    try {
      for (let i = 0; i < GREEN_MARKET_SAVED_SEARCHES_MAX + 2; i++) {
        saveGreenMarketSearch(`search-${i}`, { q: String(i) });
      }
      const items = readGreenMarketSavedSearches();
      assert.equal(items.length, GREEN_MARKET_SAVED_SEARCHES_MAX);
    } finally {
      Object.defineProperty(globalThis, "localStorage", {
        value: original,
        configurable: true,
      });
    }
  });
});

describe("green/sprint7-i18n", () => {
  it("exposes label application status labels", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const s = getGreenMessages(locale).label.applicationStatus;
      assert.ok(s.pending.length > 0);
      assert.ok(s.approved.length > 0);
    }
  });

  it("exposes standards checklist copy", () => {
    const s = getGreenMessages("en").standards;
    assert.ok(s.exportChecklist.length > 0);
    assert.ok(s.checklistTable.criterion.length > 0);
  });
});
