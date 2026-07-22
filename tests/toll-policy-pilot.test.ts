import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { evaluateTollPolicy } from "@/lib/toll";

describe("toll-policy-pilot", () => {
  it("denies unknown assets via deny_unknown", () => {
    const policy = evaluateTollPolicy({ dna: null });
    assert.equal(policy.decision, "deny");
    assert.ok(policy.ruleIds.includes("deny_unknown"));
    assert.ok(policy.reasons.some((r) => /not AUROS-resolved/i.test(r)));
    assert.ok(
      /integrator enforces|does not auto-block/i.test(policy.disclaimer)
    );
  });

  it("skips deny_unknown when rule is not selected", () => {
    const policy = evaluateTollPolicy({
      dna: null,
      rules: ["review_low_trust"],
    });
    assert.equal(policy.decision, "deny");
    assert.deepEqual(policy.ruleIds, []);
  });
});
