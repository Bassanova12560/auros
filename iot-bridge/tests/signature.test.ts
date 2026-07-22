import assert from "node:assert/strict";
import { test } from "node:test";
import { Wallet } from "ethers";
import { productionSigningMessage, recoverProductionSigner } from "../src/services.js";

test("recovers the production message signer", async () => {
  const wallet = Wallet.createRandom();
  const unsigned = {
    deviceId: "meter-1",
    amountWh: 250,
    timestamp: new Date().toISOString(),
  };
  const signature = await wallet.signMessage(productionSigningMessage(unsigned));
  assert.equal(recoverProductionSigner({ ...unsigned, signature }), wallet.address);
});
