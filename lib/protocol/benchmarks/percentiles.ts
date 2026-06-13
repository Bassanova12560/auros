export type BenchmarkMetrics = {
  median_apy: number;
  p25_apy: number;
  p75_apy: number;
  product_count: number;
};

function roundApy(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Linear-interpolation percentile on a sorted array (p in 0–100). */
export function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  if (sortedValues.length === 1) return sortedValues[0]!;
  const index = (p / 100) * (sortedValues.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sortedValues[lower]!;
  const weight = index - lower;
  return sortedValues[lower]! * (1 - weight) + sortedValues[upper]! * weight;
}

export function computeBenchmarkMetrics(apys: number[]): BenchmarkMetrics | null {
  const values = apys.filter((v) => Number.isFinite(v) && v > 0);
  if (values.length === 0) return null;

  const sorted = [...values].sort((a, b) => a - b);
  return {
    median_apy: roundApy(percentile(sorted, 50)),
    p25_apy: roundApy(percentile(sorted, 25)),
    p75_apy: roundApy(percentile(sorted, 75)),
    product_count: values.length,
  };
}
