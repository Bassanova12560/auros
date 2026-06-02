import { unstable_cache } from "next/cache";

import manualPoolsRaw from "@/data/immobilier-manual.json";
import {
  buildImmobilierFallback,
  buildImmobilierPayload,
  type ImmobilierPayload,
} from "./build-immobilier";
import {
  IMMOBILIER_CACHE_KEY,
  IMMOBILIER_REVALIDATE_SECONDS,
} from "./constants";
import { fetchDefiLlamaPools } from "./defillama";
import { parseManualProducts } from "./validate";

export type { ImmobilierPayload };
export { resolveImmobilierLink } from "./build-immobilier";

const manualPools = parseManualProducts(manualPoolsRaw);

async function loadImmobilierRows(): Promise<ImmobilierPayload> {
  const fetchedAt = new Date().toISOString();

  try {
    const raw = await fetchDefiLlamaPools();
    return buildImmobilierPayload(raw, manualPools, fetchedAt);
  } catch {
    return buildImmobilierFallback(manualPools, fetchedAt);
  }
}

export const getImmobilierRows = unstable_cache(
  loadImmobilierRows,
  [IMMOBILIER_CACHE_KEY],
  { revalidate: IMMOBILIER_REVALIDATE_SECONDS }
);
