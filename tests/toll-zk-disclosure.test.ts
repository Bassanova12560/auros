import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  buildSelectiveDisclosure,
  computeDisclosureCommitment,
  verifyDisclosureStub,
  ZK_DISCLOSURE_DISCLAIMER,
} from "@/lib/toll/zk-disclosure";

describe("toll-zk-disclosure", () => {
  it("builds eligibility claim with commitment and hides private hints", () => {
    const claim = buildSelectiveDisclosure({
      claimType: "eligibility",
      publicInputs: { eligible: true, jurisdiction: "FR" },
      privateHints: { wallet: "0xabc", pep: false },
      salt: "test-salt-1",
    });

    assert.ok(claim.claimId.startsWith("zkclaim_"));
    assert.equal(claim.claimType, "eligibility");
    assert.equal(claim.verified, false);
    assert.equal(claim.salt, "test-salt-1");
    assert.deepEqual(claim.revealedFields, ["eligible", "jurisdiction"]);
    assert.equal(claim.hiddenFieldCount, 2);
    assert.equal(claim.disclaimer, ZK_DISCLOSURE_DISCLAIMER);
    assert.equal(claim.recipe.version, "v0-stub");
    assert.ok(claim.recipe.steps.length >= 3);

    const publicInputs = { eligible: true, jurisdiction: "FR" };
    const expected = computeDisclosureCommitment(publicInputs, "test-salt-1");
    assert.equal(claim.commitment, expected);
    assert.equal(
      verifyDisclosureStub(claim.commitment, publicInputs, claim.salt),
      true
    );
    // Claim body must not leak private hints
    const json = JSON.stringify(claim);
    assert.equal(json.includes("0xabc"), false);
    assert.equal(json.includes('"pep"'), false);
  });

  it("verify fails on tampered public inputs or salt", () => {
    const claim = buildSelectiveDisclosure({
      claimType: "ratio",
      publicInputs: { ltv: 0.42, max: 0.6 },
      salt: "fixed",
    });
    assert.equal(
      verifyDisclosureStub(claim.commitment, { ltv: 0.42, max: 0.6 }, "fixed"),
      true
    );
    assert.equal(
      verifyDisclosureStub(claim.commitment, { ltv: 0.99, max: 0.6 }, "fixed"),
      false
    );
    assert.equal(
      verifyDisclosureStub(claim.commitment, { ltv: 0.42, max: 0.6 }, "other"),
      false
    );
  });

  it("policy_match claim sorts revealed fields and counts empty hints as zero", () => {
    const claim = buildSelectiveDisclosure({
      claimType: "policy_match",
      publicInputs: { ruleId: "deny_unknown", match: true },
      salt: "p1",
    });
    assert.deepEqual(claim.revealedFields, ["match", "ruleId"]);
    assert.equal(claim.hiddenFieldCount, 0);
    assert.equal(claim.verified, false);
  });

  it("commitment is order-independent for public input keys", () => {
    const a = computeDisclosureCommitment(
      { b: 2, a: 1 },
      "s"
    );
    const b = computeDisclosureCommitment(
      { a: 1, b: 2 },
      "s"
    );
    assert.equal(a, b);
  });
});
