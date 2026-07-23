import { unstable_cache } from "next/cache";

import manualPoolsRaw from "@/data/art-manual.json";
import {
  buildArtFallback,
  buildArtPayload,
  type ArtPayload,
} from "./build-art";
import { ART_CACHE_KEY, ART_REVALIDATE_SECONDS } from "./constants";
import { fetchDefiLlamaPools } from "./defillama";
import { parseManualProducts } from "./validate";

export type { ArtPayload };
export { resolveArtLink } from "./build-art";

const manualPools = parseManualProducts(manualPoolsRaw);

async function loadArtRows(): Promise<ArtPayload> {
  const fetchedAt = new Date().toISOString();

  try {
    const raw = await fetchDefiLlamaPools();
    return buildArtPayload(raw, manualPools, fetchedAt);
  } catch {
    return buildArtFallback(manualPools, fetchedAt);
  }
}

export const getArtRows = unstable_cache(
  loadArtRows,
  [ART_CACHE_KEY],
  { revalidate: ART_REVALIDATE_SECONDS }
);
