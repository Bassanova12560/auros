import { z } from "zod";

import { generationSourceSchema } from "@/lib/power/generation-source";

export const WATTS_RESERVE_ROUTE = "/green/chargeflow/reserve";
export const WATTS_INVENTORY_ROUTE = "/green/chargeflow/inventory";
export const WATTS_SECONDARY_ROUTE = "/green/chargeflow/secondary";
export const WATTS_HUB_ROUTE = "/green/watts";
export const WATTS_RESERVE_DISCLAIMER =
  "AUROS Watts Reserve is indicative only — not a grid delivery guarantee, GO/REC legal certificate, or investment advice. Confirm/settle operate off-chain CFU proofs — not legal certificates or delivery guarantees. Capacity offers and secondary listings are indicative — not binding PPAs, securities, or a regulated exchange.";

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
    generation_source: generationSourceSchema.optional(),
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

/** Étape 4 — producer capacity inventory */
export type WattOfferStatus = "open" | "withdrawn";

export const wattCapacityOfferRequestSchema = z
  .object({
    window: z.object({
      start: z.string().min(10).max(40),
      end: z.string().min(10).max(40),
    }),
    capacity_kw: z.number().positive().max(1_000_000).optional(),
    energy_kwh: z.number().positive().max(1_000_000).optional(),
    zone: z.object({
      country: z.string().trim().min(2).max(64),
      zone_id: z.string().trim().max(128).optional(),
    }),
    carbon_intensity_gco2_kwh: z.number().min(0).max(2000).optional(),
    firmness: z.enum(["firm", "flex"]).default("flex"),
    producer_ref: z.string().trim().max(128).optional(),
    label: z.string().trim().max(120).optional(),
    generation_source: generationSourceSchema.optional(),
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

export type WattCapacityOfferRequest = z.infer<
  typeof wattCapacityOfferRequestSchema
>;

export type WattCapacityOffer = {
  id: string;
  key_hash: string;
  status: WattOfferStatus;
  window: { start: string; end: string };
  capacity_kw: number | null;
  energy_kwh: number | null;
  zone: { country: string; zone_id?: string };
  carbon_intensity_gco2_kwh: number | null;
  firmness: WattFirmness;
  producer_ref: string | null;
  label: string | null;
  generation_source?: string | null;
  created_at: string;
  withdrawn_at: string | null;
};

export type WattCapacityOfferPublic = {
  offer_id: string;
  status: WattOfferStatus;
  window: { start: string; end: string };
  capacity_kw: number | null;
  energy_kwh: number | null;
  zone: { country: string; zone_id?: string };
  carbon_intensity_gco2_kwh: number | null;
  firmness: WattFirmness;
  producer_ref: string | null;
  label: string | null;
  generation_source?: string | null;
  created_at: string;
  disclaimer: string;
};

export type WattOfferMatch = {
  offer_id: string;
  match_score: number;
  match_reasons: WattMatchReason[];
  offer: WattCapacityOfferPublic;
};

/** Étape 5 — secondary listing + RWA prep hook */
export type WattSecondaryStatus = "open" | "withdrawn" | "closed";

export const wattSecondaryListingRequestSchema = z
  .object({
    reservation_id: z.string().uuid().optional(),
    indicative_price_eur: z.number().positive().max(100_000_000),
    compare_ref_id: z.string().trim().max(64).optional(),
    label: z.string().trim().max(120).optional(),
    note: z.string().trim().max(500).optional(),
    energy_kwh: z.number().positive().max(1_000_000).optional(),
    capacity_kw: z.number().positive().max(1_000_000).optional(),
    zone: z
      .object({
        country: z.string().trim().min(2).max(64),
        zone_id: z.string().trim().max(128).optional(),
      })
      .optional(),
    firmness: z.enum(["firm", "flex"]).optional(),
    cfu_unit_id: z.string().trim().max(128).optional(),
    generation_source: generationSourceSchema.optional(),
    cfu_verify_url: z.string().url().max(500).optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.reservation_id) {
      if (!val.zone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "zone is required when reservation_id is omitted",
          path: ["zone"],
        });
      }
      if (val.energy_kwh == null && val.capacity_kw == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "energy_kwh or capacity_kw required without reservation_id",
          path: ["energy_kwh"],
        });
      }
    }
  });

export type WattSecondaryListingRequest = z.infer<
  typeof wattSecondaryListingRequestSchema
>;

export type WattSecondaryListing = {
  id: string;
  key_hash: string;
  status: WattSecondaryStatus;
  reservation_id: string | null;
  cfu_unit_id: string | null;
  cfu_verify_url: string | null;
  indicative_price_eur: number;
  compare_ref_id: string | null;
  label: string | null;
  note: string | null;
  energy_kwh: number | null;
  capacity_kw: number | null;
  zone: { country: string; zone_id?: string };
  firmness: WattFirmness;
  interest_count: number;
  created_at: string;
  withdrawn_at: string | null;
};

export type WattSecondaryListingPublic = {
  listing_id: string;
  status: WattSecondaryStatus;
  reservation_id: string | null;
  cfu_unit_id: string | null;
  cfu_verify_url: string | null;
  indicative_price_eur: number;
  compare_ref_id: string | null;
  compare_url: string | null;
  label: string | null;
  note: string | null;
  energy_kwh: number | null;
  capacity_kw: number | null;
  zone: { country: string; zone_id?: string };
  firmness: WattFirmness;
  interest_count: number;
  created_at: string;
  rwa_hint: string;
  disclaimer: string;
};

export const wattSecondaryInterestRequestSchema = z.object({
  buyer_ref: z.string().trim().max(128).optional(),
  note: z.string().trim().max(500).optional(),
});

export type WattSecondaryInterestRequest = z.infer<
  typeof wattSecondaryInterestRequestSchema
>;
