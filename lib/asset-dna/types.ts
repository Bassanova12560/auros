/**
 * Asset DNA v1 — canonical real-world asset identity for AUROS RWA stack.
 * Spec: docs/ASSET-DNA-V1.md
 */

export const ASSET_DNA_SPEC_VERSION = "1.0.0" as const;

/** Classes supported in DNA v1 (expand later without breaking id format). */
export type AssetDnaClass =
  | "green_energy"
  | "water_rights"
  | "energy_infra"
  | "fleet_ev"
  | "compute"
  | "other";

export type AssetDnaJurisdiction = {
  /** ISO 3166-1 alpha-2 when known */
  country: string;
  region?: string;
  /** Free-text regulatory frame hint (e.g. EU, US-state) */
  frame?: string;
};

export type AssetDnaOrigin = {
  operatorName?: string;
  spvName?: string;
  siteName?: string;
  coordinates?: { lat: number; lon: number };
};

export type AssetDnaDocumentRef = {
  role: string;
  title: string;
  /** Content hash (sha256 hex) when sealed */
  hash?: string;
  issuedAt?: string;
  expiresAt?: string;
};

export type AssetDnaComplianceSnapshot = {
  rtmsReady?: "early" | "progress" | "ready";
  labelTier?: "pilot" | "verified" | "none";
  listingTier?: "demo" | "referenced" | "verified";
  lastReviewedAt?: string;
};

/**
 * Canonical record. `id` is the public Asset DNA identifier.
 * Format: `auros:dna:v1:<classShort>:<ulid-or-uuid>`
 */
export type AssetDnaRecord = {
  id: string;
  specVersion: typeof ASSET_DNA_SPEC_VERSION;
  assetClass: AssetDnaClass;
  displayName: string;
  jurisdiction: AssetDnaJurisdiction;
  origin: AssetDnaOrigin;
  documents: AssetDnaDocumentRef[];
  compliance: AssetDnaComplianceSnapshot;
  /** Linked AUROS surfaces (optional) */
  links?: {
    registryProjectId?: string;
    marketActorId?: string;
    greenOfferId?: string;
    dossierId?: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type AssetDnaCreateInput = {
  assetClass: AssetDnaClass;
  displayName: string;
  jurisdiction: AssetDnaJurisdiction;
  origin?: AssetDnaOrigin;
  documents?: AssetDnaDocumentRef[];
  compliance?: AssetDnaComplianceSnapshot;
  links?: AssetDnaRecord["links"];
};
