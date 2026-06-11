import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  parseWizardCheckoutMetadata,
  wizardProduct,
} from "../lib/stripe/wizard-checkout";

describe("wizard-checkout", () => {
  it("tier amounts in cents EUR", () => {
    assert.equal(wizardProduct("starter").amountCents, 49_000);
    assert.equal(wizardProduct("pro").amountCents, 199_000);
    assert.equal(wizardProduct("institutional").amountCents, 499_000);
    assert.equal(wizardProduct("starter").currency, "eur");
  });

  it("parses wizard metadata with tier and email", () => {
    const meta = parseWizardCheckoutMetadata({
      product: "wizard",
      wizard_tier: "pro",
      email: "client@corp.com",
      locale: "fr",
    });
    assert.ok(meta);
    assert.equal(meta.tier, "pro");
    assert.equal(meta.email, "client@corp.com");
    assert.equal(meta.locale, "fr");
  });

  it("rejects non-wizard or invalid metadata", () => {
    assert.equal(
      parseWizardCheckoutMetadata({ product: "jurisdiction", tier: "starter" }),
      null
    );
    assert.equal(
      parseWizardCheckoutMetadata({
        product: "wizard",
        wizard_tier: "invalid",
        email: "a@b.com",
      }),
      null
    );
    assert.equal(
      parseWizardCheckoutMetadata({
        product: "wizard",
        wizard_tier: "starter",
        email: "",
      }),
      null
    );
  });
});
