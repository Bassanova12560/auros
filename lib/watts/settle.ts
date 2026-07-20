import {
  chargeflowPublicResponse,
  retireChargeflowUnit,
} from "@/lib/chargeflow";

import { markWattReservationSettled } from "./store";
import type { WattReservation, WattSettleRequest } from "./types";

export type WattSettleResult =
  | {
      ok: true;
      reservation: WattReservation;
      unit: ReturnType<typeof chargeflowPublicResponse>;
      newly_retired: boolean;
    }
  | { ok: false; error: string; status: number };

/**
 * Explicit settle on delivery → retire linked CFU.
 * Never auto-called from confirm or reserve.
 */
export async function settleWattReservation(input: {
  reservation: WattReservation;
  keyHash: string;
  settle: WattSettleRequest;
}): Promise<WattSettleResult> {
  const { reservation, keyHash, settle } = input;

  if (reservation.key_hash !== keyHash) {
    return { ok: false, error: "Reservation not found", status: 404 };
  }
  if (reservation.status === "settled") {
    return {
      ok: false,
      error: `Already settled${reservation.cfu_unit_id ? ` (${reservation.cfu_unit_id})` : ""}.`,
      status: 409,
    };
  }
  if (reservation.status !== "confirmed" || !reservation.cfu_unit_id) {
    return {
      ok: false,
      error: "Only confirmed reservations with a minted CFU can be settled",
      status: 409,
    };
  }

  const reasonParts = [
    "Watts Reserve settle",
    settle.delivery_ref ? `ref=${settle.delivery_ref}` : null,
    settle.energy_kwh_delivered != null
      ? `delivered_kwh=${settle.energy_kwh_delivered}`
      : null,
    settle.capacity_kw_delivered != null
      ? `delivered_kw=${settle.capacity_kw_delivered}`
      : null,
    settle.reason?.trim() || null,
  ].filter(Boolean);
  const retireReason = reasonParts.join(" · ").slice(0, 500);

  const retired = await retireChargeflowUnit(
    reservation.cfu_unit_id,
    keyHash,
    retireReason
  );
  if ("error" in retired) {
    return { ok: false, error: retired.error, status: retired.status };
  }

  const updated = await markWattReservationSettled({
    id: reservation.id,
    delivery_ref: settle.delivery_ref ?? null,
    delivered_at: settle.delivered_at ?? new Date().toISOString(),
    energy_kwh_delivered: settle.energy_kwh_delivered ?? null,
    capacity_kw_delivered: settle.capacity_kw_delivered ?? null,
    settle_reason: settle.reason ?? null,
  });

  return {
    ok: true,
    reservation: updated,
    unit: chargeflowPublicResponse(retired.record),
    newly_retired: retired.newly_retired,
  };
}
