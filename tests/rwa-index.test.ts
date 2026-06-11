import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { CompareHubPayload, HubProduct } from "../lib/comparators/compare-hub";
import type { ComparatorProductRow } from "../lib/comparators/types";
import {
  apyStatsFromRows,
  buildRwaIndexPayload,
  getEditionIso,
} from "../lib/rwa-index/compute";
import { rwaIndexToCsv } from "../lib/rwa-index/csv";
import { JURISDICTIONS } from "../lib/jurisdictions/data";

function sampleRow(apy: number, id: string): ComparatorProductRow {
  return {
    id,
    project: "x",
    platform: "X",
    product: id,
    apy,
    apyBase: null,
    apyReward: null,
    tvlUsd: 1,
    chains: [],
    link: "#",
    affiliate_link: "",
    logo: "",
    live: false,
    category: "sovereign",
  };
}

function hubProduct(row: ComparatorProductRow, comparatorId: HubProduct["comparatorId"]): HubProduct {
  return {
    row,
    comparatorId,
    comparatorHref: "/bonds",
    riskTier: "conservative",
    meta: {
      minInvestmentUsd: 0,
      liquidityDays: 30,
      fees: "—",
      accreditedOnly: false,
      highlight: null,
      jurisdiction: "EU",
    },
  };
}

describe("apyStatsFromRows", () => {
  it("computes min max median average", () => {
    const stats = apyStatsFromRows([
      sampleRow(4, "a"),
      sampleRow(6, "b"),
      sampleRow(8, "c"),
      sampleRow(0, "d"),
    ]);
    assert.equal(stats.productCount, 4);
    assert.equal(stats.productsWithYield, 3);
    assert.equal(stats.min, 4);
    assert.equal(stats.max, 8);
    assert.equal(stats.median, 6);
    assert.equal(stats.average, 6);
  });

  it("returns null stats when no positive apy", () => {
    const stats = apyStatsFromRows([sampleRow(0, "a")]);
    assert.equal(stats.min, null);
    assert.equal(stats.average, null);
  });
});

describe("buildRwaIndexPayload", () => {
  it("groups products by comparator category", () => {
    const hub: CompareHubPayload = {
      products: [
        hubProduct(sampleRow(5, "s1"), "stablecoins"),
        hubProduct(sampleRow(7, "b1"), "obligations"),
        hubProduct(sampleRow(9, "b2"), "obligations"),
      ],
      tiers: [],
      fetchedAt: "2026-06-11T12:00:00.000Z",
      totalProducts: 3,
    };

    const payload = buildRwaIndexPayload(hub, {
      editionIso: "2026-06-01",
      generatedAt: "2026-06-11T12:00:00.000Z",
      activeJurisdictions: 8,
    });

    assert.equal(payload.editionIso, "2026-06-01");
    assert.equal(payload.totalProducts, 3);
    assert.equal(payload.activeJurisdictions, 8);
    assert.equal(payload.categories.length, 6);

    const bonds = payload.categories.find((c) => c.id === "bonds");
    assert.ok(bonds);
    assert.equal(bonds!.stats.productCount, 2);
    assert.equal(bonds!.stats.average, 8);

    const stablecoins = payload.categories.find((c) => c.id === "stablecoins");
    assert.ok(stablecoins);
    assert.equal(stablecoins!.stats.average, 5);

    const green = payload.categories.find((c) => c.id === "green");
    assert.ok(green);
    assert.equal(green!.isIllustrative, true);
  });

  it("getEditionIso returns first day of month", () => {
    const iso = getEditionIso(new Date("2026-06-15T10:00:00Z"));
    assert.equal(iso, "2026-06-01");
  });
});

describe("rwaIndexToCsv", () => {
  it("includes header and category rows", () => {
    const hub: CompareHubPayload = {
      products: [hubProduct(sampleRow(5, "b1"), "obligations")],
      tiers: [],
      fetchedAt: "2026-06-11T12:00:00.000Z",
      totalProducts: 1,
    };
    const payload = buildRwaIndexPayload(hub, { editionIso: "2026-06-01" });
    const csv = rwaIndexToCsv(payload, { bonds: "Bonds" });
    assert.match(csv, /^edition,category/);
    assert.match(csv, /2026-06-01,Bonds/);
    assert.match(csv, /active_jurisdictions/);
    assert.equal(JURISDICTIONS.length, 8);
  });
});
