import { z } from "zod";

export const WATTS_RESERVE_ROUTE = "/green/chargeflow/reserve";
export const WATTS_RESERVE_DISCLAIMER =
  "AUROS Watts Reserve is indicative only — not a grid delivery guarantee, GO/REC legal certificate, or investment advice. Confirm/settle operate off-chain CFU proofs — not legal certificates or delivery guarantees.";

export type WattFirmness = "firm" | "flex";
export type WattSuggestedUnitKind = "e" | "f";
export type WattReservationStatus =
  | "pending_confirm"
  | "confirmed"
  | "settled"
  | "cancelled";

export const wattReserveRequestSchema = z
  .object({
    window: z.object({
      start: z.string().min(10).max(40),
      end: z.string().min(10).max(40),
    }),
    energy_kwh: z.number().positive().max(1_000_000).optional(),
    capacity_kw: z.number().positive().max(1_000_000).optional(),
    zone: z.object({
      country: z.string().trim().min(2).max(64),
      zone_id: z.string().trim().max(128).optional(),
    }),
    carbon_intensity_max_gco2_kwh: z.number().min(0).max(2000).optional(),
    firmness: z.enum(["firm", "flex"]).default("firm"),
    buyer_ref: z.string().trim().max(128).optional(),
  })
  .superRefine((val, ctx) => {
    if (val.firmness === "flex" && val.capacity_kw == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "capacity_kw is required when firmness is flex",
        path: ["capacity_kw"],
      });
    }
    if (val.firmness === "firm" && val.energy_kwh == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "energy_kwh is required when firmness is firm",
        path: ["energy_kwh"],
      });
    }
  });

export type WattReserveRequest = z.infer<typeof wattReserveRequestSchema>;

export const wattSettleRequestSchema = z.object({
  delivery_ref: z.string().trim().max(128).optional(),
  delivered_at: z.string().min(10).max(40).optional(),
  energy_kwh_delivered: z.number().positive().max(1_000_000).optional(),
  capacity_kw_delivered: z.number().positive().max(1_000_000).optional(),
  reason: z.string().trim().max(500).optional(),
});

export type WattSettleRequest = z.infer<typeof wattSettleRequestSchema>;

export type WattMatchReason = {
  code: string;
  detail: string;
  delta: number;
};

export type WattMatchResult = {
  ok: true;
  match_score: number;
  reasons: WattMatchReason[];
  suggested_unit_kind: WattSuggestedUnitKind;
} | {
  ok: false;
  error: string;
  reasons: WattMatchReason[];
};

export type WattReservation = {
  id: string;
  key_hash: string;
  status: WattReservationStatus;
  profile: WattReserveRequest;
  match_score: number;
  match_reasons: WattMatchReason[];
  suggested_unit_kind: WattSuggestedUnitKind;
  created_at: string;
  cfu_unit_id?: string | null;
  cfu_verify_url?: string | null;
  confirmed_at?: string | null;
  settled_at?: string | null;
  delivery_ref?: string | null;
  delivered_at?: string | null;
  energy_kwh_delivered?: number | null;
  capacity_kw_delivered?: number | null;
  settle_reason?: string | null;
};

export type WattReservePublicResponse = {
  reservation_id: string;
  status: WattReservationStatus;
  match_score: number;
  match_reasons: WattMatchReason[];
  suggested_unit_kind: WattSuggestedUnitKind;
  profile: WattReserveRequest;
  created_at: string;
  disclaimer: string;
  next_step: string;
  cfu_unit_id?: string | null;
  cfu_verify_url?: string | null;
  confirmed_at?: string | null;
  settled_at?: string | null;
  delivery_ref?: string | null;
  delivered_at?: string | null;
  energy_kwh_delivered?: number | null;
  capacity_kw_delivered?: number | null;
  settle_reason?: string | null;
};
