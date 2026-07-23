import { unstable_cache } from "next/cache";

import manualPoolsRaw from "@/data/private-equity-manual.json";
import {
  buildPrivateEquityFallback,
  buildPrivateEquityPayload,
  type PrivateEquityPayload,
} from "./build-private-equity";
import {
  PRIVATE_EQUITY_CACHE_KEY,
  PRIVATE_EQUITY_REVALIDATE_SECONDS,
} from "./constants";
import { fetchDefiLlamaPools } from "./defillama";
import { parseManualProducts } from "./validate";

export type { PrivateEquityPayload };
export { resolvePrivateEquityLink } from "./build-private-equity";

const manualPools = parseManualProducts(manualPoolsRaw);

async function loadPrivateEquityRows(): Promise<PrivateEquityPayload> {
  const fetchedAt = new Date().toISOString();

  try {
    const raw = await fetchDefiLlamaPools();
    return buildPrivateEquityPayload(raw, manualPools, fetchedAt);
  } catch {
    return buildPrivateEquityFallback(manualPools, fetchedAt);
  }
}

export const getPrivateEquityRows = unstable_cache(
  loadPrivateEquityRows,
  [PRIVATE_EQUITY_CACHE_KEY],
  { revalidate: PRIVATE_EQUITY_REVALIDATE_SECONDS }
);
