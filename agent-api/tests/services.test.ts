import assert from "node:assert/strict";
import { test } from "node:test";
import { Wallet } from "ethers";
import { mintSigningMessage, predictPrice, verifyMintSignature } from "../src/services.js";

test("verifies a signed mint request", async () => {
  const wallet = Wallet.createRandom();
  const signature = await wallet.signMessage(mintSigningMessage(wallet.address, "12.5"));
  assert.equal(verifyMintSignature(wallet.address, "12.5", signature), true);
  assert.equal(verifyMintSignature(wallet.address, "13", signature), false);
});

test("returns a finite regression prediction", () => {
  const result = predictPrice("kwh", 24, [1, 2, 3, 4]);
  assert.equal(result.predictedPriceUsd, 28);
  assert.ok(Number.isFinite(result.slopePerHour));
});
