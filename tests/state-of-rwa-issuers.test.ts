import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { CompareHubPayload, HubProduct } from "../lib/comparators/compare-hub";
import type { ComparatorProductRow } from "../lib/comparators/types";
import { buildRwaIndexPayload } from "../lib/rwa-index/compute";
import {
  buildStateOfRwaIssuersPayload,
  computeAssetMix,
  computeMicaAvgScore,
  getQuarterStartIso,
  INDICATIVE_MICA_SIGNALS,
} from "../lib/state-of-rwa-issuers/compute";
import {
  createReportDownloadToken,
  verifyReportDownloadToken,
} from "../lib/state-of-rwa-issuers/download-token";
import { CURRENT_EDITION } from "../lib/state-of-rwa-issuers/types";

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

describe("computeAssetMix", () => {
  it("computes share percentages from product counts", () => {
    const mix = computeAssetMix(
      [
        {
          id: "bonds",
          compareHref: "/bonds",
          stats: {
            min: 4,
            max: 8,
            median: 6,
            average: 6,
            productCount: 40,
            productsWithYield: 40,
          },
          sourceNote: "",
          isIllustrative: false,
        },
        {
          id: "stablecoins",
          compareHref: "/stablecoins",
          stats: {
            min: 3,
            max: 5,
            median: 4,
            average: 4,
            productCount: 60,
            productsWithYield: 60,
          },
          sourceNote: "",
          isIllustrative: false,
        },
      ],
      100
    );
    assert.equal(mix.length, 2);
    assert.equal(mix[0]!.sharePct, 40);
    assert.equal(mix[1]!.sharePct, 60);
  });
});

describe("computeMicaAvgScore", () => {
  it("averages indicative MiCA signal scores", () => {
    const avg = computeMicaAvgScore(INDICATIVE_MICA_SIGNALS);
    assert.equal(avg, 56);
  });
});

describe("buildStateOfRwaIssuersPayload", () => {
  it("builds quarterly payload from rwa index", () => {
    const hub: CompareHubPayload = {
      products: [
        hubProduct(sampleRow(5, "b1"), "obligations"),
        hubProduct(sampleRow(7, "s1"), "stablecoins"),
      ],
      tiers: [],
      fetchedAt: "2026-06-11T12:00:00.000Z",
      totalProducts: 2,
    };
    const rwaIndex = buildRwaIndexPayload(hub, { editionIso: "2026-06-01" });
    const payload = buildStateOfRwaIssuersPayload(rwaIndex, {
      edition: "2026-Q2",
      generatedAt: "2026-06-11T12:00:00.000Z",
    });

    assert.equal(payload.edition, "2026-Q2");
    assert.equal(payload.totalProducts, 2);
    assert.ok(payload.assetMix.length >= 6);
    assert.equal(payload.micaReadiness.signals.length, 4);
    assert.equal(payload.blockers.length, 4);
    assert.equal(payload.jurisdictionBreakdown.length, 8);
    assert.ok(payload.jurisdictionBreakdown[0]!.sharePct >= payload.jurisdictionBreakdown[1]!.sharePct);
  });

  it("getQuarterStartIso returns first month of quarter", () => {
    assert.equal(getQuarterStartIso("2026-Q2"), "2026-04-01");
    assert.equal(getQuarterStartIso("2026-Q4"), "2026-10-01");
  });
});

describe("report download token", () => {
  it("creates and verifies HMAC token", () => {
    const token = createReportDownloadToken({
      email: "test@example.com",
      name: "Test User",
      edition: CURRENT_EDITION,
    });
    const verified = verifyReportDownloadToken(token, CURRENT_EDITION);
    assert.ok(verified);
    assert.equal(verified!.email, "test@example.com");
    assert.equal(verified!.name, "Test User");
  });

  it("rejects invalid token", () => {
    assert.equal(verifyReportDownloadToken("bad-token", CURRENT_EDITION), null);
  });
});
