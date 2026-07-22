import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
  const { backfillGreenAssetDna } = await import("../lib/green/backfill-asset-dna");
  const r = await backfillGreenAssetDna();
  console.log(
    JSON.stringify({
      registryUpdated: r.registryUpdated,
      marketUpdated: r.marketUpdated,
      errorCount: r.errors.length,
      errors: r.errors.slice(0, 8),
    })
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
