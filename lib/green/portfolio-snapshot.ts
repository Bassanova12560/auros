/**
 * Portfolio Console v1 — institutional snapshot of DNA-linked Green assets.
 * Server-only: do not import from lib/green/index (client barrel).
 */

import {
  listAssetDnaFromSupabase,
  listAssetDnaLocal,
  type AssetDnaRecord,
} from "@/lib/asset-dna";
import { getGreenRegistrySnapshot } from "@/lib/green/green-registry";
import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import type {
  GreenPortfolioSnapshot,
  PortfolioAssetRow,
} from "@/lib/green/portfolio-types";

export type { GreenPortfolioSnapshot, PortfolioAssetRow } from "@/lib/green/portfolio-types";

function mergeDnaRecords(
  local: AssetDnaRecord[],
  remote: AssetDnaRecord[]
): AssetDnaRecord[] {
  const byId = new Map<string, AssetDnaRecord>();
  for (const r of [...remote, ...local]) byId.set(r.id, r);
  return [...byId.values()].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt)
  );
}

export async function getGreenPortfolioSnapshot(
  limit = 50
): Promise<GreenPortfolioSnapshot> {
  const [registry, market, localDna, remoteDna] = await Promise.all([
    getGreenRegistrySnapshot(),
    getGreenMarketSnapshot(),
    Promise.resolve(listAssetDnaLocal(300)),
    listAssetDnaFromSupabase(300),
  ]);

  const dnaById = mergeDnaRecords(localDna, remoteDna);
  const dnaMap = new Map(dnaById.map((d) => [d.id, d]));

  for (const p of registry.projects) {
    if (!p.assetDnaId) continue;
    if (!dnaMap.has(p.assetDnaId)) {
      dnaMap.set(p.assetDnaId, {
        id: p.assetDnaId,
        specVersion: "1.0.0",
        assetClass: p.projectType === "water" ? "water_rights" : "green_energy",
        displayName: p.name,
        jurisdiction: { country: p.country },
        origin: {},
        documents: [],
        compliance: { labelTier: p.labelTier },
        links: { registryProjectId: p.id },
        createdAt: p.certifiedAt,
        updatedAt: p.certifiedAt,
      });
    }
  }
  for (const a of market.actors) {
    if (!a.assetDnaId) continue;
    if (!dnaMap.has(a.assetDnaId)) {
      dnaMap.set(a.assetDnaId, {
        id: a.assetDnaId,
        specVersion: "1.0.0",
        assetClass: "green_energy",
        displayName: a.name,
        jurisdiction: { country: a.country },
        origin: {},
        documents: [],
        compliance: { listingTier: a.listingTier },
        links: { marketActorId: a.id },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  const registryByDna = new Map(
    registry.projects
      .filter((p) => p.assetDnaId)
      .map((p) => [p.assetDnaId!, p] as const)
  );
  const marketByDna = new Map(
    market.actors
      .filter((a) => a.assetDnaId)
      .map((a) => [a.assetDnaId!, a] as const)
  );

  const ids = [...dnaMap.keys()].slice(0, Math.min(limit, 100));
  const assets: PortfolioAssetRow[] = [];
  const byLastAction: Record<string, number> = {};
  let withRecentEvents = 0;
  const bySource = { registry: 0, market: 0, dnaOnly: 0 };

  for (const id of ids) {
    const dna = dnaMap.get(id)!;
    const events = await listProofStreamEventsAsync(id, 5);
    const last = events[0];
    if (last) {
      withRecentEvents += 1;
      byLastAction[last.action] = (byLastAction[last.action] ?? 0) + 1;
    }

    const reg = registryByDna.get(id);
    const mkt = marketByDna.get(id);
    let source: PortfolioAssetRow["source"] = "dna_only";
    let sourceId: string | undefined;
    if (reg) {
      source = "registry";
      sourceId = reg.id;
      bySource.registry += 1;
    } else if (mkt) {
      source = "market";
      sourceId = mkt.id;
      bySource.market += 1;
    } else {
      bySource.dnaOnly += 1;
    }

    assets.push({
      assetDnaId: id,
      displayName: dna.displayName,
      assetClass: dna.assetClass,
      country: dna.jurisdiction.country || reg?.country || mkt?.country || "—",
      source,
      sourceId,
      labelTier: reg?.labelTier ?? dna.compliance.labelTier,
      listingTier: mkt?.listingTier ?? dna.compliance.listingTier,
      lastAction: last?.action,
      lastEventAt: last?.createdAt,
      eventCount: events.length,
      recentEvents: events,
    });
  }

  return {
    generatedAt: new Date().toISOString(),
    totalDna: dnaMap.size,
    withRecentEvents,
    bySource,
    byLastAction,
    assets,
  };
}
