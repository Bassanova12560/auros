import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  sha256CanonicalJson,
  stableStringify,
  verifyCompareSignature,
  COMPARE_SNAPSHOT_HMAC_PREFIX,
} from "../lib/comparators/api/signing";
import { buildDriftNotes } from "../lib/comparators/api/catalog";
import { getSponsoredSlot, isSponsoredProductId } from "../lib/comparators/sponsored";
import { parseCompareAlertsWaitlistInput } from "../lib/comparators/alerts-waitlist";
import { buildEligibilityResponse } from "../lib/comparators/api/eligibility";
import {
  detectMovesForProducts,
  buildIdempotencyKey,
  APY_MOVE_THRESHOLD_PP,
} from "../lib/comparators/alerts-apy-moves";
import {
  normalizeIssuerKey,
  resolveCompareEntity,
} from "../lib/comparators/entity-graph";
import { resolveCompareCqs } from "../lib/comparators/green-cqs-bridge";
import { buildCompareReportAttestation } from "../lib/comparators/compare-report-pdf";
import type { HubProduct } from "../lib/comparators/compare-hub";

function sampleProduct(overrides: Partial<HubProduct["row"]> = {}): HubProduct {
  return {
    row: {
      id: "yieldbricks-eu",
      project: "yieldbricks",
      platform: "YieldBricks",
      product: "EU Real Estate",
      category: "residential",
      apy: 7.1,
      apyBase: null,
      apyReward: null,
      tvlUsd: 1_000_000,
      chains: ["ethereum"],
      live: false,
      link: "/real-estate",
      affiliate_link: "",
      logo: "",
      ...overrides,
    },
    comparatorId: "immobilier",
    comparatorHref: "/real-estate",
    riskTier: "core",
    meta: {
      minInvestmentUsd: 500,
      liquidityDays: 30,
      fees: "1.5%",
      accreditedOnly: false,
      highlight: null,
      jurisdiction: "EU",
    },
  } as HubProduct;
}

describe("compare API signing", () => {
  it("stableStringify sorts keys deterministically", () => {
    const a = stableStringify({ b: 1, a: 2 });
    const b = stableStringify({ a: 2, b: 1 });
    assert.equal(a, b);
    assert.equal(sha256CanonicalJson({ a: 1 }), sha256CanonicalJson({ a: 1 }));
  });

  it("exports HMAC prefix for agents", () => {
    assert.equal(COMPARE_SNAPSHOT_HMAC_PREFIX, "auros-compare:v1:");
  });

  it("verifyCompareSignature rejects garbage without throwing", () => {
    assert.equal(verifyCompareSignature("not-a-hash", "sig"), false);
  });
});

describe("compare drift notes", () => {
  it("flags missing slugs", () => {
    const notes = buildDriftNotes({
      requestedIds: ["a", "b"],
      foundIds: ["a"],
      fetchedAt: new Date().toISOString(),
    });
    assert.ok(notes.some((n) => n.code === "slug_missing"));
  });
});

describe("sponsored slots", () => {
  it("does not invent sponsored products by default", () => {
    assert.equal(isSponsoredProductId("spiko-eutbl"), false);
    assert.equal(getSponsoredSlot("anything"), undefined);
  });
});

describe("compare alerts waitlist parse", () => {
  it("accepts email + product ids", () => {
    const parsed = parseCompareAlertsWaitlistInput({
      email: "desk@example.com",
      productIds: ["maple-mcusdc", "backed-bib01"],
      locale: "fr",
    });
    assert.equal(parsed.ok, true);
    if (parsed.ok) {
      assert.equal(parsed.data.channel, "email");
      assert.equal(parsed.data.productIds.length, 2);
    }
  });

  it("accepts https webhook without email", () => {
    const parsed = parseCompareAlertsWaitlistInput({
      webhook_url: "https://hooks.example.com/auros",
      product_ids: ["maple-mcusdc"],
    });
    assert.equal(parsed.ok, true);
    if (parsed.ok) assert.equal(parsed.data.channel, "webhook");
  });

  it("rejects http webhook", () => {
    const parsed = parseCompareAlertsWaitlistInput({
      webhookUrl: "http://insecure.example/hook",
      productIds: ["maple-mcusdc"],
    });
    assert.equal(parsed.ok, false);
  });
});

