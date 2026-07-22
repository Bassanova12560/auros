import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AssetDnaRecord } from "@/lib/asset-dna";
import { ASSET_DNA_SPEC_VERSION } from "@/lib/asset-dna";
import {
  evaluateAssetRedTeam,
  runAssetRedTeam,
} from "@/lib/toll/red-team";

function fixtureDna(
  overrides: Partial<AssetDnaRecord> = {}
): AssetDnaRecord {
  const now = "2026-07-01T00:00:00.000Z";
  return {
    id: "auros:dna:v1:ge:redteam-fixture",
    specVersion: ASSET_DNA_SPEC_VERSION,
    assetClass: "green_energy",
    displayName: "Red-Team Fixture Solar",
    jurisdiction: { country: "FR", frame: "EU" },
    origin: {
      siteName: "Site RT",
      spvName: "SPV RT",
      operatorName: "Ops Co",
      coordinates: { lat: 48.8, lon: 2.3 },
    },
    documents: [
      {
        role: "deed",
        title: "Title deed",
        hash: "abc123",
        issuedAt: "2026-01-01",
      },
    ],
    compliance: { listingTier: "referenced", labelTier: "pilot" },
    links: {
      marketActorId: "actor:demo",
      registryProjectId: "reg:demo",
      dossierId: "dos:demo",
    },
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
      siteName: "Site RT",
      spvName: "SPV RT",
      operatorName: "Ops Co",
      coordinates: { lat: 48.8, lon: 2.3 },
      ...overrides.origin,
    },
    documents: overrides.documents ?? [
      {
        role: "deed",
        title: "Title deed",
        hash: "abc123",
        issuedAt: "2026-01-01",
      },
    ],
    links: {
      marketActorId: "actor:demo",
      registryProjectId: "reg:demo",
      dossierId: "dos:demo",
      ...overrides.links,
    },
  };
}

describe("toll-red-team", () => {
  it("flags unresolved assets as critical", () => {
    const r = evaluateAssetRedTeam({ dna: null });
    assert.equal(r.resolved, false);
    assert.ok(r.findings.some((f) => f.id === "rt_unresolved"));
    assert.ok(r.score < 100);
    assert.ok(/HITL|not a penetration|not.*Verified/i.test(r.disclaimer));
  });

  it("flags empty documents and unmapped entity", () => {
    const r = evaluateAssetRedTeam({
      dna: fixtureDna({
        documents: [],
        origin: { siteName: "", spvName: "", operatorName: "" },
        links: {
          marketActorId: "",
          registryProjectId: "",
          dossierId: "",
        },
      }),
      nowIso: "2026-07-15T00:00:00.000Z",
    });
    assert.ok(r.findings.some((f) => f.category === "documentary_gap"));
    assert.ok(r.findings.some((f) => f.id === "rt_unmapped"));
    assert.ok(r.findings.some((f) => f.category === "policy_fail"));
    assert.ok(r.score < 50);
  });

  it("flags rights ambiguity and expired docs", () => {
    const r = evaluateAssetRedTeam({
      dna: fixtureDna({
        documents: [
          {
            role: "permit",
            title: "Old permit",
            expiresAt: "2025-01-01",
          },
        ],
      }),
      events: [
        {
          id: "ev1",
          assetDnaId: "auros:dna:v1:ge:redteam-fixture",
          action: "compliance.updated",
          createdAt: "2026-06-01T00:00:00.000Z",
        },
      ],
      nowIso: "2026-07-15T00:00:00.000Z",
    });
    assert.ok(r.findings.some((f) => f.id === "rt_docs_expired"));
    assert.ok(r.findings.some((f) => f.category === "rights_ambiguity"));
    assert.ok(r.findings.some((f) => f.id === "rt_docs_no_title"));
  });

  it("flags stale trail when events are old", () => {
    const r = evaluateAssetRedTeam({
      dna: fixtureDna(),
      events: [
        {
          id: "ev_old",
          assetDnaId: "auros:dna:v1:ge:redteam-fixture",
          action: "compliance.updated",
          createdAt: "2025-01-01T00:00:00.000Z",
        },
      ],
      nowIso: "2026-07-15T00:00:00.000Z",
    });
    assert.ok(r.findings.some((f) => f.id === "rt_trail_stale"));
    assert.ok(r.findings.some((f) => f.category === "stale_trail"));
  });

  it("runAssetRedTeam accepts fixture dna (pure path)", async () => {
    const r = await runAssetRedTeam({
      dna: fixtureDna(),
      events: [
        {
          id: "ev_fresh",
          assetDnaId: "auros:dna:v1:ge:redteam-fixture",
          action: "doc.attached",
          createdAt: "2026-07-10T00:00:00.000Z",
        },
      ],
      nowIso: "2026-07-15T00:00:00.000Z",
    });
    assert.equal(r.resolved, true);
    assert.equal(r.assetDnaId, "auros:dna:v1:ge:redteam-fixture");
    assert.ok(typeof r.score === "number");
    assert.ok(r.findings.some((f) => f.category === "rights_ambiguity"));
  });
});
