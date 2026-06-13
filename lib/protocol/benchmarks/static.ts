import type { BenchmarkCategory } from "../schemas/benchmarks";
import type { BenchmarkMetrics } from "./percentiles";

export const MIN_LIVE_YIELD_PRODUCTS = 3;

export type StaticBenchmarkRecord = {
  category: BenchmarkCategory;
  jurisdiction?: string;
  metrics: BenchmarkMetrics;
  as_of: string;
  label: string;
};

/** Curated sector benchmarks — used when live compare hub data is sparse for the slice. */
export const STATIC_BENCHMARKS: StaticBenchmarkRecord[] = [
  {
    category: "bonds",
    metrics: { median_apy: 4.5, p25_apy: 4.25, p75_apy: 4.75, product_count: 14 },
    as_of: "2026-06-30",
    label: "Tokenized bonds — global hub median (Q2 2026)",
  },
  {
    category: "bonds",
    jurisdiction: "EU",
    metrics: { median_apy: 4.45, p25_apy: 4.2, p75_apy: 4.7, product_count: 9 },
    as_of: "2026-06-30",
    label: "Tokenized bonds EU — curated static benchmark Q2 2026",
  },
  {
    category: "bonds",
    jurisdiction: "CH",
    metrics: { median_apy: 4.55, p25_apy: 4.35, p75_apy: 4.8, product_count: 5 },
    as_of: "2026-06-30",
    label: "Tokenized bonds Switzerland — curated static benchmark Q2 2026",
  },
  {
    category: "stablecoins",
    metrics: { median_apy: 4.6, p25_apy: 4.3, p75_apy: 4.9, product_count: 18 },
    as_of: "2026-06-30",
    label: "Yield stablecoins — global hub median (Q2 2026)",
  },
  {
    category: "stablecoins",
    jurisdiction: "EU",
    metrics: { median_apy: 4.5, p25_apy: 4.25, p75_apy: 4.75, product_count: 11 },
    as_of: "2026-06-30",
    label: "Yield stablecoins EU — curated static benchmark Q2 2026",
  },
  {
    category: "real_estate",
    metrics: { median_apy: 8.2, p25_apy: 6.8, p75_apy: 9.5, product_count: 22 },
    as_of: "2026-06-30",
    label: "Tokenized real estate — global hub median (Q2 2026)",
  },
  {
    category: "real_estate",
    jurisdiction: "US",
    metrics: { median_apy: 8.5, p25_apy: 7.0, p75_apy: 10.0, product_count: 15 },
    as_of: "2026-06-30",
    label: "Tokenized real estate US — curated static benchmark Q2 2026",
  },
  {
    category: "private_credit",
    metrics: { median_apy: 8.8, p25_apy: 6.2, p75_apy: 11.5, product_count: 16 },
    as_of: "2026-06-30",
    label: "Private credit tokenized — global hub median (Q2 2026)",
  },
  {
    category: "private_credit",
    jurisdiction: "EU",
    metrics: { median_apy: 7.9, p25_apy: 5.8, p75_apy: 10.2, product_count: 7 },
    as_of: "2026-06-30",
    label: "Private credit EU — curated static benchmark Q2 2026",
  },
  {
    category: "commodities",
    metrics: { median_apy: 0.8, p25_apy: 0, p75_apy: 1.5, product_count: 10 },
    as_of: "2026-06-30",
    label: "Tokenized commodities — illustrative yield exposure Q2 2026",
  },
];

function normalizeJurisdiction(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  return value.trim();
}

function jurisdictionMatches(recordJurisdiction: string | undefined, query: string): boolean {
  if (!recordJurisdiction) return false;
  return recordJurisdiction.toLowerCase().includes(query.toLowerCase());
}

export function resolveStaticBenchmark(
  category: BenchmarkCategory,
  jurisdiction?: string
): StaticBenchmarkRecord {
  const j = normalizeJurisdiction(jurisdiction);
  if (j) {
    const scoped = STATIC_BENCHMARKS.find(
      (row) => row.category === category && jurisdictionMatches(row.jurisdiction, j)
    );
    if (scoped) return scoped;
  }

  const global = STATIC_BENCHMARKS.find(
    (row) => row.category === category && !row.jurisdiction
  );
  if (!global) {
    throw new Error(`No static benchmark for category: ${category}`);
  }
  return global;
}
