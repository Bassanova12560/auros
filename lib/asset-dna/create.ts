import { createHash, randomUUID } from "node:crypto";

import { buildAssetDnaId } from "./id";
import {
  ASSET_DNA_SPEC_VERSION,
  type AssetDnaClass,
  type AssetDnaCreateInput,
  type AssetDnaRecord,
} from "./types";

/** Stable UUID-shaped hex from a seed key (for bootstrap / backfill). */
export function uuidFromSeedKey(seedKey: string): string {
  const h = createHash("sha256").update(`auros:dna:seed:${seedKey}`).digest("hex");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

export function deterministicAssetDnaId(
  assetClass: AssetDnaClass,
  seedKey: string
): string {
  return buildAssetDnaId(assetClass, uuidFromSeedKey(seedKey));
}

/** In-memory / API helper — persistence via store. */
export function createAssetDnaRecord(input: AssetDnaCreateInput): AssetDnaRecord {
  const now = new Date().toISOString();
  const uuid = input.seedKey
    ? uuidFromSeedKey(input.seedKey)
    : randomUUID();
  const id = buildAssetDnaId(input.assetClass, uuid);
  return {
    id,
    specVersion: ASSET_DNA_SPEC_VERSION,
    assetClass: input.assetClass,
    displayName: input.displayName.trim().slice(0, 200),
    jurisdiction: {
      country: input.jurisdiction.country.trim().toUpperCase().slice(0, 2),
      region: input.jurisdiction.region?.trim().slice(0, 120),
      frame: input.jurisdiction.frame?.trim().slice(0, 80),
    },
    origin: input.origin ?? {},
    documents: input.documents ?? [],
    compliance: input.compliance ?? {},
    links: input.links,
    createdAt: now,
    updatedAt: now,
  };
}
