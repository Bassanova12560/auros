import { GREEN_COMPARE_ROWS } from "../compare-data";
import { computeGreenCompositeScore } from "./composite-score";

export type ScoreBenchmark = {
  /** Percentile 0–100 — higher = better vs catalog. */
  percentile: number;
  catalog_size: number;
  metric: "composite_score";
  label: string;
};

function compositeScoresById(): Map<string, number> {
  const map = new Map<string, number>();
  for (const row of GREEN_COMPARE_ROWS) {
    map.set(row.id, computeGreenCompositeScore(row).composite);
  }
  return map;
}

/** How this asset ranks vs the full Green compare catalog (composite score). */
export function computeScoreBenchmark(id: string, score: number): ScoreBenchmark {
  const all = [...compositeScoresById().values()];
  const catalog_size = all.length;
  const below = all.filter((s) => s < score).length;
  const percentile =
    catalog_size <= 1 ? 100 : Math.round((below / (catalog_size - 1)) * 100);

  return {
    percentile,
    catalog_size,
    metric: "composite_score",
    label: `Top ${100 - percentile}% of AUROS Green catalog`,
  };
}
