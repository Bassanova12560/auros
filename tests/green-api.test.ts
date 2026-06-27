import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  batchMaxItemsForTier,
  bulkMaxIdsForTier,
  buildGreenApiOpenApiSpec,
  buildGreenIndexChangelog,
  listGreenScoreCatalogIds,
  lookupGreenScoreById,
  lookupGreenScoresByIds,
  GREEN_ANON_BULK_MAX_IDS,
  GREEN_FREE_BATCH_MAX_ITEMS,
  GREEN_FREE_BULK_MAX_IDS,
  GREEN_PREMIUM_BATCH_MAX_ITEMS,
} from "@/lib/green/api";
import { FREE_TIER_MONTHLY_LIMIT } from "@/lib/protocol/constants";

describe("green/api", () => {
  it("lookupGreenScoreById returns unified score for known id", () => {
    const score = lookupGreenScoreById("toucan");
    assert.ok(score);
    assert.equal(score!.id, "toucan");
    assert.ok(score!.composite_score >= 0 && score!.composite_score <= 100);
    assert.ok(score!.carbon_quality);
    assert.ok(score!.urls.score.includes("/api/green/score/toucan"));
    assert.ok(score!.urls.embed.includes("/embed/green-score"));
  });

  it("lookupGreenScoreById returns null for unknown id", () => {
    assert.equal(lookupGreenScoreById("not-a-real-id"), null);
  });

  it("lookupGreenScoresByIds splits found and missing", () => {
    const { found, missing } = lookupGreenScoresByIds(["toucan", "fake-id", "moss"]);
    assert.equal(found.length, 2);
    assert.deepEqual(missing, ["fake-id"]);
  });

  it("listGreenScoreCatalogIds matches compare catalog", () => {
    const ids = listGreenScoreCatalogIds();
    assert.ok(ids.length >= 5);
    assert.ok(ids.includes("toucan"));
  });

  it("tier limits for batch and bulk", () => {
    assert.equal(batchMaxItemsForTier("free"), GREEN_FREE_BATCH_MAX_ITEMS);
    assert.equal(batchMaxItemsForTier("premium"), GREEN_PREMIUM_BATCH_MAX_ITEMS);
    assert.equal(bulkMaxIdsForTier("anonymous"), GREEN_ANON_BULK_MAX_IDS);
    assert.equal(bulkMaxIdsForTier("free"), GREEN_FREE_BULK_MAX_IDS);
  });

  it("buildGreenIndexChangelog returns movers", () => {
    const log = buildGreenIndexChangelog();
    assert.ok(log.edition);
    assert.ok(log.reference_count >= 1);
    assert.ok(Array.isArray(log.top_movers));
  });

  it("OpenAPI spec documents main paths", () => {
    const spec = buildGreenApiOpenApiSpec();
    assert.equal(spec.openapi, "3.0.3");
    assert.ok(spec.paths["/api/green/score/{id}"]);
    assert.ok(spec.paths["/api/v1/keys"]);
    assert.ok(spec.info.description.includes("1000"));
  });

  it("free tier monthly limit is 1000", () => {
    assert.equal(FREE_TIER_MONTHLY_LIMIT, 1000);
  });
});
