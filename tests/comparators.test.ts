import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildStablecoinFallback,
  buildStablecoinPayload,
  buildBondsPayload,
  buildCommoditiesPayload,
  buildPrivateCreditPayload,
  buildImmobilierPayload,
  computeComparatorSummary,
  filterRwaPools,
  formatTvl,
  getComparatorMessages,
  groupPoolsByProduct,
  isCompareHubPath,
  isComparatorPath,
  parseManualPools,
  parseManualProducts,
  resolveRiskTier,
  matchesMinInvestmentFilter,
  resolveProductMeta,
  tabLabelForId,
  type DefiLlamaPool,
} from "../lib/comparators";

describe("comparators/defillama", () => {
  const sample: DefiLlamaPool[] = [
    {
      pool: "a",
      chain: "Ethereum",
      project: "ondo-yield-assets",
      symbol: "USDY",
      tvlUsd: 500_000,
      apy: 3.5,
    },
    {
      pool: "b",
      chain: "Solana",
      project: "ondo-yield-assets",
      symbol: "USDY",
      tvlUsd: 200_000,
      apy: 4.0,
    },
    {
      pool: "c",
      chain: "Ethereum",
      project: "unknown",
      symbol: "X",
      tvlUsd: 999_999,
      apy: 99,
    },
    {
      pool: "d",
      chain: "Ethereum",
      project: "maple",
      symbol: "USDC",
      tvlUsd: 50_000,
      apy: 5,
    },
  ];

  it("filters by project slug, apy and min tvl", () => {
    const out = filterRwaPools(sample, ["ondo-yield-assets", "maple"]);
    assert.equal(out.length, 2);
    assert.equal(out[0].project, "ondo-yield-assets");
  });

  it("groups pools by project and symbol", () => {
    const filtered = filterRwaPools(sample, ["ondo-yield-assets"]);
    const grouped = groupPoolsByProduct(filtered);
    assert.equal(grouped.length, 1);
    assert.equal(grouped[0].tvlUsd, 700_000);
    assert.equal(grouped[0].apy, 4.0);
    assert.deepEqual(grouped[0].chains.sort(), ["Ethereum", "Solana"]);
  });

  it("formats tvl labels", () => {
    assert.equal(formatTvl(1_500_000_000), "$1.5B");
    assert.equal(formatTvl(12_000_000), "$12M");
    assert.equal(formatTvl(450_000), "$450K");
  });
});

describe("comparators/build-stablecoins", () => {
  it("merges live rows with manual fallback entries", () => {
    const pools: DefiLlamaPool[] = [
      {
        pool: "1",
        chain: "Ethereum",
        project: "maple",
        symbol: "USDC",
        tvlUsd: 1_000_000,
        apy: 4.5,
      },
    ];
    const manual = parseManualPools([
      {
        id: "mountain-usdm",
        project: "mountain-protocol",
        platform: "Mountain Protocol",
        product: "USDM",
        apy: 5,
        chains: ["Ethereum"],
        link: "https://mountainprotocol.com",
      },
    ]);

    const payload = buildStablecoinPayload(pools, manual, "2026-05-29T12:00:00.000Z");
    assert.equal(payload.source, "live");
    assert.equal(payload.rows.length, 2);
    assert.equal(payload.rows[0].product, "USDM");
  });

  it("falls back to manual only", () => {
    const manual = parseManualPools([
      {
        id: "x",
        project: "p",
        platform: "P",
        product: "Y",
        apy: 3,
        chains: ["Ethereum"],
        link: "https://example.com",
      },
    ]);
    const payload = buildStablecoinFallback(manual, "2026-05-29T12:00:00.000Z");
    assert.equal(payload.source, "fallback");
    assert.equal(payload.rows.length, 1);
  });
});

describe("comparators/validate", () => {
  it("rejects invalid manual pool entries", () => {
    const out = parseManualPools([
      { bad: true },
      {
        id: "ok",
        project: "p",
        platform: "P",
        product: "Y",
        apy: 1,
        chains: ["Ethereum"],
        link: "https://example.com",
      },
    ]);
    assert.equal(out.length, 1);
    assert.equal(out[0].id, "ok");
  });
});

