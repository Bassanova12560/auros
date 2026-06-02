import { unstable_cache } from "next/cache";

import manualPoolsRaw from "@/data/commodities-manual.json";
import {
  buildCommoditiesFallback,
  buildCommoditiesPayload,
  type CommoditiesPayload,
} from "./build-commodities";
import {
  COMMODITIES_CACHE_KEY,
  COMMODITIES_REVALIDATE_SECONDS,
} from "./constants";
import { fetchDefiLlamaPools } from "./defillama";
import { parseManualProducts } from "./validate";

export type { CommoditiesPayload };
export { resolveCommodityLink } from "./build-commodities";

const manualPools = parseManualProducts(manualPoolsRaw);

async function loadCommodityRows(): Promise<CommoditiesPayload> {
  const fetchedAt = new Date().toISOString();

  try {
    const raw = await fetchDefiLlamaPools();
    return buildCommoditiesPayload(raw, manualPools, fetchedAt);
  } catch {
    return buildCommoditiesFallback(manualPools, fetchedAt);
  }
}

export const getCommodityRows = unstable_cache(
  loadCommodityRows,
  [COMMODITIES_CACHE_KEY],
  { revalidate: COMMODITIES_REVALIDATE_SECONDS }
);
