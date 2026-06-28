import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildDppBridgeDocument } from "@/lib/green/dpp-bridge";
import { buildGreenScoreHistory, buildGreenScoreHistoryPayload } from "@/lib/green/scoring/green-score-history";
import { buildNatureIndexPayload, NATURE_INDEX_ROUTE } from "@/lib/green/nature-index";

describe("green/score-history", () => {
  it("builds 12 months for moss", () => {
    const history = buildGreenScoreHistory("moss");
    assert.equal(history.length, 12);
    assert.ok(history[0]!.composite_score >= 0);
  });

  it("payload includes current edition and trend", () => {
    const payload = buildGreenScoreHistoryPayload("moss");
    assert.ok(payload);
    assert.equal(payload!.id, "moss");
    assert.ok(payload!.trend);
    assert.equal(payload!.trend!.months, 12);
  });
});

describe("green/nature-index/csv", () => {
  it("exports CSV rows", async () => {
    const { natureIndexToCsv } = await import("@/lib/green/nature-index");
    const payload = buildNatureIndexPayload();
    const csv = natureIndexToCsv(payload);
    assert.ok(csv.includes("rank,name"));
    assert.ok(csv.includes("moss") || csv.includes("Moss"));
  });
});

describe("green/dpp-bridge", () => {
  it("exports JSON-LD for toucan", () => {
    const doc = buildDppBridgeDocument("toucan");
    assert.ok(doc);
    assert.equal(doc!["@type"]?.includes("Product"), true);
    assert.ok(doc!.sustainabilityInformation.aurosGreenComposite >= 0);
  });
});

describe("green/nature-index", () => {
  it("builds ranked nature entries", () => {
    const payload = buildNatureIndexPayload();
    assert.equal(NATURE_INDEX_ROUTE, "/data/nature-score");
    assert.ok(payload.entries.length >= 2);
    assert.equal(payload.entries[0]!.rank, 1);
    assert.ok(payload.entries[0]!.nature_score >= payload.entries[1]!.nature_score);
  });
});

describe("green/widget", () => {
  it("green-score.js exists in public", async () => {
    const { readFileSync, existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    const p = join(process.cwd(), "public", "green-score.js");
    assert.equal(existsSync(p), true);
    const src = readFileSync(p, "utf8");
    assert.ok(src.includes("AurosGreenScore"));
    assert.ok(src.includes("data-theme"));
  });
});
