import { randomUUID } from "node:crypto";

import { buildAssetDnaId } from "./id";
import {
  ASSET_DNA_SPEC_VERSION,
  type AssetDnaCreateInput,
  type AssetDnaRecord,
} from "./types";

/** In-memory / API helper — persistence layer lands with Proof Stream. */
export function createAssetDnaRecord(input: AssetDnaCreateInput): AssetDnaRecord {
  const now = new Date().toISOString();
  const uuid = randomUUID();
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
