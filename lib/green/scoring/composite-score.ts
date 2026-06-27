import type { GreenCompareRow } from "../compare-data";

import { computeCarbonQualityForCompareRow } from "./carbon-quality";
import { computeWattScoreForCompareRow } from "./watt-score";

export type GreenCompositeScore = {
  composite: number;
  taxonomy: number | null;
  carbon_quality: number | null;
  watt: number | null;
};

/** Weighted AUROS Green composite for index ranking (indicative). */
export function computeGreenCompositeScore(row: GreenCompareRow): GreenCompositeScore {
  const taxonomy = row.green_taxonomy_score;
  const cqs = computeCarbonQualityForCompareRow(row)?.score ?? null;
  const watt = computeWattScoreForCompareRow(row)?.rating ?? null;

  const parts: { value: number; weight: number }[] = [];
  if (taxonomy != null) parts.push({ value: taxonomy, weight: 0.35 });
  if (cqs != null) parts.push({ value: cqs, weight: 0.35 });
  if (watt != null) parts.push({ value: watt, weight: 0.3 });

  if (parts.length === 0) {
    return { composite: 0, taxonomy, carbon_quality: cqs, watt };
  }

  const totalWeight = parts.reduce((s, p) => s + p.weight, 0);
  const composite = Math.round(
    parts.reduce((s, p) => s + p.value * (p.weight / totalWeight), 0)
  );

  return { composite, taxonomy, carbon_quality: cqs, watt };
}

export function sortByCompositeScore(rows: GreenCompareRow[]): GreenCompareRow[] {
  return [...rows].sort(
    (a, b) => computeGreenCompositeScore(b).composite - computeGreenCompositeScore(a).composite
  );
}
