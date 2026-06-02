import { formatTvl } from "./defillama";
import type { ComparatorProductRow } from "./types";

export type ComparatorSummary = {
  bestApy: ComparatorProductRow | null;
  totalTvlUsd: number;
  productCount: number;
  platformCount: number;
};

export function computeComparatorSummary(
  rows: ComparatorProductRow[]
): ComparatorSummary {
  if (rows.length === 0) {
    return {
      bestApy: null,
      totalTvlUsd: 0,
      productCount: 0,
      platformCount: 0,
    };
  }

  const bestApy = rows.reduce((best, row) => (row.apy > best.apy ? row : best), rows[0]);
  const totalTvlUsd = rows.reduce((sum, row) => sum + row.tvlUsd, 0);
  const platformCount = new Set(rows.map((r) => r.platform)).size;

  return {
    bestApy,
    totalTvlUsd,
    productCount: rows.length,
    platformCount,
  };
}

export function formatSummaryTvl(usd: number): string {
  if (usd <= 0) return "—";
  return formatTvl(usd);
}
