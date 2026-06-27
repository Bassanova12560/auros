import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import { enrichGreenCompareRows } from "@/lib/green/compare-enriched";
import {
  computeCarbonQualityForCompareRow,
  computeCarbonQualityFromProfile,
} from "@/lib/green/scoring/carbon-quality";
import { GREEN_CARBON_PROFILES } from "@/lib/green/scoring/carbon-profiles";
import { computeGreenCompositeScore } from "@/lib/green/scoring/composite-score";
import {
  computeWattScoreForCompareRow,
  computeWattScoreFromInputs,
} from "@/lib/green/scoring/watt-score";
import { buildGreenIndexPayload, getEditionIso } from "@/lib/green-index/compute";
import { greenIndexToCsv } from "@/lib/green-index/csv";
import { GREEN_INDEX_TOP_N } from "@/lib/green-index/types";

describe("green/carbon-quality-score", () => {
  it("scores carbon rows between 0 and 100", () => {
    const carbonRows = GREEN_COMPARE_ROWS.filter((r) => r.type === "carbon");
    assert.ok(carbonRows.length >= 2);
    for (const row of carbonRows) {
      const result = computeCarbonQualityForCompareRow(row);
      assert.ok(result);
      assert.ok(result!.score >= 0 && result!.score <= 100);
      assert.ok(result!.priority_keys.length <= 3);
    }
  });

  it("returns null for non-carbon assets", () => {
    const solar = GREEN_COMPARE_ROWS.find((r) => r.type === "solar");
    assert.ok(solar);
    assert.equal(computeCarbonQualityForCompareRow(solar!), null);
  });

  it("ranks gold standard + CCP above unknown registry", () => {
    const premium = computeCarbonQualityFromProfile({
      registry: "gold_standard",
      ccp_aligned: true,
      additionality: "strong",
      permanence: "strong",
      vintage_risk: "low",
      on_chain_wrapper: false,
    });
    const weak = computeCarbonQualityFromProfile({
      registry: "unknown",
      ccp_aligned: "unknown",
      additionality: "unknown",
      permanence: "unknown",
      vintage_risk: "high",
      on_chain_wrapper: true,
    });
    assert.ok(premium.score > weak.score);
    assert.equal(premium.tier, "premium");
  });

  it("uses static profiles for known compare ids", () => {
    assert.ok(GREEN_CARBON_PROFILES.toucan);
    const toucan = computeCarbonQualityForCompareRow(
      GREEN_COMPARE_ROWS.find((r) => r.id === "toucan")!
    );
    assert.ok(toucan);
    assert.ok(toucan!.score > 0);
  });
});

describe("green/watt-score", () => {
  it("computes lifetime energy from solar inputs", () => {
    const { lifetime_gwh, energy_value_eur } = computeWattScoreFromInputs({
      capacity_mw: 10,
      sun_hours_per_year: 1800,
      life_years: 20,
      energy_price_eur_per_kwh: 0.15,
    });
    assert.equal(lifetime_gwh, 360);
    assert.equal(energy_value_eur, 54_000_000);
  });

  it("scores energy rows but not carbon", () => {
    const solar = GREEN_COMPARE_ROWS.find((r) => r.type === "solar");
    const carbon = GREEN_COMPARE_ROWS.find((r) => r.type === "carbon");
    assert.ok(solar && carbon);
    const solarWatt = computeWattScoreForCompareRow(solar!);
    const carbonWatt = computeWattScoreForCompareRow(carbon!);
    assert.ok(solarWatt);
    assert.equal(carbonWatt, null);
    assert.ok(solarWatt!.rating >= 0 && solarWatt!.rating <= 100);
  });
});

describe("green/composite-and-index", () => {
  it("builds composite from taxonomy cqs and watt weights", () => {
    const row = GREEN_COMPARE_ROWS.find((r) => r.id === "toucan")!;
    const composite = computeGreenCompositeScore(row);
    assert.ok(composite.composite >= 0 && composite.composite <= 100);
    assert.ok(composite.carbon_quality != null);
  });

  it("enriches compare rows with composite score", () => {
    const enriched = enrichGreenCompareRows(GREEN_COMPARE_ROWS);
    assert.equal(enriched.length, GREEN_COMPARE_ROWS.length);
    for (const row of enriched) {
      assert.ok(row.composite_score >= 0);
    }
    const sorted = [...enriched].sort((a, b) => b.composite_score - a.composite_score);
    assert.ok(sorted[0]!.composite_score >= sorted.at(-1)!.composite_score);
  });

  it("builds green index payload with top N entries", () => {
    const payload = buildGreenIndexPayload({
      editionIso: "2026-06-01",
      generatedAt: "2026-06-27T12:00:00.000Z",
      registryVerifiedCount: 3,
    });
    assert.equal(payload.editionIso, "2026-06-01");
    assert.equal(payload.entries.length, Math.min(GREEN_INDEX_TOP_N, GREEN_COMPARE_ROWS.length));
    assert.ok(payload.segments.length >= 1);
    assert.equal(payload.entries[0]!.rank, 1);
  });

  it("getEditionIso returns first day of month", () => {
    assert.equal(getEditionIso(new Date("2026-06-15T10:00:00Z")), "2026-06-01");
  });

  it("exports CSV with CQS and Watt columns", () => {
    const payload = buildGreenIndexPayload({ editionIso: "2026-06-01" });
    const csv = greenIndexToCsv(payload, {
      rank: "rank",
      name: "name",
      type: "type",
      composite: "composite",
      taxonomy: "taxonomy",
      cqs: "cqs",
      watt: "watt",
      mom: "mom",
      source: "source",
    });
    assert.match(csv, /^rank,name,type/);
    assert.match(csv, /composite/);
    assert.ok(csv.split("\n").length >= payload.entries.length);
  });
});
