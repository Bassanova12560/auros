import type { GreenCompareRow } from "./compare-data";

/** Table / CSV display — numeric score or em dash when unknown. */
export function formatGreenTaxonomyScoreDisplay(score: number | null): string {
  return score != null ? String(score) : "—";
}

/** PDF export — score with /100 suffix or em dash when unknown. */
export function formatGreenTaxonomyScorePdf(score: number | null): string {
  return score != null ? `${score}/100` : "—";
}

/** Descending sort: higher taxonomy scores first; null scores last. */
export function compareGreenTaxonomyScore(a: GreenCompareRow, b: GreenCompareRow): number {
  const aScore = a.green_taxonomy_score;
  const bScore = b.green_taxonomy_score;
  if (aScore == null && bScore == null) return 0;
  if (aScore == null) return 1;
  if (bScore == null) return -1;
  return bScore - aScore;
}

export function sortGreenCompareRowsByTaxonomy(rows: readonly GreenCompareRow[]): GreenCompareRow[] {
  return [...rows].sort(compareGreenTaxonomyScore);
}
