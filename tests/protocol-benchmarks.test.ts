import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeBenchmarkMetrics, percentile } from "../lib/protocol/benchmarks/percentiles";
import { resolveStaticBenchmark, STATIC_BENCHMARKS } from "../lib/protocol/benchmarks/static";
import { benchmarksQuerySchema } from "../lib/protocol/schemas/benchmarks";

describe("protocol/benchmarks percentiles", () => {
  it("computes median and quartiles", () => {
    const values = [4, 5, 6, 7, 8, 9, 10];
    assert.equal(percentile(values, 50), 7);
    assert.equal(percentile(values, 25), 5.5);
    assert.equal(percentile(values, 75), 8.5);
  });

  it("builds benchmark metrics from APY list", () => {
    const metrics = computeBenchmarkMetrics([4.2, 4.5, 4.8, 5.0, 5.2]);
    assert.ok(metrics);
    assert.equal(metrics!.product_count, 5);
    assert.equal(metrics!.median_apy, 4.8);
    assert.equal(metrics!.p25_apy, 4.5);
    assert.equal(metrics!.p75_apy, 5);
  });

  it("ignores zero and non-finite APY values", () => {
    const metrics = computeBenchmarkMetrics([0, 4, 6, Number.NaN]);
    assert.ok(metrics);
    assert.equal(metrics!.product_count, 2);
    assert.equal(metrics!.median_apy, 5);
  });

  it("returns null when no positive yields", () => {
    assert.equal(computeBenchmarkMetrics([0, 0]), null);
    assert.equal(computeBenchmarkMetrics([]), null);
  });
});

describe("protocol/benchmarks static fallback", () => {
  it("covers all benchmark categories globally", () => {
    const categories = ["bonds", "stablecoins", "real_estate", "private_credit", "commodities"] as const;
    for (const category of categories) {
      const row = resolveStaticBenchmark(category);
      assert.equal(row.category, category);
      assert.ok(row.metrics.product_count > 0);
      assert.ok(row.as_of);
    }
  });

  it("resolves jurisdiction-scoped EU bonds benchmark", () => {
    const row = resolveStaticBenchmark("bonds", "EU");
    assert.equal(row.jurisdiction, "EU");
    assert.equal(row.metrics.median_apy, 4.45);
  });

  it("falls back to global when jurisdiction slice missing", () => {
    const row = resolveStaticBenchmark("bonds", "Singapore");
    assert.equal(row.jurisdiction, undefined);
    assert.equal(row.category, "bonds");
  });

  it("has unique global entries per category", () => {
    const globals = STATIC_BENCHMARKS.filter((row) => !row.jurisdiction);
    const categories = globals.map((row) => row.category);
    assert.equal(new Set(categories).size, categories.length);
  });
});

describe("protocol/benchmarks schema", () => {
  it("requires category enum", () => {
    const parsed = benchmarksQuerySchema.safeParse({ category: "bonds", jurisdiction: "EU" });
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.category, "bonds");
      assert.equal(parsed.data.jurisdiction, "EU");
    }
  });

  it("rejects missing category", () => {
    assert.equal(benchmarksQuerySchema.safeParse({}).success, false);
  });

  it("rejects invalid category", () => {
    assert.equal(benchmarksQuerySchema.safeParse({ category: "funds" }).success, false);
  });
});
