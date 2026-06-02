import { unstable_cache } from "next/cache";

import manualPoolsRaw from "@/data/stablecoins-manual.json";
import {
  buildStablecoinFallback,
  buildStablecoinPayload,
  type StablecoinsPayload,
} from "./build-stablecoins";
import { STABLECOINS_CACHE_KEY, STABLECOINS_REVALIDATE_SECONDS } from "./constants";
import { fetchDefiLlamaPools } from "./defillama";
import { parseManualPools } from "./validate";

export type { StablecoinsPayload };
export { resolvePlatformLink } from "./build-stablecoins";

const manualPools = parseManualPools(manualPoolsRaw);

async function loadStablecoinRows(): Promise<StablecoinsPayload> {
  const fetchedAt = new Date().toISOString();

  try {
    const raw = await fetchDefiLlamaPools();
    return buildStablecoinPayload(raw, manualPools, fetchedAt);
  } catch {
    return buildStablecoinFallback(manualPools, fetchedAt);
  }
}

export const getStablecoinRows = unstable_cache(
  loadStablecoinRows,
  [STABLECOINS_CACHE_KEY],
  { revalidate: STABLECOINS_REVALIDATE_SECONDS }
);
