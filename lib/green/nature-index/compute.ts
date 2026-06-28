import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import { getEditionIso } from "@/lib/green-index/compute";
import { computeNatureScoreForCompareRow } from "@/lib/green/scoring/nature-score";
import { computeCarbonQualityForCompareRow } from "@/lib/green/scoring/carbon-quality";
import { GREEN_NATURE_PROFILES } from "@/lib/green/scoring/nature-profiles";

import { NATURE_INDEX_TOP_N, type NatureIndexEntry, type NatureIndexPayload } from "./types";

export { NATURE_INDEX_ROUTE, NATURE_INDEX_TOP_N } from "./types";
export type { NatureIndexEntry, NatureIndexPayload } from "./types";

function countryHint(id: string): string | null {
  const profile = GREEN_NATURE_PROFILES[id];
  if (!profile) return null;
  const catalog = {
    moss: "Peru",
    "regen-network": "Global",
    "VCS-674": "Peru",
  } as Record<string, string>;
  return catalog[id] ?? null;
}

export function buildNatureIndexPayload(): NatureIndexPayload {
  const candidates: Omit<NatureIndexEntry, "rank">[] = [];

  for (const row of GREEN_COMPARE_ROWS) {
    const nature = computeNatureScoreForCompareRow(row);
    if (!nature) continue;
    const cqs = computeCarbonQualityForCompareRow(row);
    candidates.push({
      id: row.id,
      name: row.name,
      type: row.type,
      nature_score: nature.score,
      nature_tier: nature.tier,
      ecosystem: nature.ecosystem,
      cqs: cqs?.score ?? null,
      country_hint: countryHint(row.id),
    });
  }

  const sorted = [...candidates].sort((a, b) => b.nature_score - a.nature_score);
  const entries: NatureIndexEntry[] = sorted
    .slice(0, NATURE_INDEX_TOP_N)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  return {
    editionIso: getEditionIso(),
    generatedAt: new Date().toISOString(),
    referenceCount: candidates.length,
    methodologyNote:
      "TNFD LEAP-inspired Nature Score — indicative biodiversity & nature-based carbon signals.",
    entries,
  };
}

export async function getNatureIndexPayload(): Promise<NatureIndexPayload> {
  return buildNatureIndexPayload();
}
