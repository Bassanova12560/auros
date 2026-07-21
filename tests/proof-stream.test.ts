import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { mintAssetDna } from "@/lib/asset-dna";
import {
  appendProofStreamEvent,
  listProofStreamEvents,
} from "@/lib/proof-stream";

describe("proof-stream v0", () => {
  it("appends events keyed by Asset DNA", async () => {
    const dna = await mintAssetDna({
      assetClass: "green_energy",
      displayName: "Stream pilot",
      jurisdiction: { country: "PT" },
    });
    appendProofStreamEvent({
      assetDnaId: dna.id,
      action: "dna.minted",
      meta: { test: true },
    });
    appendProofStreamEvent({
      assetDnaId: dna.id,
      action: "market.submitted",
    });
    const events = listProofStreamEvents(dna.id, 10);
    assert.ok(events.length >= 2);
    assert.equal(events[0]!.assetDnaId, dna.id);
    assert.ok(
      events.some((e) => e.action === "dna.minted") &&
        events.some((e) => e.action === "market.submitted")
    );
  });
});
