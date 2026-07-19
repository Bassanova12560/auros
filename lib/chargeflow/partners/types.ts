import { z } from "zod";

import type { OcpiCdrStub } from "../ocpi-stub";

export const CHARGEFLOW_PARTNER_IDS = [
  "tesla_fleet",
  "total_energies",
  "generic_ocpi",
] as const;

export type ChargeflowPartnerId = (typeof CHARGEFLOW_PARTNER_IDS)[number];

export const chargeflowPartnerModeSchema = z.enum(["sandbox", "live"]);
export type ChargeflowPartnerMode = z.infer<typeof chargeflowPartnerModeSchema>;

export const chargeflowPartnerCredentialsSchema = z
  .object({
    access_token: z.string().min(1).max(4096).optional(),
    vin: z.string().min(5).max(32).optional(),
    base_url: z.string().url().max(512).optional(),
    token: z.string().min(1).max(4096).optional(),
    party_id: z.string().min(1).max(64).optional(),
  })
  .strict();

export type ChargeflowPartnerCredentials = z.infer<
  typeof chargeflowPartnerCredentialsSchema
>;

export const chargeflowPartnerSyncRequestSchema = z.object({
  partner: z.enum(CHARGEFLOW_PARTNER_IDS),
  mode: chargeflowPartnerModeSchema.default("sandbox"),
  operator_id: z.string().max(128).optional(),
  limit: z.number().int().min(1).max(50).optional(),
  credentials: chargeflowPartnerCredentialsSchema.optional(),
  /** Optional inline sessions (Tesla-shaped or OCPI CDR) — used when live fetch is unavailable. */
  sessions: z.array(z.record(z.string(), z.unknown())).max(50).optional(),
});

export type ChargeflowPartnerSyncRequest = z.infer<
  typeof chargeflowPartnerSyncRequestSchema
>;

export type ChargeflowPartnerCatalogEntry = {
  id: ChargeflowPartnerId;
  label: string;
  description: string;
  modes: ChargeflowPartnerMode[];
  credential_fields: string[];
  disclaimer: string;
};

export type PartnerFetchResult =
  | { ok: true; cdrs: OcpiCdrStub[]; source: string }
  | { ok: false; code: string; message: string; status: number };

export type ChargeflowPartnerConnector = {
  id: ChargeflowPartnerId;
  catalog: ChargeflowPartnerCatalogEntry;
  fetchSessions(input: {
    mode: ChargeflowPartnerMode;
    credentials?: ChargeflowPartnerCredentials;
    sessions?: Record<string, unknown>[];
    limit: number;
    operator_id?: string;
  }): Promise<PartnerFetchResult>;
};

export const PARTNER_FORMAT_DISCLAIMER =
  "Compatible API/format adapters only — not an official Tesla, TotalEnergies, or CPO partnership endorsement.";
