import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  COMPARE_MAX_PRODUCTS,
  COMPARE_MIN_PRODUCTS,
  compareRequestSchema,
} from "../lib/protocol/schemas/compare";

describe("protocol/compare schema", () => {
  it("accepts product_ids with 2–4 unique IDs", () => {
    const parsed = compareRequestSchema.safeParse({
      product_ids: ["maple-usdc", "realt-portfolio"],
    });
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.deepEqual(parsed.data.product_ids, ["maple-usdc", "realt-portfolio"]);
    }
  });

  it("rejects product_ids with fewer than 2 IDs", () => {
    const parsed = compareRequestSchema.safeParse({
      product_ids: ["only-one"],
    });
    assert.equal(parsed.success, false);
  });

  it("rejects product_ids with more than 4 IDs", () => {
    const parsed = compareRequestSchema.safeParse({
      product_ids: ["a", "b", "c", "d", "e"],
    });
    assert.equal(parsed.success, false);
  });

  it("accepts filter criteria with limit between 2 and 4", () => {
    const parsed = compareRequestSchema.safeParse({
      category: "bonds",
      yield_min: 4,
      risk_tier: "core",
      jurisdiction: "EU",
      limit: 3,
    });
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.limit, 3);
      assert.equal(parsed.data.category, "bonds");
      assert.equal(parsed.data.risk_tier, "core");
    }
  });

  it("rejects limit below 2 or above 4", () => {
    assert.equal(compareRequestSchema.safeParse({ limit: 1 }).success, false);
    assert.equal(compareRequestSchema.safeParse({ limit: 5 }).success, false);
  });

  it("defaults filter mode to category=all and limit=4", () => {
    const parsed = compareRequestSchema.safeParse({});
    assert.equal(parsed.success, true);
    if (parsed.success) {
      assert.equal(parsed.data.category, "all");
      assert.equal(parsed.data.limit, COMPARE_MAX_PRODUCTS);
      assert.equal(parsed.data.product_ids, undefined);
    }
  });

  it("exports consistent min/max compare bounds", () => {
    assert.equal(COMPARE_MIN_PRODUCTS, 2);
    assert.equal(COMPARE_MAX_PRODUCTS, 4);
  });
});
