import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buyInsurance,
  buyOption,
  lendBorrowQuote,
  lendDeposit,
  lendRepayQuote,
  mintFlop,
  reportInsuranceProduction,
  settleInsurance,
  writeOption,
} from "../src/phase3.ts";

describe("phase3 mock flywheel", () => {
  it("options write + buy with 0.2% fee", () => {
    const written = writeOption({
      side: "call",
      strike: 0.12,
      expiry: Date.now() + 3600_000,
      premium: 100,
      margin: 1000,
      size: 1000,
      seller: "seller-1",
    });
    const bought = buyOption(written.id, "buyer-1");
    assert.equal(bought.fee, 0.2);
  });

  it("rejects option self-trade", () => {
    const written = writeOption({
      side: "put",
      strike: 0.1,
      expiry: Date.now() + 3600_000,
      premium: 50,
      margin: 500,
      size: 100,
      seller: "self-seller",
    });
    assert.throws(() => buyOption(written.id, "self-seller"), /self-trade/);
  });

  it("lending borrow/repay takes 10% of interest", () => {
    const agent = `lender-${Date.now()}`;
    lendDeposit(agent, "resource", 10_000);
    lendDeposit("lp", "quote", 50_000);
    lendBorrowQuote(agent, 4_000);
    const repaid = lendRepayQuote(agent, 4_000);
    assert.ok(repaid.protocolFee > 0);
  });

  it("insurance shortfall pays coverage after 15% commission on premium", () => {
    const bought = buyInsurance({
      insured: "solar-1",
      threshold: 1000,
      coverage: 5000,
      premium: 1000,
      durationSec: 1,
    });
    assert.equal(bought.commission, 150);
    reportInsuranceProduction(bought.id, 10);
    const settled = settleInsurance(bought.id);
    assert.equal(settled.payout, 5000);
  });

  it("mints FLOP compute credits", () => {
    const m = mintFlop("gpu-farm", 8, "job-xyz");
    assert.equal(m.balance, 8);
  });
});
