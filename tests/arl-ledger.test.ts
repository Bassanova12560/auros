import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";

import {
  getArlAccount,
  mintAkWh,
  mintWatt,
  redeemWatt,
  resetArlLedgerMemory,
  settleSpot,
  SEED_EUR,
} from "../lib/arl/ledger.ts";

describe("lib/arl ledger", () => {
  beforeEach(() => {
    resetArlLedgerMemory();
    // Isolate from Upstash during unit tests
    delete process.env.UPSTASH_REDIS_REST_URL;
    delete process.env.UPSTASH_REDIS_REST_TOKEN;
  });

  it("mints akWh, wraps WATT 1:1, redeems", async () => {
    const id = "lab_test_producer_01";
    const minted = await mintAkWh({ accountId: id, amount: 500, deviceId: "pv-1" });
    assert.equal(minted.account.balances.akWh, 500);
    assert.equal(minted.account.balances.EUR, SEED_EUR);
    assert.ok(minted.backend === "memory" || minted.backend === "file");

    const wrapped = await mintWatt({ accountId: id, amount: 200 });
    assert.equal(wrapped.account.balances.akWh, 300);
    assert.equal(wrapped.account.balances.WATT, 200);
    assert.equal(wrapped.vaultAkWh, 200);
    assert.equal(wrapped.wattSupply, 200);

    const redeemed = await redeemWatt({ accountId: id, amount: 50 });
    assert.equal(redeemed.account.balances.WATT, 150);
    assert.equal(redeemed.account.balances.akWh, 350);
    assert.equal(redeemed.vaultAkWh, 150);
  });

  it("settles spot buy/sell against EUR", async () => {
    const id = "lab_test_trader_01";
    await mintAkWh({ accountId: id, amount: 1000 });
    const buy = await settleSpot({
      accountId: id,
      marketId: "kwh-france",
      side: "buy",
      amount: 10,
      markOverride: 0.12,
    });
    assert.ok(buy.account.balances.akWh > 1000);
    assert.ok(buy.account.balances.EUR < SEED_EUR);
    assert.ok(buy.fill.fee > 0);

    const sell = await settleSpot({
      accountId: id,
      marketId: "kwh-france",
      side: "sell",
      amount: 10,
      markOverride: 0.12,
    });
    assert.ok(sell.account.balances.EUR > buy.account.balances.EUR);
  });

  it("rejects over-mint and insolvent watt", async () => {
    const id = "lab_test_guard_01";
    await assert.rejects(() => mintAkWh({ accountId: id, amount: -1 }));
    await getArlAccount(id);
    await assert.rejects(() => mintWatt({ accountId: id, amount: 1 }));
  });
});