describe("comparators/stats", () => {
  it("computes summary metrics", () => {
    const summary = computeComparatorSummary([
      {
        id: "a",
        project: "p",
        platform: "Alpha",
        product: "A",
        apy: 5,
        apyBase: null,
        apyReward: null,
        tvlUsd: 100,
        chains: ["Ethereum"],
        link: "#",
        affiliate_link: "",
        logo: "",
        live: true,
        category: "treasury",
      },
      {
        id: "b",
        project: "p2",
        platform: "Beta",
        product: "B",
        apy: 3,
        apyBase: null,
        apyReward: null,
        tvlUsd: 200,
        chains: ["Ethereum"],
        link: "#",
        affiliate_link: "",
        logo: "",
        live: true,
        category: "credit",
      },
    ]);
    assert.equal(summary.bestApy?.apy, 5);
    assert.equal(summary.totalTvlUsd, 300);
    assert.equal(summary.platformCount, 2);
  });
});

describe("comparators/build-immobilier", () => {
  it("merges live rows with manual real estate entries", () => {
    const manual = parseManualProducts([
      {
        id: "realt-portfolio",
        project: "realt-tokens",
        platform: "RealT",
        product: "Portefeuille locatif US",
        apy: 9.5,
        chains: ["Gnosis"],
        link: "https://realt.co",
        category: "residential",
      },
    ]);

    const payload = buildImmobilierPayload([], manual, "2026-05-29T12:00:00.000Z");
    assert.equal(payload.source, "fallback");
    assert.equal(payload.rows.length, 1);
    assert.equal(payload.rows[0].category, "residential");
  });
});

describe("comparators/build-bonds", () => {
  it("filters ondo to OUSG only and merges manual entries", () => {
    const pools: DefiLlamaPool[] = [
      {
        pool: "1",
        chain: "Ethereum",
        project: "ondo-yield-assets",
        symbol: "USDY",
        tvlUsd: 1_000_000,
        apy: 3.5,
      },
      {
        pool: "2",
        chain: "Ethereum",
        project: "ondo-yield-assets",
        symbol: "OUSG",
        tvlUsd: 500_000,
        apy: 3.4,
      },
      {
        pool: "3",
        chain: "Ethereum",
        project: "openeden-tbill",
        symbol: "TBILL",
        tvlUsd: 2_000_000,
        apy: 3.54,
      },
    ];
    const manual = parseManualProducts([
      {
        id: "republic-note",
        project: "republic-note",
        platform: "Republic",
        product: "Republic Note",
        apy: 5.5,
        chains: ["Avalanche"],
        link: "https://republic.com/note",
        category: "corporate",
      },
    ]);

    const payload = buildBondsPayload(pools, manual, "2026-05-29T12:00:00.000Z");
    assert.equal(payload.source, "live");
    assert.equal(payload.rows.length, 3);
    assert.ok(!payload.rows.some((r) => r.product === "USDY"));
    assert.equal(payload.rows[0].product, "Republic Note");
  });
});

describe("comparators/build-commodities", () => {
  it("merges landx live rows with manual precious metals", () => {
    const pools: DefiLlamaPool[] = [
      {
        pool: "1",
        chain: "Ethereum",
        project: "landx-finance",
        symbol: "XSOY",
        tvlUsd: 500_000,
        apy: 11.9,
      },
    ];
    const manual = parseManualProducts([
      {
        id: "paxos-paxg",
        project: "paxos-gold",
        platform: "Paxos",
        product: "PAXG",
        apy: 0,
        chains: ["Ethereum"],
        link: "https://paxos.com/paxgold",
        category: "precious_metals",
      },
    ]);

    const payload = buildCommoditiesPayload(
      pools,
      manual,
      "2026-05-29T12:00:00.000Z"
    );
    assert.equal(payload.rows.length, 2);
    assert.equal(payload.rows[0].product, "XSOY");
  });
});

