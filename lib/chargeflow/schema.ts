import { z } from "zod";

export const chargeflowSessionSchema = z.object({
  external_session_id: z.string().min(1).max(128),
  started_at: z.string().min(10).max(40),
  ended_at: z.string().min(10).max(40),
  energy_kwh: z.number().positive().max(10_000),
  location: z
    .object({
      country: z.string().max(64).optional(),
      site_id: z.string().max(128).optional(),
      connector_id: z.string().max(128).optional(),
    })
    .optional(),
  vehicle_ref: z.string().max(128).optional(),
  operator_id: z.string().max(128).optional(),
  source_format: z
    .enum(["ocpi", "ocpp_summary", "csv", "json_custom"])
    .default("json_custom"),
});

export const chargeflowAttributesSchema = z
  .object({
    renewable_claim: z
      .enum(["none", "go", "rec", "ppa_matched", "unknown"])
      .default("unknown"),
    grid_mix_note: z.string().max(500).optional(),
    compare_ref_id: z.string().max(64).optional(),
  })
  .optional();

export const chargeflowCreateRequestSchema = z.object({
  session: chargeflowSessionSchema,
  attributes: chargeflowAttributesSchema,
});

export const chargeflowFlowSchema = z.object({
  external_flow_id: z.string().min(1).max(128),
  started_at: z.string().min(10).max(40),
  ended_at: z.string().min(10).max(40),
  volume_m3: z.number().positive().max(1_000_000_000),
  location: z
    .object({
      country: z.string().max(64).optional(),
      site_id: z.string().max(128).optional(),
      basin_id: z.string().max(128).optional(),
    })
    .optional(),
  operator_id: z.string().max(128).optional(),
  source_format: z
    .enum(["csv", "scada_summary", "json_custom"])
    .default("json_custom"),
});

export const chargeflowWAttributesSchema = z
  .object({
    asset_class_hint: z
      .enum([
        "water_rights",
        "desalination",
        "hydro_infra",
        "blue_bond",
        "concession",
        "unknown",
      ])
      .optional(),
    compare_ref_id: z.string().max(64).optional(),
    notes: z.string().max(500).optional(),
  })
  .optional();

export const chargeflowWCreateRequestSchema = z.object({
  flow: chargeflowFlowSchema,
  attributes: chargeflowWAttributesSchema,
});

export const chargeflowRetireRequestSchema = z.object({
  reason: z.string().max(500).optional(),
});

export type ChargeflowCreateRequest = z.infer<typeof chargeflowCreateRequestSchema>;
export type ChargeflowSession = z.infer<typeof chargeflowSessionSchema>;
export type ChargeflowWCreateRequest = z.infer<
  typeof chargeflowWCreateRequestSchema
>;
export type ChargeflowFlow = z.infer<typeof chargeflowFlowSchema>;
export type ChargeflowRetireRequest = z.infer<
  typeof chargeflowRetireRequestSchema
>;
