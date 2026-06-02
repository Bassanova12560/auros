import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { scoreGuideLead, scoreQuoteLead } from "../lib/jurisdictions/lead-score";

describe("jurisdictions/lead-score", () => {
  it("marks high-value quotes as hot", () => {
    const { tier, score } = scoreQuoteLead({
      projectValue: "over20m",
      projectType: "real_estate",
    });
    assert.equal(tier, "hot");
    assert.ok(score >= 70);
  });

  it("marks small guide leads as cold", () => {
    const { tier } = scoreGuideLead({
      projectType: "other",
      jurisdictionCount: 1,
    });
    assert.equal(tier, "cold");
  });
});
