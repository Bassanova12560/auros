import artManual from "../data/art-manual.json";
import bondsManual from "../data/bonds-manual.json";
import commoditiesManual from "../data/commodities-manual.json";
import immobilierManual from "../data/immobilier-manual.json";
import privateCreditManual from "../data/private-credit-manual.json";
import privateEquityManual from "../data/private-equity-manual.json";
import stablecoinsManual from "../data/stablecoins-manual.json";
import { buildArtPayload } from "../lib/comparators/build-art";
import { buildBondsPayload } from "../lib/comparators/build-bonds";
import { buildCommoditiesPayload } from "../lib/comparators/build-commodities";
import { buildImmobilierPayload } from "../lib/comparators/build-immobilier";
import { buildPrivateCreditPayload } from "../lib/comparators/build-private-credit";
import { buildPrivateEquityPayload } from "../lib/comparators/build-private-equity";
import { buildStablecoinPayload } from "../lib/comparators/build-stablecoins";
import {
  dedupeHubProducts,
  rowsToHubProducts,
} from "../lib/comparators/compare-hub";
import { fetchDefiLlamaPools } from "../lib/comparators/defillama";
import { parseManualProducts } from "../lib/comparators/validate";
import { getTrackableProductsSummary } from "../data/listings/products";

async function main() {
  const fetchedAt = new Date().toISOString();
  const pools = await fetchDefiLlamaPools();

  const stablecoins = buildStablecoinPayload(
    pools,
    parseManualProducts(stablecoinsManual),
    fetchedAt
  );
  const immobilier = buildImmobilierPayload(
    pools,
    parseManualProducts(immobilierManual),
    fetchedAt
  );
  const bonds = buildBondsPayload(
    pools,
    parseManualProducts(bondsManual),
    fetchedAt
  );
  const commodities = buildCommoditiesPayload(
    pools,
    parseManualProducts(commoditiesManual),
    fetchedAt
  );
  const privateCredit = buildPrivateCreditPayload(
    pools,
    parseManualProducts(privateCreditManual),
    fetchedAt
  );
  const privateEquity = buildPrivateEquityPayload(
    pools,
    parseManualProducts(privateEquityManual),
    fetchedAt
  );
  const art = buildArtPayload(pools, parseManualProducts(artManual), fetchedAt);

  const products = dedupeHubProducts([
    ...rowsToHubProducts(stablecoins.rows, "stablecoins"),
    ...rowsToHubProducts(immobilier.rows, "immobilier"),
    ...rowsToHubProducts(bonds.rows, "obligations"),
    ...rowsToHubProducts(commodities.rows, "matieres-premieres"),
    ...rowsToHubProducts(privateCredit.rows, "private-credit"),
    ...rowsToHubProducts(privateEquity.rows, "private-equity"),
    ...rowsToHubProducts(art.rows, "art-collectibles"),
  ]);

  const by: Record<string, number> = {};
  for (const product of products) {
    by[product.comparatorId] = (by[product.comparatorId] ?? 0) + 1;
  }

  console.log(
    JSON.stringify(
      {
        hubTotal: products.length,
        byClass: by,
        live: products.filter((p) => p.row.live).length,
        manual: products.filter((p) => !p.row.live).length,
        rawRows: {
          stablecoins: stablecoins.rows.length,
          immobilier: immobilier.rows.length,
          bonds: bonds.rows.length,
          commodities: commodities.rows.length,
          privateCredit: privateCredit.rows.length,
          privateEquity: privateEquity.rows.length,
          art: art.rows.length,
        },
        listingsSummary: getTrackableProductsSummary(),
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
