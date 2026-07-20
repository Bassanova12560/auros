import {
  WATTS_RESERVE_DISCLAIMER,
  type WattReservation,
  type WattReservePublicResponse,
} from "./types";

export function wattReservePublicResponse(
  row: WattReservation
): WattReservePublicResponse {
  const pending = row.status === "pending_confirm";
  return {
    reservation_id: row.id,
    status: row.status,
    match_score: row.match_score,
    match_reasons: row.match_reasons,
    suggested_unit_kind: row.suggested_unit_kind,
    profile: row.profile,
    created_at: row.created_at,
    disclaimer: WATTS_RESERVE_DISCLAIMER,
    next_step: pending
      ? `POST /api/v1/watts/reserve/${row.id}/confirm to mint CFU-${row.suggested_unit_kind.toUpperCase()} linked to this reservation (explicit confirm only).`
      : row.cfu_verify_url
        ? `CFU minted — verify at ${row.cfu_verify_url}. Settlement/retire is étape 3.`
        : "Confirmed. Settlement/retire is étape 3.",
    cfu_unit_id: row.cfu_unit_id ?? null,
    cfu_verify_url: row.cfu_verify_url ?? null,
    confirmed_at: row.confirmed_at ?? null,
  };
}

export {
  WATTS_RESERVE_ROUTE,
  WATTS_RESERVE_DISCLAIMER,
  wattReserveRequestSchema,
  type WattReserveRequest,
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
} from "./store";
export { confirmWattReservation } from "./confirm";
