import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AssetDnaRecord } from "@/lib/asset-dna";
import { ASSET_DNA_SPEC_VERSION } from "@/lib/asset-dna";
import {
  evaluateEligibility,
  isRestrictedProduct,
} from "@/lib/toll/eligibility";

function fixtureDna(
  overrides: Partial<AssetDnaRecord> = {}
): AssetDnaRecord {
  const now = "2026-07-01T00:00:00.000Z";
  return {
    id: "auros:dna:v1:ge:eligibility-fixture",
    specVersion: ASSET_DNA_SPEC_VERSION,
    assetClass: "green_energy",
    displayName: "Eligibility Fixture Solar",
    jurisdiction: { country: "FR", frame: "EU" },
    origin: { siteName: "Site A", spvName: "SPV A" },
    documents: [
      { role: "deed", title: "Title", issuedAt: "2026-01-01" },
    ],
    compliance: { listingTier: "referenced", labelTier: "pilot" },
    links: { marketActorId: "actor:demo" },
    createdAt: now,
    updatedAt: now,
    ...overrides,
    jurisdiction: {
      country: "FR",
      frame: "EU",
      ...overrides.jurisdiction,
    },
    compliance: {
      listingTier: "referenced",
      labelTier: "pilot",
      ...overrides.compliance,
    },
    origin: {
      siteName: "Site A",
      spvName: "SPV A",
      ...overrides.origin,
    },
  };
}

describe("toll-eligibility", () => {
  it("denies unknown assets", () => {
    const r = evaluateEligibility({
      dna: null,
      operation: "buy",
    });
    assert.equal(r.decision, "deny");
    assert.ok(r.ruleIds.includes("deny_unknown"));
    assert.equal(r.resolved, false);
    assert.ok(/HITL|integrator enforces|does not auto-block/i.test(r.disclaimer));
  });

  it("denies US investor on demo / restricted product", () => {
    const demo = fixtureDna({
      compliance: { listingTier: "demo" },
    });
    assert.equal(isRestrictedProduct(demo), true);

    const r = evaluateEligibility({
      dna: demo,
      operation: "buy",
      investor: { jurisdiction: "US" },
      rules: ["deny_us_restricted"],
    });
    assert.equal(r.decision, "deny");
    assert.ok(r.ruleIds.includes("deny_us_restricted"));

    const framed = fixtureDna({
      jurisdiction: { country: "FR", frame: "us-restricted" },
    });
    const r2 = evaluateEligibility({
      dna: framed,
      operation: "mint",
      investor: { residency: "US" },
      rules: ["deny_us_restricted"],
    });
    assert.equal(r2.decision, "deny");
    assert.ok(r2.ruleIds.includes("deny_us_restricted"));
  });

  it("allows non-US investor on restricted product when only deny_us_restricted active", () => {
    const demo = fixtureDna({
      compliance: { listingTier: "demo" },
    });
    const r = evaluateEligibility({
      dna: demo,
      operation: "buy",
      investor: { jurisdiction: "FR" },
      rules: ["deny_us_restricted"],
    });
    assert.equal(r.decision, "allow");
    assert.ok(!r.ruleIds.includes("deny_us_restricted"));
  });

  it("requires wallet attribution for transfer", () => {
    const dna = fixtureDna();
    const missing = evaluateEligibility({
      dna,
      operation: "transfer",
      rules: ["require_wallet_attribution"],
    });
    assert.equal(missing.decision, "deny");
    assert.ok(missing.ruleIds.includes("require_wallet_attribution"));

    const short = evaluateEligibility({
      dna,
      operation: "transfer",
      investor: { wallet: "0x1" },
      rules: ["require_wallet_attribution"],
    });
    assert.equal(short.decision, "deny");

    const withWallet = evaluateEligibility({
      dna,
      operation: "transfer",
      investor: { wallet: "0xabc1234567890def", jurisdiction: "FR" },
      rules: ["require_wallet_attribution"],
    });
    assert.ok(
      ["allow", "allow_with_restrictions"].includes(withWallet.decision)
    );
    assert.ok(withWallet.wallet);
    assert.ok(!withWallet.ruleIds.includes("require_wallet_attribution"));
  });

  it("escalates PEP to review", () => {
    const r = evaluateEligibility({
      dna: fixtureDna(),
      operation: "buy",
      investor: { pep: true, jurisdiction: "FR" },
      rules: ["review_pep"],
    });
    assert.equal(r.decision, "review");
    assert.ok(r.ruleIds.includes("review_pep"));
    assert.ok(/HITL/i.test(r.reasons.join(" ")));
  });

  it("allows with restrictions when unaccredited", () => {
    const r = evaluateEligibility({
      dna: fixtureDna(),
      operation: "buy",
      investor: { accredited: false, jurisdiction: "FR" },
      rules: ["restrict_unaccredited"],
    });
    assert.equal(r.decision, "allow_with_restrictions");
    assert.ok(r.restrictions.includes("accreditation_not_attested"));
    assert.ok(r.ruleIds.includes("restrict_unaccredited"));
  });

  it("composes policy deny_unmapped_entity", () => {
    const r = evaluateEligibility({
      dna: fixtureDna({
        origin: { siteName: "", spvName: "" },
        links: {},
      }),
      operation: "list",
      rules: ["deny_unmapped_entity"],
    });
    assert.equal(r.decision, "deny");
    assert.ok(r.ruleIds.includes("deny_unmapped_entity"));
  });
});
