import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeWelhrFromText } from "@/lib/eau/water-legal-risk";

describe("eau/welhr", () => {
  it("flags elevated risk for AI data center with moratorium language", () => {
    const r = computeWelhrFromText({
      text: "AI data center hyperscale cooling towers, county moratorium on water access, community opposition, Michigan",
      region: "Michigan",
      asset_hint: "data_center",
    });
    assert.ok(r.score < 55);
    assert.ok(r.priorities.length > 0);
    assert.ok(r.priorities.length <= 3);
    assert.match(r.disclaimer, /indicative/i);
  });

  it("scores higher when rights and low-stress nordic context", () => {
    const r = computeWelhrFromText({
      text: "Concession eau potable 20 ans, titre SPV, audit hydrologique, Sweden, local water board approval",
      region: "Sweden",
      asset_hint: "water_rights",
    });
    assert.ok(r.score > 55);
    assert.equal(r.stress_band, "low");
  });
});
