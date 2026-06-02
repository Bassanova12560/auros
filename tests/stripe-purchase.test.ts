import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { assertStripeTestKey } from "../lib/jurisdictions/stripe-purchase-test";

describe("stripe-purchase/test-mode", () => {
  it("accepts sk_test keys", () => {
    assert.equal(assertStripeTestKey("sk_test_abc123"), null);
  });

  it("rejects sk_live keys", () => {
    const step = assertStripeTestKey("sk_live_abc123");
    assert.ok(step);
    assert.equal(step.ok, false);
  });
});
