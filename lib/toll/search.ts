/**
 * AUROS Search Graph v0 — DNA + Green market retrieval.
 */

import {
  getAssetDnaLocal,
  listAssetDnaLocal,
  type AssetDnaRecord,
} from "@/lib/asset-dna";
import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";
import { matchesGreenMarketSearch } from "@/lib/green/market/search";
import { listProofStreamEvents } from "@/lib/proof-stream";
import { listProvenanceForAsset } from "./provenance";
import { computeRealityReputation } from "./reputation";

export type TollSearchHit = {
  kind: "dna" | "market_actor" | "market_offer";
  id: string;
  title: string;
  subtitle?: string;
  assetDnaId?: string;
  href: string;
};

export type TollSearchResult = {
  query: string;
  total: number;
  hits: TollSearchHit[];
};

function dnaHit(dna: AssetDnaRecord): TollSearchHit {
  return {
    kind: "dna",
    id: dna.id,
    title: dna.displayName,
    subtitle: `${dna.assetClass} · ${dna.jurisdiction.country || "—"}`,
    assetDnaId: dna.id,
    href: `/api/v1/asset-dna/${encodeURIComponent(dna.id)}`,
  };
}

/** Light secondary boost from Reality Reputation (DNA hits only). Max ~0.5 rank units. */
function reputationBoost(hit: TollSearchHit): number {
  const id = hit.assetDnaId ?? (hit.kind === "dna" ? hit.id : undefined);
  if (!id) return 0;
  const dna = getAssetDnaLocal(id);
  if (!dna) return 0;
  const events = listProofStreamEvents(id, 30);
  const provenanceCount = listProvenanceForAsset(id).length;
  const overall = computeRealityReputation({
    dna,
    events,
    provenanceCount,
  }).overall;
  return overall / 200;
}

export async function searchAurosAssets(input: {
  q: string;
  limit?: number;
  /** When true, lightly prefer higher Reality Reputation DNA hits. Default off. */
  boostReputation?: boolean;
}): Promise<TollSearchResult> {
  const q = input.q?.trim() ?? "";
  const limit = Math.min(50, Math.max(1, input.limit ?? 20));
  const hits: TollSearchHit[] = [];
  const nq = q.toLowerCase();

  for (const dna of listAssetDnaLocal()) {
    if (!q) {
      hits.push(dnaHit(dna));
      continue;
    }
    const hay = [
      dna.id,
      dna.displayName,
      dna.assetClass,
      dna.jurisdiction.country,
      dna.origin?.spvName,
      dna.origin?.siteName,
      dna.origin?.operatorName,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (hay.includes(nq)) hits.push(dnaHit(dna));
  }

  try {
    const snap = await getGreenMarketSnapshot();
    for (const actor of snap.actors ?? []) {
      if (
        !q ||
        matchesGreenMarketSearch(q, {
          name: actor.name,
          city: actor.city,
          country: actor.country,
          region: actor.region,
        })
      ) {
        hits.push({
          kind: "market_actor",
          id: actor.id,
          title: actor.name,
          subtitle: [actor.city, actor.country].filter(Boolean).join(", "),
          assetDnaId: actor.assetDnaId,
          href: `/green/market/actor/${encodeURIComponent(actor.id)}`,
        });
      }
    }
    for (const offer of snap.offers ?? []) {
      const title = `${offer.side} ${offer.volumeKwh} kWh · ${offer.actorName}`;
      if (
        !q ||
        title.toLowerCase().includes(nq) ||
        offer.actorName.toLowerCase().includes(nq) ||
        offer.city.toLowerCase().includes(nq)
      ) {
        hits.push({
          kind: "market_offer",
          id: offer.id,
          title,
          subtitle: offer.actorId ? `actor:${offer.actorId}` : undefined,
          href: `/green/market/offer/${encodeURIComponent(offer.id)}`,
        });
      }
    }
  } catch {
    // market snapshot optional
  }

  let ordered = hits;
  if (input.boostReputation) {
    ordered = hits
      .map((h, i) => ({ h, score: -i + reputationBoost(h) }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.h);
  }

  const sliced = ordered.slice(0, limit);
  return { query: q, total: hits.length, hits: sliced };
}
