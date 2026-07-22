import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mintAssetDna } from "@/lib/asset-dna";
import { appendProofStreamEvent } from "@/lib/proof-stream";
import { getGreenPortfolioSnapshot } from "@/lib/green/portfolio-snapshot";

describe("green/portfolio-snapshot", () => {
  it("includes minted DNA with recent stream events", async () => {
    const dna = await mintAssetDna({
      assetClass: "green_energy",
      displayName: "Portfolio test asset",
      jurisdiction: { country: "FR" },
    });
    appendProofStreamEvent({
      assetDnaId: dna.id,
      action: "dna.minted",
      meta: { test: true },
    });

    const snap = await getGreenPortfolioSnapshot(100);
    assert.ok(snap.totalDna >= 1);
    const row = snap.assets.find((a) => a.assetDnaId === dna.id);
    assert.ok(row);
    assert.equal(row!.displayName, "Portfolio test asset");
    assert.ok(row!.lastAction === "dna.minted" || row!.eventCount >= 1);
    assert.ok(Array.isArray(snap.alerts));
    assert.equal(typeof snap.alertCount, "number");
  });
});
