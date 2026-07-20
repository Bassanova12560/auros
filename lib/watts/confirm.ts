import {
  chargeflowPublicResponse,
  createChargeflowFUnit,
  createChargeflowUnit,
} from "@/lib/chargeflow";

import { markWattReservationConfirmed } from "./store";
import type { WattReservation } from "./types";

const OPERATOR_ID = "auros-watts-reserve";

export type WattConfirmResult =
  | {
      ok: true;
      reservation: WattReservation;
      unit: ReturnType<typeof chargeflowPublicResponse>;
    }
  | { ok: false; error: string; status: number };

/**
 * Explicit confirm → mint CFU-E or CFU-F linked via attributes.reservation_id.
 * Never called automatically from reserve.
 */
export async function confirmWattReservation(input: {
  reservation: WattReservation;
  keyHash: string;
}): Promise<WattConfirmResult> {
  const { reservation, keyHash } = input;

  if (reservation.key_hash !== keyHash) {
    return { ok: false, error: "Reservation not found", status: 404 };
  }
  if (reservation.status === "confirmed" && reservation.cfu_unit_id) {
    return {
      ok: false,
      error: `Already confirmed (${reservation.cfu_unit_id}).`,
      status: 409,
    };
  }
  if (reservation.status !== "pending_confirm") {
    return {
      ok: false,
      error: `Cannot confirm reservation in status ${reservation.status}`,
      status: 409,
    };
  }

  const profile = reservation.profile;
  const externalRef = `wr_${reservation.id}`;
  const kind = reservation.suggested_unit_kind;

  let minted:
    | Awaited<ReturnType<typeof createChargeflowUnit>>
    | Awaited<ReturnType<typeof createChargeflowFUnit>>;

  if (kind === "f") {
    const capacity = profile.capacity_kw;
    if (capacity == null || capacity <= 0) {
      return {
        ok: false,
        error: "capacity_kw required to mint CFU-F",
        status: 400,
      };
    }
    minted = await createChargeflowFUnit(keyHash, {
      window: {
        external_window_id: externalRef,
        started_at: profile.window.start,
        ended_at: profile.window.end,
        capacity_kw: capacity,
        direction: "both",
        location: {
          country: profile.zone.country,
          ...(profile.zone.zone_id ? { site_id: profile.zone.zone_id } : {}),
        },
        operator_id: OPERATOR_ID,
        source_format: "json_custom",
      },
      attributes: {
        program_hint: "demand_response",
        notes: `Watts Reserve confirm · match_score ${reservation.match_score}`,
        reservation_id: reservation.id,
      },
    });
  } else {
    const energy = profile.energy_kwh;
    if (energy == null || energy <= 0) {
      return {
        ok: false,
        error: "energy_kwh required to mint CFU-E",
        status: 400,
      };
    }
    if (energy > 10_000) {
      return {
        ok: false,
        error: "energy_kwh exceeds CFU-E mint limit (10 000). Split the profile.",
        status: 400,
      };
    }
    const carbonNote =
      profile.carbon_intensity_max_gco2_kwh != null
        ? `Carbon cap ${profile.carbon_intensity_max_gco2_kwh} gCO₂/kWh (indicative).`
        : undefined;
    minted = await createChargeflowUnit(keyHash, {
      session: {
        external_session_id: externalRef,
        started_at: profile.window.start,
        ended_at: profile.window.end,
        energy_kwh: energy,
        location: {
          country: profile.zone.country,
          ...(profile.zone.zone_id ? { site_id: profile.zone.zone_id } : {}),
        },
        operator_id: OPERATOR_ID,
        source_format: "json_custom",
      },
      attributes: {
        renewable_claim: "unknown",
        ...(carbonNote ? { grid_mix_note: carbonNote } : {}),
        reservation_id: reservation.id,
      },
    });
  }

  if ("error" in minted) {
    return { ok: false, error: minted.error, status: minted.status };
  }

  const unit = chargeflowPublicResponse(minted.record);
  const updated = await markWattReservationConfirmed({
    id: reservation.id,
    cfu_unit_id: minted.record.id,
    cfu_verify_url: minted.verify_url,
  });

  return {
    ok: true,
    reservation: updated,
    unit,
  };
}
