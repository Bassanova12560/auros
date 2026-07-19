import { CHARGEFLOW_STANDARD } from "./constants";
import type { ChargeflowCreateRequest } from "./schema";
import { sha256Hex } from "./signing";

export type ChargeflowAurosEnrichment = {
  watt_rating: number | null;
  watt_tier: "high" | "mid" | "early" | null;
  energy_value_eur_indicative: number | null;
};

export type ChargeflowCanonical = {
  v: 1;
  standard: typeof CHARGEFLOW_STANDARD;
  unit_id: string;
  issued_at: string;
  session: {
    external_session_id: string;
    started_at: string;
    ended_at: string;
    energy_kwh: number;
    location?: {
      country?: string;
      site_id?: string;
      connector_id?: string;
    };
    vehicle_ref?: string;
    operator_id?: string;
    source_format: string;
  };
  attributes?: {
    renewable_claim: string;
    grid_mix_note?: string;
    compare_ref_id?: string;
  };
  auros: ChargeflowAurosEnrichment;
  disclaimer: string;
};

const DISCLAIMER =
  "AUROS ChargeFlow CFU-E — indicative off-chain flow registration. Not a security token, legal certificate of origin, or CPO partnership endorsement.";

/** Deterministic JSON stringify (sorted object keys). */
export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((v) => stableStringify(v)).join(",")}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(",")}}`;
}

export function buildChargeflowCanonical(
  unitId: string,
  input: ChargeflowCreateRequest,
  auros: ChargeflowAurosEnrichment,
  issuedAt: string
): ChargeflowCanonical {
  const session = input.session;
  return {
    v: 1,
    standard: CHARGEFLOW_STANDARD,
    unit_id: unitId,
    issued_at: issuedAt,
    session: {
      external_session_id: session.external_session_id,
      started_at: session.started_at,
      ended_at: session.ended_at,
      energy_kwh: session.energy_kwh,
      ...(session.location ? { location: session.location } : {}),
      ...(session.vehicle_ref ? { vehicle_ref: session.vehicle_ref } : {}),
      ...(session.operator_id ? { operator_id: session.operator_id } : {}),
      source_format: session.source_format,
    },
    ...(input.attributes
      ? {
          attributes: {
            renewable_claim: input.attributes.renewable_claim ?? "unknown",
            ...(input.attributes.grid_mix_note
              ? { grid_mix_note: input.attributes.grid_mix_note }
              : {}),
            ...(input.attributes.compare_ref_id
              ? { compare_ref_id: input.attributes.compare_ref_id }
              : {}),
          },
        }
      : {}),
    auros,
    disclaimer: DISCLAIMER,
  };
}

export function chargeflowContentSha256(canonical: ChargeflowCanonical): string {
  return sha256Hex(stableStringify(canonical));
}

export { DISCLAIMER as CHARGEFLOW_DISCLAIMER };
