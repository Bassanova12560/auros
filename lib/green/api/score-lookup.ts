import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_COMPARE_ROWS, type GreenCompareRow } from "@/lib/green/compare-data";
import { enrichGreenCompareRow } from "@/lib/green/compare-enriched";
import { buildGreenIndexPayload } from "@/lib/green-index/compute";
import { computeCarbonQualityForCompareRow } from "@/lib/green/scoring/carbon-quality";
import type { CarbonQualityScore } from "@/lib/green/scoring/carbon-quality";
import { computeGreenCompositeScore } from "@/lib/green/scoring/composite-score";
import { computeWattScoreForCompareRow } from "@/lib/green/scoring/watt-score";
import type { WattScoreResult } from "@/lib/green/scoring/watt-score";

export type GreenScoreLookup = {
  id: string;
  name: string;
  type: string;
  composite_score: number;
  taxonomy_score: number | null;
  carbon_quality: CarbonQualityScore | null;
  watt: WattScoreResult | null;
  green_index_rank: number | null;
  label_status: string;
  source_url: string;
  urls: {
    score: string;
    cqs: string;
    compare: string;
    embed: string;
  };
};

function urlsForId(id: string): GreenScoreLookup["urls"] {
  const base = absoluteUrl("");
  return {
    score: `${base}/api/green/score/${id}`,
    cqs: `${base}/api/green/carbon-quality/${id}`,
    compare: `${base}/green/compare`,
    embed: `${base}/embed/green-score?id=${id}`,
  };
}

function rankFromIndex(id: string): number | null {
  const payload = buildGreenIndexPayload();
  const hit = payload.entries.find((e) => e.id === id);
  return hit?.rank ?? null;
}

export function lookupGreenScoreById(id: string): GreenScoreLookup | null {
  const row = GREEN_COMPARE_ROWS.find((r) => r.id === id);
  if (!row) return null;
  return lookupGreenScoreFromRow(row);
}

export function lookupGreenScoreFromRow(row: GreenCompareRow): GreenScoreLookup {
  const enriched = enrichGreenCompareRow(row);
  const composite = computeGreenCompositeScore(row);

  return {
    id: row.id,
    name: row.name,
    type: row.type,
    composite_score: composite.composite,
    taxonomy_score: row.green_taxonomy_score,
    carbon_quality: computeCarbonQualityForCompareRow(row),
    watt: computeWattScoreForCompareRow(row),
    green_index_rank: rankFromIndex(row.id),
    label_status: row.labelStatus,
    source_url: row.sourceUrl,
    urls: urlsForId(row.id),
  };
}

export function lookupGreenScoresByIds(ids: string[]): {
  found: GreenScoreLookup[];
  missing: string[];
} {
  const found: GreenScoreLookup[] = [];
  const missing: string[] = [];
  for (const id of ids) {
    const score = lookupGreenScoreById(id);
    if (score) found.push(score);
    else missing.push(id);
  }
  return { found, missing };
}

export function listGreenScoreCatalogIds(): string[] {
  return GREEN_COMPARE_ROWS.map((r) => r.id);
}