describe("comparators/build-private-credit", () => {
  it("defaults maple to prime and excludes centrifuge USDS", () => {
    const pools: DefiLlamaPool[] = [
      {
        pool: "1",
        chain: "Ethereum",
        project: "maple",
        symbol: "USDC",
        tvlUsd: 1_000_000,
        apy: 4.6,
      },
      {
        pool: "2",
        chain: "Ethereum",
        project: "centrifuge-protocol",
        symbol: "USDS",
        tvlUsd: 900_000,
        apy: 2.7,
      },
      {
        pool: "3",
        chain: "Ethereum",
        project: "centrifuge-protocol",
        symbol: "USDC",
        tvlUsd: 400_000,
        apy: 7.1,
      },
    ];

    const payload = buildPrivateCreditPayload(
      pools,
      [],
      "2026-05-29T12:00:00.000Z"
    );
    assert.equal(payload.rows.length, 2);
    assert.ok(!payload.rows.some((r) => r.product === "USDS"));
    assert.equal(payload.rows.find((r) => r.platform === "Maple Finance")?.category, "prime");
  });
});

describe("comparators/i18n", () => {
  it("exposes three locales with stablecoins copy", () => {
    assert.ok(getComparatorMessages("fr").stablecoins.title.includes("Stablecoins"));
    assert.ok(getComparatorMessages("en").stablecoins.title.includes("Stablecoins"));
    assert.ok(getComparatorMessages("es").stablecoins.title.includes("Stablecoins"));
  });

  it("exposes immobilier copy in all locales", () => {
    assert.ok(getComparatorMessages("fr").immobilier.title.includes("Immobilier"));
    assert.ok(getComparatorMessages("en").immobilier.title.toLowerCase().includes("real estate"));
    assert.ok(getComparatorMessages("es").immobilier.title.includes("Inmobiliario"));
  });

  it("exposes bonds copy in all locales", () => {
    assert.ok(getComparatorMessages("fr").obligations.title.includes("Obligations"));
    assert.ok(getComparatorMessages("en").obligations.title.toLowerCase().includes("bond"));
    assert.ok(getComparatorMessages("es").obligations.title.includes("Bonos"));
  });

  it("maps tab ids to labels", () => {
    const m = getComparatorMessages("fr");
    assert.equal(tabLabelForId(m, "stablecoins"), "Stablecoins");
    assert.equal(tabLabelForId(m, "immobilier"), "Immobilier");
  });

  it("exposes compare hub copy in all locales", () => {
    assert.ok(getComparatorMessages("fr").compareHub.title.includes("risque"));
    assert.ok(getComparatorMessages("en").compareHub.title.toLowerCase().includes("risk"));
    assert.ok(getComparatorMessages("es").compareHub.title.includes("riesgo"));
  });
});

describe("comparators/risk", () => {
  it("maps stablecoin treasury to conservative tier", () => {
    assert.equal(resolveRiskTier("stablecoins", "treasury"), "conservative");
    assert.equal(resolveRiskTier("stablecoins", "credit"), "advanced");
  });

  it("maps bonds sovereign to conservative tier", () => {
    assert.equal(resolveRiskTier("obligations", "sovereign"), "conservative");
    assert.equal(resolveRiskTier("obligations", "structured"), "advanced");
  });
});

describe("comparators/product-meta", () => {
  it("filters by minimum investment threshold", () => {
    assert.equal(
      matchesMinInvestmentFilter(
        { minInvestmentUsd: 50, liquidityDays: 1, fees: "0%", accreditedOnly: false, highlight: null },
        "under500"
      ),
      true
    );
    assert.equal(
      matchesMinInvestmentFilter(
        { minInvestmentUsd: 25_000, liquidityDays: 90, fees: "1%", accreditedOnly: true, highlight: null },
        "under500"
      ),
      false
    );
  });

  it("marks goldfinch as accredited", () => {
    assert.equal(
      resolveProductMeta("private-credit", {
        id: "goldfinch::USDC",
        project: "goldfinch",
        platform: "Goldfinch",
        product: "USDC",
        apy: 8,
        apyBase: null,
        apyReward: null,
        tvlUsd: 1_000_000,
        chains: ["Ethereum"],
        link: "https://goldfinch.finance",
        affiliate_link: "",
        logo: "",
        live: true,
        category: "emerging",
      }).accreditedOnly,
      true
    );
  });
});

describe("comparators/registry", () => {
  it("treats /compare as comparator shell path", () => {
    assert.equal(isCompareHubPath("/compare"), true);
    assert.equal(isComparatorPath("/compare"), true);
    assert.equal(isComparatorPath("/stablecoins"), true);
    assert.equal(isComparatorPath("/wizard"), false);
  });
});