describe("eligibility composite", () => {
  it("marks policy flags and never invents APY", () => {
    const product = sampleProduct();
    const res = buildEligibilityResponse(
      [product],
      ["yieldbricks-eu"],
      "2026-07-23T00:00:00.000Z"
    );
    assert.equal(res.schema, "auros.compare.eligibility.v1");
    assert.equal(res.products.length, 1);
    assert.equal(res.products[0]!.policy.never_invent_apy, true);
    assert.equal(res.products[0]!.policy.not_legal_advice, true);
    assert.equal(res.products[0]!.jurisdiction.region, "EU");
    assert.equal(res.products[0]!.mica.eu_nexus_hint, "likely");
    assert.equal(res.products[0]!.compare.apy, 7.1);
    assert.equal(res.products[0]!.green.cqs_data_available, false);
    assert.ok(res.products[0]!.entity_id.startsWith("ent:"));
  });

  it("attaches real CQS when Green carbon profile maps", () => {
    const product = sampleProduct({
      id: "toucan-bct-nct",
      platform: "Toucan Protocol",
      product: "BCT / NCT",
      category: "structured",
      apy: 0,
      tvlUsd: 50_000_000,
      chains: ["polygon"],
      live: false,
      link: "/green/compare?rwa=toucan",
    });
    (product as { comparatorId: string }).comparatorId = "obligations";
    const res = buildEligibilityResponse(
      [product],
      ["toucan-bct-nct"],
      "2026-07-24T00:00:00.000Z"
    );
    const green = res.products[0]!.green;
    assert.equal(green.cqs_data_available, true);
    assert.ok(green.cqs);
    assert.equal(green.cqs!.source, "green_carbon_profile");
    assert.ok(typeof green.cqs!.score === "number");
    assert.equal(green.csrd.source, "green_compare_row");
  });

  it("maps expanded aliases (regen / energy-web) without inventing APY", () => {
    const regen = sampleProduct({
      id: "regen-network",
      platform: "Regen Network",
      product: "ecocredits",
    });
    assert.ok(resolveCompareCqs(regen));
    const energy = sampleProduct({
      id: "energy-web",
      platform: "Energy Web",
      product: "EW Zero",
    });
    assert.ok(resolveCompareCqs(energy));
    assert.equal(energy.row.apy, 7.1); // sample default — never rewritten by CQS
  });
});

describe("entity graph", () => {
  it("normalizes issuer aliases", () => {
    assert.equal(normalizeIssuerKey("Maple Finance"), "maple");
    assert.equal(normalizeIssuerKey("Toucan Protocol"), "toucan");
  });

  it("builds stable entity_id", () => {
    const product = sampleProduct({
      id: "maple-mcusdc",
      platform: "Maple Finance",
      product: "Syrup USDC",
    });
    const entity = resolveCompareEntity(product);
    assert.equal(entity.issuer_key, "maple");
    assert.equal(entity.entity_id, "ent:maple:mcusdc");
    assert.ok(entity.entity_key.includes("::"));
  });

  it("attaches known token addresses and fails soft when unknown", () => {
    const known = resolveCompareEntity(
      sampleProduct({
        id: "toucan-bct-nct",
        platform: "Toucan Protocol",
        product: "BCT / NCT",
        chains: ["polygon"],
      })
    );
    assert.ok(known.token_addresses.length >= 1);
    assert.equal(known.token_addresses[0]!.source, "manual_catalog");
    assert.match(known.token_addresses[0]!.address, /^0x[a-f0-9]{40}$/);

    const unknown = resolveCompareEntity(sampleProduct());
    assert.equal(unknown.token_addresses.length, 0);
  });

  it("accepts DeFiLlama underlyingTokens when present", () => {
    const product = sampleProduct({
      id: "some-live::TOKEN",
      platform: "Unknown Desk",
      product: "TOKEN",
      project: "some-live",
      chains: ["ethereum"],
    });
    product.row.underlyingTokens = [
      {
        chain: "ethereum",
        address: "0x1111111111111111111111111111111111111111",
      },
    ];
    const entity = resolveCompareEntity(product);
    assert.equal(entity.token_addresses.length, 1);
    assert.equal(entity.token_addresses[0]!.source, "defillama");
  });
});

