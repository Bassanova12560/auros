import {
  CHARGEFLOW_STANDARD_E,
  CHARGEFLOW_STANDARD_F,
  CHARGEFLOW_STANDARD_W,
  standardForKind,
  type ChargeflowUnitKind,
} from "./constants";
import type {
  ChargeflowCreateRequest,
  ChargeflowFCreateRequest,
  ChargeflowWCreateRequest,
} from "./schema";
import { sha256Hex } from "./signing";

export type ChargeflowAurosEnrichment = {
  watt_rating?: number | null;
  watt_tier?: "high" | "mid" | "early" | null;
  energy_value_eur_indicative?: number | null;
  h2o_rating?: number | null;
  h2o_tier?: "high" | "mid" | "low" | null;
  h2o_asset_class?: string | null;
  flow_m3_indicative?: number | null;
  capacity_kw_indicative?: number | null;
  program_hint?: string | null;
};

export type ChargeflowCanonicalE = {
  v: 1;
  standard: typeof CHARGEFLOW_STANDARD_E;
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

export type ChargeflowCanonicalW = {
  v: 1;
  standard: typeof CHARGEFLOW_STANDARD_W;
  unit_id: string;
  issued_at: string;
  flow: {
    external_flow_id: string;
    started_at: string;
    ended_at: string;
    volume_m3: number;
    location?: {
      country?: string;
      site_id?: string;
      basin_id?: string;
    };
    operator_id?: string;
    source_format: string;
  };
  attributes?: {
    asset_class_hint?: string;
    compare_ref_id?: string;
    notes?: string;
  };
  auros: ChargeflowAurosEnrichment;
  disclaimer: string;
};

export type ChargeflowCanonicalF = {
  v: 1;
  standard: typeof CHARGEFLOW_STANDARD_F;
  unit_id: string;
  issued_at: string;
  window: {
    external_window_id: string;
    started_at: string;
    ended_at: string;
    capacity_kw: number;
    direction: string;
    location?: {
      country?: string;
      site_id?: string;
      asset_id?: string;
    };
    operator_id?: string;
    source_format: string;
  };
  attributes?: {
    program_hint?: string;
    compare_ref_id?: string;
    notes?: string;
  };
  auros: ChargeflowAurosEnrichment;
  disclaimer: string;
};

export type ChargeflowCanonical =
  | ChargeflowCanonicalE
  | ChargeflowCanonicalW
  | ChargeflowCanonicalF;

const DISCLAIMER_E =
  "AUROS ChargeFlow CFU-E — indicative off-chain flow registration. Not a security token, legal certificate of origin, or CPO partnership endorsement.";

const DISCLAIMER_W =
  "AUROS ChargeFlow CFU-W — indicative off-chain hydrological flow registration. Not a security token, water right title, or concession endorsement.";

const DISCLAIMER_F =
  "AUROS ChargeFlow CFU-F — indicative off-chain flexibility window registration. Not a capacity market product, balancing service contract, or CPO endorsement.";

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
): ChargeflowCanonicalE {
  const session = input.session;
  return {
    v: 1,
    standard: CHARGEFLOW_STANDARD_E,
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
    disclaimer: DISCLAIMER_E,
  };
}

export function buildChargeflowWCanonical(
  unitId: string,
  input: ChargeflowWCreateRequest,
  auros: ChargeflowAurosEnrichment,
  issuedAt: string
): ChargeflowCanonicalW {
  const flow = input.flow;
  return {
    v: 1,
    standard: CHARGEFLOW_STANDARD_W,
    unit_id: unitId,
    issued_at: issuedAt,
    flow: {
      external_flow_id: flow.external_flow_id,
      started_at: flow.started_at,
      ended_at: flow.ended_at,
      volume_m3: flow.volume_m3,
      ...(flow.location ? { location: flow.location } : {}),
      ...(flow.operator_id ? { operator_id: flow.operator_id } : {}),
      source_format: flow.source_format,
    },
    ...(input.attributes
      ? {
          attributes: {
            ...(input.attributes.asset_class_hint
              ? { asset_class_hint: input.attributes.asset_class_hint }
              : {}),
            ...(input.attributes.compare_ref_id
              ? { compare_ref_id: input.attributes.compare_ref_id }
              : {}),
            ...(input.attributes.notes ? { notes: input.attributes.notes } : {}),
          },
        }
      : {}),
    auros,
    disclaimer: DISCLAIMER_W,
  };
}

export function buildChargeflowFCanonical(
  unitId: string,
  input: ChargeflowFCreateRequest,
  auros: ChargeflowAurosEnrichment,
  issuedAt: string
): ChargeflowCanonicalF {
  const window = input.window;
  return {
    v: 1,
    standard: CHARGEFLOW_STANDARD_F,
    unit_id: unitId,
    issued_at: issuedAt,
    window: {
      external_window_id: window.external_window_id,
      started_at: window.started_at,
      ended_at: window.ended_at,
      capacity_kw: window.capacity_kw,
      direction: window.direction,
      ...(window.location ? { location: window.location } : {}),
      ...(window.operator_id ? { operator_id: window.operator_id } : {}),
      source_format: window.source_format,
    },
    ...(input.attributes
      ? {
          attributes: {
            program_hint: input.attributes.program_hint ?? "unknown",
            ...(input.attributes.compare_ref_id
              ? { compare_ref_id: input.attributes.compare_ref_id }
              : {}),
            ...(input.attributes.notes ? { notes: input.attributes.notes } : {}),
          },
        }
      : {}),
    auros,
    disclaimer: DISCLAIMER_F,
  };
}

export function chargeflowContentSha256(
  canonical: ChargeflowCanonical
): string {
  return sha256Hex(stableStringify(canonical));
}

export function disclaimerForKind(kind: ChargeflowUnitKind): string {
  if (kind === "w") return DISCLAIMER_W;
  if (kind === "f") return DISCLAIMER_F;
  return DISCLAIMER_E;
}

export {
  DISCLAIMER_E as CHARGEFLOW_DISCLAIMER,
  DISCLAIMER_W as CHARGEFLOW_W_DISCLAIMER,
  DISCLAIMER_F as CHARGEFLOW_F_DISCLAIMER,
  standardForKind,
};
