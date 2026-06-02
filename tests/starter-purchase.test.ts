import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  STARTER_KIT_AMOUNT_CENTS,
  STARTER_KIT_PRICE_EUR,
  validateCheckoutMetadata,
  validatePortalRender,
  validateStarterProduct,
  validateWizardBridge,
} from "../lib/jurisdictions/purchase-test";
import { runStarterKitPurchaseTest } from "../lib/jurisdictions/purchase-test-run";

describe("starter-purchase/5000", () => {
  it("starter tier is exactly 5000 EUR", () => {
    assert.equal(STARTER_KIT_PRICE_EUR, 5_000);
    assert.equal(STARTER_KIT_AMOUNT_CENTS, 500_000);
    const s = validateStarterProduct();
    assert.equal(s.ok, true);
  });

  it("checkout metadata accepts starter tier", () => {
    assert.ok(validateCheckoutMetadata().every((s) => s.ok));
  });

  it("local purchase pipeline (generation + PDF + portal sections)", async () => {
    process.env.AUROS_SIMULATION = "true";
    const report = await runStarterKitPurchaseTest({ withDb: false });
    assert.equal(report.ok, true, report.steps.filter((s) => !s.ok).map((s) => s.name).join(", "));
    assert.ok(report.steps.some((s) => s.name === "starter kit PDF render" && s.ok));
    assert.ok(report.steps.some((s) => s.name === "readiness card (max 3 priorities)" && s.ok));
  });

  it("wizard bridge from purchase context", async () => {
    process.env.AUROS_SIMULATION = "true";
    const report = await runStarterKitPurchaseTest({ withDb: false });
    assert.ok(report.steps.some((s) => s.name === "wizard prefill from purchase" && s.ok));
  });

  it("portal render validates all StarterKitView sections", async () => {
    process.env.AUROS_SIMULATION = "true";
    const { generateStarterKit } = await import("../lib/jurisdictions/starter-kit-generate");
    const kit = await generateStarterKit({
      leadId: "test",
      firstName: "Test",
      email: "test@test.auros",
      projectType: "real_estate",
      projectValue: "1to5m",
      jurisdictions: ["luxembourg"],
      locale: "fr",
      paidTier: "starter",
    });
    const steps = validatePortalRender(kit.content);
    assert.ok(steps.every((s) => s.ok), steps.filter((s) => !s.ok).map((s) => s.name).join(", "));

    const bridge = validateWizardBridge({
      projectType: "real_estate",
      projectValue: "1to5m",
      jurisdictions: ["luxembourg"],
      firstName: "Test",
      email: "test@test.auros",
      locale: "fr",
    });
    assert.ok(bridge.every((s) => s.ok));
  });
});
