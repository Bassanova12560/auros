import { unstable_cache } from "next/cache";

import manualPoolsRaw from "@/data/bonds-manual.json";
import {
  buildBondsFallback,
  buildBondsPayload,
  type BondsPayload,
} from "./build-bonds";
import { BONDS_CACHE_KEY, BONDS_REVALIDATE_SECONDS } from "./constants";
import { fetchDefiLlamaPools } from "./defillama";
import { parseManualProducts } from "./validate";

export type { BondsPayload };
export { resolveBondLink } from "./build-bonds";

const manualPools = parseManualProducts(manualPoolsRaw);

async function loadBondRows(): Promise<BondsPayload> {
  const fetchedAt = new Date().toISOString();

  try {
    const raw = await fetchDefiLlamaPools();
    return buildBondsPayload(raw, manualPools, fetchedAt);
  } catch {
    return buildBondsFallback(manualPools, fetchedAt);
  }
}

export const getBondRows = unstable_cache(
  loadBondRows,
  [BONDS_CACHE_KEY],
  { revalidate: BONDS_REVALIDATE_SECONDS }
);
