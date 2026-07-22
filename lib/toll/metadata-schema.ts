/**
 * AUROS Metadata Standard v0 — canonical RWA asset schema (toll layer).
 * Spec: docs/AUROS-TOLL-MASTER-PLAN.md
 */

export const AUROS_METADATA_SCHEMA_ID = "auros.rwa.asset.v0" as const;
export const AUROS_METADATA_SCHEMA_VERSION = "0.1.0" as const;

export type AurosMetadataSchema = {
  $id: typeof AUROS_METADATA_SCHEMA_ID;
  version: typeof AUROS_METADATA_SCHEMA_VERSION;
  title: string;
  description: string;
  required: string[];
  properties: Record<
    string,
    { type: string; description: string; enum?: string[] }
  >;
};

/** Machine-readable schema platforms should publish against to be findable. */
export function getAurosMetadataSchema(): AurosMetadataSchema {
  return {
    $id: AUROS_METADATA_SCHEMA_ID,
    version: AUROS_METADATA_SCHEMA_VERSION,
    title: "AUROS RWA Asset Metadata",
    description:
      "Canonical metadata for real-world assets before/during tokenization. Publish in this shape to be resolvable and comparable on AUROS.",
    required: ["id", "assetClass", "displayName", "jurisdiction"],
    properties: {
      id: {
        type: "string",
        description: "Asset DNA id — auros:dna:v1:<class>:<uuid>",
      },
      assetClass: {
        type: "string",
        enum: [
          "green_energy",
          "water_rights",
          "energy_infra",
          "fleet_ev",
          "compute",
          "other",
        ],
        description: "AUROS taxonomy class",
      },
      displayName: { type: "string", description: "Human label" },
      jurisdiction: {
        type: "object",
        description: "country (+ region / regulatory frame)",
      },
      origin: {
        type: "object",
        description: "operator / SPV / site / coordinates",
      },
      documents: {
        type: "array",
        description: "Document refs + optional content hashes",
      },
      compliance: {
        type: "object",
        description: "RTMS readiness, label/listing tiers",
      },
      events: {
        type: "array",
        description: "Lifecycle events (Proof Stream)",
      },
      trustScore: {
        type: "object",
        description: "AUROS AI Trust Score snapshot",
      },
      status: {
        type: "string",
        enum: ["draft", "referenced", "verified", "unknown"],
        description: "Publication status (HITL for verified)",
      },
    },
  };
}
