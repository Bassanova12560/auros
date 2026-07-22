/**
 * AUROS Resolve — universal asset lookup + unknown-risk classification.
 */

import {
  isValidAssetDnaId,
  listAssetDnaLocal,
  resolveAssetDna,
  type AssetDnaRecord,
} from "@/lib/asset-dna";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import { computeAurosTrustScore, type AurosTrustScore } from "./trust-score";

export type ResolveQuery = {
  /** DNA id, display name, SPV, site, or free-text alias */
  q: string;
};

export type ResolveResult =
  | {
      resolved: true;
      risk: "resolved";
      dna: AssetDnaRecord;
      trust: AurosTrustScore;
      links: { dna: string; stream: string; trail: string };
    }
  | {
      resolved: false;
      risk: "unknown_asset" | "ambiguous";
      query: string;
      candidates?: Array<{ id: string; displayName: string; score: number }>;
      recommendation: string;
      trust: AurosTrustScore;
    };

function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function scoreMatch(q: string, dna: AssetDnaRecord): number {
  const nq = normalize(q);
  if (!nq) return 0;
  if (normalize(dna.id) === nq) return 100;
  if (normalize(dna.displayName) === nq) return 95;
  const fields = [
    dna.displayName,
    dna.origin?.spvName,
    dna.origin?.siteName,
    dna.origin?.operatorName,
    dna.links?.marketActorId,
    dna.links?.registryProjectId,
  ]
    .filter(Boolean)
    .map((x) => normalize(String(x)));
  let best = 0;
  for (const f of fields) {
    if (f === nq) best = Math.max(best, 90);
    else if (f.includes(nq) || nq.includes(f)) best = Math.max(best, 70);
  }
  return best;
}

export async function resolveAurosAsset(
  query: ResolveQuery
): Promise<ResolveResult> {
  const q = query.q?.trim() ?? "";
  if (!q) {
    return {
      resolved: false,
      risk: "unknown_asset",
      query: q,
      recommendation: "Provide DNA id, SPV name, site, or contract alias.",
      trust: computeAurosTrustScore({ dna: null }),
    };
  }

  if (isValidAssetDnaId(q)) {
    const dna = await resolveAssetDna(q);
    if (dna) {
      const events = await listProofStreamEventsAsync(dna.id, 50);
      const trust = computeAurosTrustScore({ dna, events });
      return {
        resolved: true,
        risk: "resolved",
        dna,
        trust,
        links: {
          dna: `/api/v1/asset-dna/${encodeURIComponent(dna.id)}`,
          stream: `/api/v1/asset-dna/${encodeURIComponent(dna.id)}/stream`,
          trail: `/api/v1/toll/trail`,
        },
      };
    }
  }

  const local = listAssetDnaLocal();
  const ranked = local
    .map((dna) => ({ dna, score: scoreMatch(q, dna) }))
    .filter((r) => r.score >= 70)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  if (ranked.length === 1 && ranked[0].score >= 90) {
    const dna = ranked[0].dna;
    const events = await listProofStreamEventsAsync(dna.id, 50);
    const trust = computeAurosTrustScore({ dna, events });
    return {
      resolved: true,
      risk: "resolved",
      dna,
      trust,
      links: {
        dna: `/api/v1/asset-dna/${encodeURIComponent(dna.id)}`,
        stream: `/api/v1/asset-dna/${encodeURIComponent(dna.id)}/stream`,
        trail: `/api/v1/toll/trail`,
      },
    };
  }

  if (ranked.length > 1) {
    return {
      resolved: false,
      risk: "ambiguous",
      query: q,
      candidates: ranked.map((r) => ({
        id: r.dna.id,
        displayName: r.dna.displayName,
        score: r.score,
      })),
      recommendation:
        "Multiple matches — pass exact Asset DNA id before institutional use.",
      trust: computeAurosTrustScore({ dna: null }),
    };
  }

  if (ranked.length === 1) {
    return {
      resolved: false,
      risk: "ambiguous",
      query: q,
      candidates: [
        {
          id: ranked[0].dna.id,
          displayName: ranked[0].dna.displayName,
          score: ranked[0].score,
        },
      ],
      recommendation: "Weak match only — confirm DNA id.",
      trust: computeAurosTrustScore({ dna: null }),
    };
  }

  return {
    resolved: false,
    risk: "unknown_asset",
    query: q,
    recommendation:
      "Not AUROS-resolved — classify as elevated / incomplete risk until enrolled.",
    trust: computeAurosTrustScore({ dna: null }),
  };
}
