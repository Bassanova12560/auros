import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computePortfolioAlerts } from "@/lib/green/portfolio-alerts";
import type { PortfolioAssetRow } from "@/lib/green/portfolio-types";
import {
  createAssetDnaRecord,
  deterministicAssetDnaId,
} from "@/lib/asset-dna";

function baseRow(partial: Partial<PortfolioAssetRow>): PortfolioAssetRow {
  return {
    assetDnaId: "auros:dna:v1:ge:00000000-0000-4000-a000-000000000001",
    displayName: "Test",
    assetClass: "green_energy",
    country: "FR",
    source: "market",
    eventCount: 0,
    recentEvents: [],
    ...partial,
  };
}

describe("portfolio-alerts", () => {
  it("flags silent and stale streams", () => {
    const silent = computePortfolioAlerts({
      assets: [baseRow({ lastEventAt: undefined })],
      nowIso: "2026-07-22T00:00:00.000Z",
    });
    assert.ok(silent.some((a) => a.kind === "proof_stream_silent"));

    const stale = computePortfolioAlerts({
      assets: [baseRow({ lastEventAt: "2026-01-01T00:00:00.000Z" })],
      nowIso: "2026-07-22T00:00:00.000Z",
    });
    assert.ok(stale.some((a) => a.kind === "proof_stream_stale"));
  });

  it("flags pending listing and expired docs", () => {
    const alerts = computePortfolioAlerts({
      assets: [
        baseRow({
          lastEventAt: "2026-07-20T00:00:00.000Z",
          marketStatus: "pending",
          listingTier: "demo",
          expiredDocuments: ["PPA"],
        }),
      ],
      nowIso: "2026-07-22T00:00:00.000Z",
    });
    assert.ok(alerts.some((a) => a.kind === "listing_pending"));
    assert.ok(alerts.some((a) => a.kind === "demo_tier"));
    assert.ok(alerts.some((a) => a.kind === "document_expired"));
  });
});

describe("deterministic asset dna", () => {
  it("is stable for the same seed key", () => {
    const a = deterministicAssetDnaId("green_energy", "registry:demo-1");
    const b = deterministicAssetDnaId("green_energy", "registry:demo-1");
    assert.equal(a, b);
    const record = createAssetDnaRecord({
      assetClass: "green_energy",
      displayName: "Demo",
      jurisdiction: { country: "PT" },
      seedKey: "registry:demo-1",
    });
    assert.equal(record.id, a);
  });
});
