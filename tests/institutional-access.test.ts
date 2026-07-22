import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  emailDomain,
  isInstitutionalEmailDomain,
  isInstitutionalOrgId,
  maxTier,
  sessionTierBoost,
} from "@/lib/green/institutional-access";

describe("institutional-access", () => {
  it("parses email domains and allowlists", () => {
    assert.equal(emailDomain("Ops@Bank.LU"), "bank.lu");
    assert.equal(
      isInstitutionalEmailDomain("a@bank.lu", ["bank.lu"]),
      true
    );
    assert.equal(
      isInstitutionalEmailDomain("a@sub.bank.lu", ["bank.lu"]),
      true
    );
    assert.equal(
      isInstitutionalEmailDomain("a@other.com", ["bank.lu"]),
      false
    );
  });

  it("matches org ids", () => {
    assert.equal(isInstitutionalOrgId("org_1", ["org_1", "org_2"]), true);
    assert.equal(isInstitutionalOrgId("org_x", ["org_1"]), false);
  });

  it("boosts session tiers", () => {
    assert.equal(sessionTierBoost({ userId: null }), null);
    assert.equal(sessionTierBoost({ userId: "user_1" }), "free");
    assert.equal(
      sessionTierBoost({
        userId: "user_1",
        orgId: "org_ok",
        orgIds: ["org_ok"],
      }),
      "enterprise"
    );
    assert.equal(
      sessionTierBoost({
        userId: "user_1",
        email: "desk@acme.bank",
        domains: ["acme.bank"],
      }),
      "enterprise"
    );
    assert.equal(maxTier("anonymous", "enterprise"), "enterprise");
    assert.equal(maxTier("premium", "free"), "premium");
  });
});
