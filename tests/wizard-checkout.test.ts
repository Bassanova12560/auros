import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  computeWizardChargeCents,
  isUpgradeTier,
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

  it("parses upgrade_from metadata", () => {
    const meta = parseWizardCheckoutMetadata({
      product: "wizard",
      wizard_tier: "pro",
      email: "client@corp.com",
      locale: "fr",
      upgrade_from: "starter",
    });
    assert.ok(meta);
    assert.equal(meta.upgradeFrom, "starter");
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

  it("computeWizardChargeCents full price without upgrade", () => {
    assert.equal(computeWizardChargeCents("starter"), 49_000);
    assert.equal(computeWizardChargeCents("pro"), 199_000);
    assert.equal(computeWizardChargeCents("institutional"), 499_000);
  });

  it("computeWizardChargeCents starter→pro charges 1500€ difference", () => {
    assert.equal(computeWizardChargeCents("pro", "starter"), 150_000);
  });

  it("computeWizardChargeCents starter→institutional charges difference", () => {
    assert.equal(computeWizardChargeCents("institutional", "starter"), 450_000);
  });

  it("computeWizardChargeCents pro→institutional charges difference", () => {
    assert.equal(computeWizardChargeCents("institutional", "pro"), 300_000);
  });

  it("isUpgradeTier validates tier ordering", () => {
    assert.equal(isUpgradeTier("starter", "pro"), true);
    assert.equal(isUpgradeTier("starter", "institutional"), true);
    assert.equal(isUpgradeTier("pro", "institutional"), true);
    assert.equal(isUpgradeTier("pro", "starter"), false);
    assert.equal(isUpgradeTier("starter", "starter"), false);
  });
});
