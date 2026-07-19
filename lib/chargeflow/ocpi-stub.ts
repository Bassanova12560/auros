import { z } from "zod";

import type { ChargeflowCreateRequest } from "./schema";
import { chargeflowAttributesSchema } from "./schema";

/** Minimal OCPI-like CDR stub — offline only, not a live OCPI client. */
export const ocpiCdrStubSchema = z.object({
  id: z.string().min(1).max(128),
  start_date_time: z.string().min(10).max(40),
  end_date_time: z.string().min(10).max(40),
  total_energy: z.number().positive().max(10_000),
  country: z.string().max(64).optional(),
  location_id: z.string().max(128).optional(),
  evse_uid: z.string().max(128).optional(),
  connector_id: z.string().max(128).optional(),
  cpo_id: z.string().max(128).optional(),
  party_id: z.string().max(128).optional(),
  auth_id: z.string().max(128).optional(),
});

export const chargeflowCsvRowSchema = z.object({
  external_session_id: z.string().min(1).max(128),
  started_at: z.string().min(10).max(40),
  ended_at: z.string().min(10).max(40),
  energy_kwh: z.number().positive().max(10_000),
  country: z.string().max(64).optional(),
  site_id: z.string().max(128).optional(),
  connector_id: z.string().max(128).optional(),
  operator_id: z.string().max(128).optional(),
  vehicle_ref: z.string().max(128).optional(),
});

export const chargeflowFromOcpiRequestSchema = z
  .object({
    cdrs: z.array(ocpiCdrStubSchema).max(50).optional(),
    csv_rows: z.array(chargeflowCsvRowSchema).max(50).optional(),
    default_operator_id: z.string().max(128).optional(),
    attributes: chargeflowAttributesSchema,
  })
  .refine(
    (v) =>
      (v.cdrs?.length ?? 0) + (v.csv_rows?.length ?? 0) >= 1 &&
      (v.cdrs?.length ?? 0) + (v.csv_rows?.length ?? 0) <= 50,
    { message: "Provide 1–50 cdrs and/or csv_rows combined" }
  );

export type OcpiCdrStub = z.infer<typeof ocpiCdrStubSchema>;
export type ChargeflowCsvRow = z.infer<typeof chargeflowCsvRowSchema>;
export type ChargeflowFromOcpiRequest = z.infer<
  typeof chargeflowFromOcpiRequestSchema
>;

export function mapOcpiCdrToCreateRequest(
  cdr: OcpiCdrStub,
  defaults?: {
    operator_id?: string;
    attributes?: ChargeflowCreateRequest["attributes"];
  }
): ChargeflowCreateRequest {
  const operator =
    cdr.cpo_id?.trim() ||
    cdr.party_id?.trim() ||
    defaults?.operator_id?.trim() ||
    undefined;
  return {
    session: {
      external_session_id: cdr.id,
      started_at: cdr.start_date_time,
      ended_at: cdr.end_date_time,
      energy_kwh: cdr.total_energy,
      source_format: "ocpi",
      ...(operator ? { operator_id: operator } : {}),
      ...(cdr.auth_id ? { vehicle_ref: cdr.auth_id } : {}),
      location: {
        ...(cdr.country ? { country: cdr.country } : {}),
        ...(cdr.location_id || cdr.evse_uid
          ? { site_id: cdr.location_id ?? cdr.evse_uid }
          : {}),
        ...(cdr.connector_id ? { connector_id: cdr.connector_id } : {}),
      },
    },
    ...(defaults?.attributes ? { attributes: defaults.attributes } : {}),
  };
}

export function mapCsvRowToCreateRequest(
  row: ChargeflowCsvRow,
  defaults?: {
    operator_id?: string;
    attributes?: ChargeflowCreateRequest["attributes"];
  }
): ChargeflowCreateRequest {
  const operator =
    row.operator_id?.trim() || defaults?.operator_id?.trim() || undefined;
  return {
    session: {
      external_session_id: row.external_session_id,
      started_at: row.started_at,
      ended_at: row.ended_at,
      energy_kwh: row.energy_kwh,
      source_format: "csv",
      ...(operator ? { operator_id: operator } : {}),
      ...(row.vehicle_ref ? { vehicle_ref: row.vehicle_ref } : {}),
      location: {
        ...(row.country ? { country: row.country } : {}),
        ...(row.site_id ? { site_id: row.site_id } : {}),
        ...(row.connector_id ? { connector_id: row.connector_id } : {}),
      },
    },
    ...(defaults?.attributes ? { attributes: defaults.attributes } : {}),
  };
}

export function mapFromOcpiRequestToCreateItems(
  input: ChargeflowFromOcpiRequest
): ChargeflowCreateRequest[] {
  const defaults = {
    operator_id: input.default_operator_id,
    attributes: input.attributes,
  };
  const fromCdrs = (input.cdrs ?? []).map((cdr) =>
    mapOcpiCdrToCreateRequest(cdr, defaults)
  );
  const fromCsv = (input.csv_rows ?? []).map((row) =>
    mapCsvRowToCreateRequest(row, defaults)
  );
  return [...fromCdrs, ...fromCsv];
}
