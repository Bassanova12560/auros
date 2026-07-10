import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeH2oScoreForCompareRow,
  computeH2oScoreFromText,
  detectH2oAssetClass,
  parseFlowM3FromText,
} from "@/lib/green/scoring/h2o-score";
import { resolveH2oBatchItem } from "@/lib/green/scoring/h2o-batch";
import { WATER_COMPARE_ROWS } from "@/lib/green/water-compare-data";
import { h2oPreviewId } from "@/lib/eau/passport";

describe("green/h2o-score", () => {
  it("detects water asset classes", () => {
    assert.equal(detectH2oAssetClass("blue bond ocean water"), "blue_bond");
    assert.equal(detectH2oAssetClass("desalination plant California"), "desalination");
    assert.equal(detectH2oAssetClass("droits d'eau Colorado"), "water_rights");
  });

  it("parses m3 flow from text", () => {
    assert.equal(parseFlowM3FromText("2 Mm³/an concession"), 2_000_000);
    assert.equal(parseFlowM3FromText("500000 m3/year"), 500_000);
  });

  it("scores hydrological concession text", () => {
    const result = computeH2oScoreFromText(
      "Concession eau potable 15 ans, 2 Mm³/an, SPV France, audit hydrologique, investisseurs institutionnels, DNSH taxonomie"
    );
    assert.ok(result);
    assert.ok(result!.rating >= 60);
    assert.equal(result!.passport_required, true);
    assert.ok(result!.priority_keys.length <= 3);
    assert.match(result!.passport_unlock_url, /comment-tokeniser\/eau/);
  });

  it("returns null for non-water text", () => {
    assert.equal(computeH2oScoreFromText("Office building Paris SPV"), null);
  });

  it("scores water compare catalog row", () => {
    const row = WATER_COMPARE_ROWS[0]!;
    const result = computeH2oScoreForCompareRow(row);
    assert.ok(result.rating >= 70);
    assert.equal(result.preview_id, `h2o-ref-${row.id}`);
  });

  it("resolves batch by id and text", () => {
    const byId = resolveH2oBatchItem({ id: "pilot-concession-france" });
    assert.equal(byId.ok, true);

    const byText = resolveH2oBatchItem({
      text: "Water rights 500000 m3/year Colorado concession 12 years hydrological audit",
    });
    assert.equal(byText.ok, true);
  });

  it("generates stable preview ids", () => {
    const a = h2oPreviewId("Same text");
    const b = h2oPreviewId("Same text");
    assert.equal(a, b);
    assert.match(a, /^h2o-preview-/);
  });
});

describe("eau/catalog", () => {
  it("exports indexable eau hub page", async () => {
    const { buildEauHubPage } = await import("@/lib/ai-first/catalog/eau-pages");
    const page = buildEauHubPage();
    assert.equal(page.path, "/eau");
    assert.equal(page.indexable, true);
  });
});
