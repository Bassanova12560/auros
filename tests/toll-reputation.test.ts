import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AssetDnaRecord } from "@/lib/asset-dna";
import type { ProofStreamEvent } from "@/lib/proof-stream";
import { computeRealityReputation } from "@/lib/toll/reputation";
import { searchAurosAssets } from "@/lib/toll/search";

function baseDna(overrides?: Partial<AssetDnaRecord>): AssetDnaRecord {
  return {
    id: "auros:dna:v1:other:rep-test-001",
    specVersion: "1.0.0",
    assetClass: "other",
    displayName: "Reputation Pilot Asset",
    jurisdiction: { country: "FR", frame: "EU" },
    origin: { operatorName: "Ops Co", spvName: "SPV Rep" },
    documents: [
      {
        role: "kyc",
        title: "KYC pack",
        hash: "abc123",
        issuedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        role: "ops",
        title: "Ops report",
        issuedAt: "2026-03-01T00:00:00.000Z",
      },
    ],
    compliance: {
      labelTier: "verified",
      listingTier: "referenced",
      lastReviewedAt: "2026-07-01T00:00:00.000Z",
    },
    links: { marketActorId: "actor_rep_1" },
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-07-10T00:00:00.000Z",
    ...overrides,
  };
}

function event(
  action: ProofStreamEvent["action"],
  createdAt: string,
  extra?: Partial<ProofStreamEvent>
): ProofStreamEvent {
  return {
    id: `ps_${action}_${createdAt}`,
    assetDnaId: "auros:dna:v1:other:rep-test-001",
    action,
    contentHash: "hash1",
    createdAt,
    ...extra,
  };
}

describe("toll-reputation", () => {
  it("returns low band for unknown asset", () => {
    const r = computeRealityReputation({ dna: null });
    assert.equal(r.band, "low");
    assert.ok(r.overall < 40);
    assert.ok(r.drivers.includes("unknown_asset"));
    assert.match(r.disclaimer, /not a credit rating/i);
  });

  it("scores a healthy DNA+proof pack in medium/high", () => {
    const events: ProofStreamEvent[] = [
      event("event.certified", "2026-07-15T00:00:00.000Z"),
      event("compliance.updated", "2026-07-12T00:00:00.000Z"),
      event("doc.attached", "2026-07-05T00:00:00.000Z"),
      event("market.approved", "2026-06-01T00:00:00.000Z"),
      event("dna.minted", "2026-01-02T00:00:00.000Z"),
    ];
    const r = computeRealityReputation({
      dna: baseDna(),
      events,
      provenanceCount: 4,
      sourceCount: 2,
      nowIso: "2026-07-20T00:00:00.000Z",
    });
    assert.ok(r.overall >= 40);
    assert.ok(["medium", "high"].includes(r.band));
    assert.ok(r.dimensions.dataReliability >= 40);
    assert.ok(r.dimensions.proofQuality >= 40);
    assert.ok(r.dimensions.documentHygiene >= 40);
    assert.ok(r.drivers.length >= 1);
  });

  it("penalizes expired docs and correction churn", () => {
    const dna = baseDna({
      documents: [
        {
          role: "kyc",
          title: "Expired KYC",
          expiresAt: "2025-01-01T00:00:00.000Z",
        },
      ],
      compliance: { labelTier: "none", listingTier: "demo" },
      links: undefined,
    });
    const churn: ProofStreamEvent[] = Array.from({ length: 8 }, (_, i) =>
      event("compliance.updated", `2026-07-${String(10 + i).padStart(2, "0")}T00:00:00.000Z`, {
        id: `ps_churn_${i}`,
        contentHash: undefined,
      })
    );
    const r = computeRealityReputation({
      dna,
      events: churn,
      provenanceCount: 0,
      sourceCount: 0,
      nowIso: "2026-07-20T00:00:00.000Z",
    });
    assert.ok(r.dimensions.documentHygiene < 50);
    assert.ok(r.dimensions.correctionStability < 50);
    assert.ok(r.drivers.includes("expired_documents"));
    assert.ok(r.drivers.includes("correction_churn_high"));
    assert.ok(r.drivers.includes("demo_listing_tier"));
  });

  it("search without boostReputation keeps default order shape", async () => {
    const a = await searchAurosAssets({ q: "Toll Pilot", limit: 5 });
    const b = await searchAurosAssets({
      q: "Toll Pilot",
      limit: 5,
      boostReputation: false,
    });
    assert.deepEqual(
      a.hits.map((h) => h.id),
      b.hits.map((h) => h.id)
    );
  });
});