describe("durable alerts store honesty", () => {
  it("reports ephemeral backend when Upstash unset (file or ephemeral)", async () => {
    const prevUrl = process.env.UPSTASH_REDIS_REST_URL;
    const prevToken = process.env.UPSTASH_REDIS_REST_TOKEN;
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
    try {
      const { appendCompareAlertsWaitlist } = await import(
        "../lib/comparators/alerts-waitlist"
      );
      const result = await appendCompareAlertsWaitlist({
        email: "durable-test@example.com",
        productIds: ["maple-mcusdc"],
        locale: "en",
        channel: "email",
      });
      assert.ok(
        result.backend === "file" || result.backend === "ephemeral"
      );
      assert.equal(typeof result.ephemeral, "boolean");
      if (result.ephemeral) {
        assert.ok(result.warning?.includes("UPSTASH"));
      }
    } finally {
      if (prevUrl != null) process.env.UPSTASH_REDIS_REST_URL = prevUrl;
      else delete process.env.UPSTASH_REDIS_REST_URL;
      if (prevToken != null) process.env.UPSTASH_REDIS_REST_TOKEN = prevToken;
      else delete process.env.UPSTASH_REDIS_REST_TOKEN;
    }
  });
});

describe("APY move detection", () => {
  it("emits move when APY delta exceeds threshold", () => {
    const product = sampleProduct({
      id: "maple-mcusdc",
      apy: 8.5,
      tvlUsd: 10_000_000,
    });
    const previous = {
      updated_at: "2026-07-23T00:00:00.000Z",
      products: {
        "maple-mcusdc": {
          product_id: "maple-mcusdc",
          apy: 8.5 - APY_MOVE_THRESHOLD_PP - 0.1,
          tvl_usd: 10_000_000,
          live: false,
          as_of: "2026-07-23T00:00:00.000Z",
        },
      },
    };
    const { moves } = detectMovesForProducts(
      [product],
      previous,
      "2026-07-24T00:00:00.000Z"
    );
    assert.ok(moves.some((m) => m.field === "apy"));
    const key = buildIdempotencyKey("w1", moves, "2026-07-24");
    assert.equal(key.length, 32);
  });

  it("does not invent moves on first baseline", () => {
    const product = sampleProduct({ id: "maple-mcusdc", apy: 8.5 });
    const { moves } = detectMovesForProducts(
      [product],
      { updated_at: new Date(0).toISOString(), products: {} },
      "2026-07-24T00:00:00.000Z"
    );
    assert.equal(moves.length, 0);
  });
});

describe("compare report attestation", () => {
  it("hashes shortlist without inventing APY", () => {
    const product = sampleProduct();
    const att = buildCompareReportAttestation(
      [
        product,
        sampleProduct({
          id: "backed-bib01",
          platform: "Backed",
          product: "bIB01",
        }),
      ],
      "2026-07-24T00:00:00.000Z"
    );
    assert.equal(att.content_hash.length, 64);
    assert.equal(att.product_ids.length, 2);
  });
});

describe("green CQS bridge honesty", () => {
  it("returns null CQS when no Green profile", () => {
    assert.equal(resolveCompareCqs(sampleProduct()), null);
  });
});
