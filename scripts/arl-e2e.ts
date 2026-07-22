/**
 * Local E2E of ARL foundation: mint → WATT → spot.
 * Run: npx tsx scripts/arl-e2e.ts
 */
import {
  getArlAccount,
  mintAkWh,
  mintWatt,
  redeemWatt,
  resetArlLedgerMemory,
  settleSpot,
} from "../lib/arl/ledger.ts";

async function main() {
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  resetArlLedgerMemory();

  const accountId = "e2e_auros_foundation";
  console.log("1) Seed account");
  let snap = await getArlAccount(accountId);
  console.log("   EUR", snap.account.balances.EUR);

  console.log("2) Mint 1_000 akWh");
  snap = await mintAkWh({ accountId, amount: 1000, deviceId: "e2e-meter" });
  console.log("   akWh", snap.account.balances.akWh);

  console.log("3) Wrap 400 → WATT");
  snap = await mintWatt({ accountId, amount: 400 });
  console.log("   WATT", snap.account.balances.WATT, "vault", snap.vaultAkWh);

  console.log("4) Spot sell 100 akWh @ 0.12");
  snap = await settleSpot({
    accountId,
    marketId: "kwh-france",
    side: "sell",
    amount: 100,
    markOverride: 0.12,
  });
  console.log("   EUR", snap.account.balances.EUR, "akWh", snap.account.balances.akWh);

  console.log("5) Redeem 100 WATT");
  snap = await redeemWatt({ accountId, amount: 100 });
  console.log("   WATT", snap.account.balances.WATT, "akWh", snap.account.balances.akWh);

  console.log("OK — ARL foundation loop works");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
