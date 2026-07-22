import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mintAssetDna } from "@/lib/asset-dna";
import { appendProofStreamEvent } from "@/lib/proof-stream";
import {
  computeAurosTrustScore,
  dispatchTollAgentTool,
  evaluateTollPolicy,
  getAurosMetadataSchema,
  resolveAurosAsset,
  searchAurosAssets,
} from "@/lib/toll";

describe("auros-toll", () => {
  it("exposes metadata schema", () => {
    const schema = getAurosMetadataSchema();
    assert.equal(schema.$id, "auros.rwa.asset.v0");
    assert.ok(schema.required.includes("id"));
  });

  it("flags unknown assets as elevated risk", async () => {
    const r = await resolveAurosAsset({ q: "definitely-not-an-asset-xyz" });
    assert.equal(r.resolved, false);
    assert.equal(r.risk, "unknown_asset");
    assert.ok(r.trust.overall < 20);
  });

  it("resolves minted DNA and scores trust", async () => {
    const dna = await mintAssetDna({
      assetClass: "green_energy",
      displayName: "Toll Pilot Solar",
      jurisdiction: { country: "FR" },
      origin: { siteName: "Pilot Site", spvName: "Pilot SPV" },
      documents: [
        {
          role: "deed",
          title: "Title",
          issuedAt: "2026-01-01",
        },
      ],
      compliance: { listingTier: "referenced", labelTier: "pilot" },
      seedKey: `toll-test-${Date.now()}`,
    });
    appendProofStreamEvent({
      assetDnaId: dna.id,
      action: "dna.minted",
    });

    const r = await resolveAurosAsset({ q: dna.id });
    assert.equal(r.resolved, true);
    if (!r.resolved) return;
    assert.equal(r.dna.displayName, "Toll Pilot Solar");
    assert.ok(r.trust.overall >= 40);

    const policy = evaluateTollPolicy({
      dna: r.dna,
      events: [],
    });
    assert.ok(["allow", "review", "deny"].includes(policy.decision));

    const trustUnknown = computeAurosTrustScore({ dna: null });
    assert.equal(trustUnknown.band, "low");
  });

  it("searches DNA by name", async () => {
    const result = await searchAurosAssets({ q: "Toll Pilot", limit: 10 });
    assert.ok(result.hits.length >= 1);
    assert.ok(result.hits.some((h) => h.kind === "dna"));
  });

  it("dispatches agent list_tools", async () => {
    const out = await dispatchTollAgentTool({ tool: "list_tools" });
    assert.equal(out.ok, true);
    if (!out.ok) return;
    const tools = (out.result as { tools: string[] }).tools;
    assert.ok(tools.includes("resolve_asset"));
  });
});
