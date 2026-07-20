import {
  WATTS_RESERVE_DISCLAIMER,
  type WattReservation,
  type WattReservePublicResponse,
} from "./types";

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
    next_step:
      "Step 2 (not yet live): POST confirm will mint CFU-E or CFU-F linked to this reservation_id — human/ops confirm only.",
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
export { insertWattReservation, getWattReservation } from "./store";
