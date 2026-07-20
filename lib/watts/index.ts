import {
  WATTS_RESERVE_DISCLAIMER,
  type WattReservation,
  type WattReservePublicResponse,
} from "./types";

function nextStepFor(row: WattReservation): string {
  switch (row.status) {
    case "pending_confirm":
      return `POST /api/v1/watts/reserve/${row.id}/confirm to mint CFU-${row.suggested_unit_kind.toUpperCase()} linked to this reservation (explicit confirm only).`;
    case "confirmed":
      return `POST /api/v1/watts/reserve/${row.id}/settle when delivered — retires the linked CFU (explicit settle only).`;
    case "settled":
      return "Settled — CFU retired. Producer inventory (étape 4) is next on the roadmap.";
    case "cancelled":
      return "Reservation cancelled.";
    default:
      return "See docs/WATTS-RESERVE.md";
  }
}

export function wattReservePublicResponse(
  row: WattReservation
): WattReservePublicResponse {
  return {
    reservation_id: row.id,
    status: row.status,
    match_score: row.match_score,
    match_reasons: row.match_reasons,
    suggested_unit_kind: row.suggested_unit_kind,
    profile: row.profile,
    created_at: row.created_at,
    disclaimer: WATTS_RESERVE_DISCLAIMER,
    next_step: nextStepFor(row),
    cfu_unit_id: row.cfu_unit_id ?? null,
    cfu_verify_url: row.cfu_verify_url ?? null,
    confirmed_at: row.confirmed_at ?? null,
    settled_at: row.settled_at ?? null,
    delivery_ref: row.delivery_ref ?? null,
    delivered_at: row.delivered_at ?? null,
    energy_kwh_delivered: row.energy_kwh_delivered ?? null,
    capacity_kw_delivered: row.capacity_kw_delivered ?? null,
    settle_reason: row.settle_reason ?? null,
  };
}

export {
  WATTS_RESERVE_ROUTE,
  WATTS_RESERVE_DISCLAIMER,
  wattReserveRequestSchema,
  wattSettleRequestSchema,
  type WattReserveRequest,
  type WattSettleRequest,
  type WattReservation,
  type WattReservePublicResponse,
  type WattMatchResult,
  type WattMatchReason,
} from "./types";
export { matchWattProfile } from "./match";
export {
  insertWattReservation,
  getWattReservation,
  markWattReservationConfirmed,
  markWattReservationSettled,
} from "./store";
export { confirmWattReservation } from "./confirm";
export { settleWattReservation } from "./settle";
