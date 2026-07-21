import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeGreenProofMetrics } from "@/lib/green/proof-metrics";
import type { GreenRegistrySnapshot } from "@/lib/green/green-registry";
import type { GreenMarketSnapshot } from "@/lib/green/market/green-market-db";

describe("green/proof-metrics", () => {
  it("counts registry and market tiers without inventing volume", () => {
    const registry: GreenRegistrySnapshot = {
      available: true,
      projects: [
        {
          id: "1",
          name: "A",
          projectType: "solar",
          country: "PT",
          labelTier: "verified",
          certifiedAt: "2026-01-01",
          verifyToken: "t",
          summaries: { fr: "a", en: "a", es: "a" },
        },
        {
          id: "2",
          name: "B",
          projectType: "wind",
          country: "ES",
          labelTier: "pilot",
          certifiedAt: "2026-01-02",
          verifyToken: "u",
          summaries: { fr: "b", en: "b", es: "b" },
        },
      ],
      experts: [],
    };
    const market = {
      available: true,
      mode: "live" as const,
      actors: [
        { listingTier: "verified" },
        { listingTier: "referenced" },
        { listingTier: "demo" },
      ],
      offers: [{}, {}],
    } as unknown as GreenMarketSnapshot;

    const m = computeGreenProofMetrics({ registry, market });
    assert.equal(m.registryProjects, 2);
    assert.equal(m.registryVerified, 1);
    assert.equal(m.registryPilot, 1);
    assert.equal(m.marketVerified, 1);
    assert.equal(m.marketReferenced, 1);
    assert.equal(m.marketDemo, 1);
    assert.equal(m.marketOffers, 2);
    assert.equal(m.hasRealSurface, true);
  });
});
