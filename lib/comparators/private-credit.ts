import { unstable_cache } from "next/cache";

import manualPoolsRaw from "@/data/private-credit-manual.json";
import {
  buildPrivateCreditFallback,
  buildPrivateCreditPayload,
  type PrivateCreditPayload,
} from "./build-private-credit";
import {
  PRIVATE_CREDIT_CACHE_KEY,
  PRIVATE_CREDIT_REVALIDATE_SECONDS,
} from "./constants";
import { fetchDefiLlamaPools } from "./defillama";
import { parseManualProducts } from "./validate";

export type { PrivateCreditPayload };
export { resolvePrivateCreditLink } from "./build-private-credit";

const manualPools = parseManualProducts(manualPoolsRaw);

async function loadPrivateCreditRows(): Promise<PrivateCreditPayload> {
  const fetchedAt = new Date().toISOString();

  try {
    const raw = await fetchDefiLlamaPools();
    return buildPrivateCreditPayload(raw, manualPools, fetchedAt);
  } catch {
    return buildPrivateCreditFallback(manualPools, fetchedAt);
  }
}

export const getPrivateCreditRows = unstable_cache(
  loadPrivateCreditRows,
  [PRIVATE_CREDIT_CACHE_KEY],
  { revalidate: PRIVATE_CREDIT_REVALIDATE_SECONDS }
);
