import type { GreenCompareRow } from "./compare-data";
import { computeCarbonQualityForCompareRow } from "./scoring/carbon-quality";
import { computeGreenCompositeScore } from "./scoring/composite-score";
import { computeWattScoreForCompareRow } from "./scoring/watt-score";

export type EnrichedGreenCompareRow = GreenCompareRow & {
  carbon_quality_score: number | null;
  carbon_quality_tier: string | null;
  watt_score: number | null;
  watt_lifetime_gwh: number | null;
  composite_score: number;
};

export function enrichGreenCompareRow(row: GreenCompareRow): EnrichedGreenCompareRow {
  const cqs = computeCarbonQualityForCompareRow(row);
  const watt = computeWattScoreForCompareRow(row);
  const composite = computeGreenCompositeScore(row);

  return {
    ...row,
    carbon_quality_score: cqs?.score ?? null,
    carbon_quality_tier: cqs?.tier ?? null,
    watt_score: watt?.rating ?? null,
    watt_lifetime_gwh: watt?.lifetime_gwh ?? null,
    composite_score: composite.composite,
  };
}

export function enrichGreenCompareRows(
  rows: GreenCompareRow[]
): EnrichedGreenCompareRow[] {
  return rows.map(enrichGreenCompareRow);
}
