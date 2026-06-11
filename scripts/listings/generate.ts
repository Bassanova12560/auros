/**
 * Generate submission-ready JSON for DeFiLlama + CoinGecko listings.
 * Usage: npm run listings:generate
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  AUROS_DESCRIPTIONS,
  AUROS_LISTING,
  COINGECKO_FORM_FIELDS,
  DEFILLAMA_DATA2_DRAFT,
  DEFILLAMA_PR_FORM,
  LISTING_SUBMISSION_URLS,
  MANUAL_SUBMISSION_CHECKLIST,
} from "../../data/listings/auros-listing";
import {
  RAPIDAPI_LISTING,
  RAPIDAPI_SUBMISSION_PAYLOAD,
} from "../../data/listings/rapidapi-listing";
import {
  DEFILLAMA_INDEXED_PROTOCOLS,
  getTrackableProducts,
  getTrackableProductsSummary,
} from "../../data/listings/products";
import { LISTING_CATALOG_STATS } from "../../data/listings/catalog-stats";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../../data/listings/generated");

async function tryLiveHubCount(): Promise<number | null> {
  try {
    const { getCompareHubPayload } = await import("../../lib/comparators/compare-hub");
    const payload = await getCompareHubPayload();
    return payload.totalProducts;
  } catch {
    return null;
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const liveHubCount = await tryLiveHubCount();
  const summary = getTrackableProductsSummary();
  const products = getTrackableProducts();
  const catalogStats =
    summary.totalProducts > 0 ? summary : { ...LISTING_CATALOG_STATS, liveHubProductCount: liveHubCount };

  const payload = {
    generatedAt: new Date().toISOString(),
    project: AUROS_LISTING,
    descriptions: AUROS_DESCRIPTIONS,
    submissionUrls: LISTING_SUBMISSION_URLS,
    catalog: {
      ...catalogStats,
      liveHubProductCount: liveHubCount,
    },
    trackableProducts: products,
    defillamaIndexedProtocols: DEFILLAMA_INDEXED_PROTOCOLS,
    defillama: {
      strategy:
        "Primary: support ticket (no on-chain TVL). Optional: defillama-server data2.ts metadata PR if team accepts Services listing without adapter.",
      supportTicket: {
        subject: AUROS_DESCRIPTIONS.defillamaSupportTicketSubject,
        body: AUROS_DESCRIPTIONS.defillamaSupportTicketBody,
        url: LISTING_SUBMISSION_URLS.defillama.supportTicket,
      },
      prForm: DEFILLAMA_PR_FORM,
      data2Draft: DEFILLAMA_DATA2_DRAFT,
    },
    coingecko: {
      strategy:
        "No native token — use Partner Portal Others or support ticket for RWA comparator/platform reference.",
      formFields: COINGECKO_FORM_FIELDS,
      partnerPortalUrl: LISTING_SUBMISSION_URLS.coingecko.newRequest,
      supportFallbackUrl: LISTING_SUBMISSION_URLS.coingecko.supportOthers,
    },
    manualChecklist: MANUAL_SUBMISSION_CHECKLIST,
    rapidapi: {
      listing: RAPIDAPI_LISTING,
      submission: RAPIDAPI_SUBMISSION_PAYLOAD,
      hubUrl: "https://rapidapi.com/hub",
    },
  };

  const outPath = join(OUT_DIR, "submission-payload.json");
  writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  const data2Path = join(OUT_DIR, "defillama-data2-entry.json");
  writeFileSync(data2Path, `${JSON.stringify(DEFILLAMA_DATA2_DRAFT, null, 2)}\n`, "utf8");

  const rapidapiPath = join(OUT_DIR, "rapidapi-submission.json");
  writeFileSync(
    rapidapiPath,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), ...RAPIDAPI_SUBMISSION_PAYLOAD }, null, 2)}\n`,
    "utf8"
  );

  console.log("AUROS listing submission package generated\n");
  console.log("Output:", outPath);
  console.log("DeFiLlama draft:", data2Path);
  console.log("RapidAPI:", rapidapiPath);
  console.log("");
  console.log("Catalog (static):", summary.totalProducts, "products,", summary.uniquePlatforms, "platforms");
  if (liveHubCount != null) {
    console.log("Compare hub (live):", liveHubCount, "products");
  }
  console.log("");
  console.log("--- Manual next steps ---");
  for (const item of MANUAL_SUBMISSION_CHECKLIST) {
    console.log(`${item.step}. ${item.action}`);
    if ("url" in item && item.url) console.log(`   ${item.url}`);
    console.log(`   ${item.detail}`);
  }
}

main();
