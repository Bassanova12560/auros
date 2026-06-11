import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { generateChecklist } from "../lib/protocol/checklist/generate";

describe("protocol/checklist", () => {
  it("generates 20+ items for real_estate", () => {
    const result = generateChecklist({
      asset_type: "real_estate",
      jurisdiction: "luxembourg",
      structure: "spv",
    });
    assert.ok(result.total_items >= 20);
    assert.ok(result.estimated_total_cost_eur > 0);
    assert.ok(result.items.every((i) => i.regulatory_reference.length > 0));
  });

  it("generates 20+ items for private_fund", () => {
    const result = generateChecklist({
      asset_type: "private_fund",
      jurisdiction: "luxembourg",
      structure: "fund",
    });
    assert.ok(result.total_items >= 20);
  });
});
