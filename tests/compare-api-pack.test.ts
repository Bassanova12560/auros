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
import type { HubProduct } from "../lib/comparators/compare-hub";

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
    const product = {
      row: {
        id: "yieldbricks-eu",
        platform: "YieldBricks",
        product: "EU Real Estate",
        category: "residential",
        apy: 7.1,
        tvlUsd: 1_000_000,
        chains: ["ethereum"],
        live: false,
        link: "/real-estate",
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

    const res = buildEligibilityResponse([product], ["yieldbricks-eu"], "2026-07-23T00:00:00.000Z");
    assert.equal(res.schema, "auros.compare.eligibility.v1");
    assert.equal(res.products.length, 1);
    assert.equal(res.products[0]!.policy.never_invent_apy, true);
    assert.equal(res.products[0]!.policy.not_legal_advice, true);
    assert.equal(res.products[0]!.jurisdiction.region, "EU");
    assert.equal(res.products[0]!.mica.eu_nexus_hint, "likely");
    assert.equal(res.products[0]!.compare.apy, 7.1);
  });
});
