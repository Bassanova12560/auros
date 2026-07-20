import type {
  WattCapacityOffer,
  WattCapacityOfferPublic,
  WattMatchReason,
  WattReserveRequest,
} from "./types";
import { WATTS_RESERVE_DISCLAIMER } from "./types";

function parseIso(raw: string): Date | null {
  const d = new Date(raw);
  return Number.isFinite(d.getTime()) ? d : null;
}

function overlapHours(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
): number {
  const start = Math.max(aStart.getTime(), bStart.getTime());
  const end = Math.min(aEnd.getTime(), bEnd.getTime());
  if (end <= start) return 0;
  return (end - start) / (1000 * 60 * 60);
}

export function wattOfferPublic(
  offer: WattCapacityOffer
): WattCapacityOfferPublic {
  return {
    offer_id: offer.id,
    status: offer.status,
    window: offer.window,
    capacity_kw: offer.capacity_kw,
    energy_kwh: offer.energy_kwh,
    zone: offer.zone,
    carbon_intensity_gco2_kwh: offer.carbon_intensity_gco2_kwh,
    firmness: offer.firmness,
    producer_ref: offer.producer_ref,
    label: offer.label,
    created_at: offer.created_at,
    disclaimer: WATTS_RESERVE_DISCLAIMER,
  };
}

/**
 * Deterministic buyer profile × producer offer score (rules only).
 * Base 40; overlap / zone / carbon / firmness / volume adjust.
 */
export function matchProfileToOffer(
  profile: WattReserveRequest,
  offer: WattCapacityOffer
): { match_score: number; reasons: WattMatchReason[] } {
  const reasons: WattMatchReason[] = [];
  let score = 40;
  reasons.push({
    code: "base",
    detail: "Indicative inventory match base",
    delta: 40,
  });

  if (offer.status !== "open") {
    reasons.push({
      code: "not_open",
      detail: "Offer is not open",
      delta: 0,
    });
    return { match_score: 0, reasons };
  }

  const pStart = parseIso(profile.window.start);
  const pEnd = parseIso(profile.window.end);
  const oStart = parseIso(offer.window.start);
  const oEnd = parseIso(offer.window.end);
  if (!pStart || !pEnd || !oStart || !oEnd) {
    reasons.push({
      code: "invalid_window",
      detail: "Invalid window timestamps",
      delta: 0,
    });
    return { match_score: 0, reasons };
  }

  const hours = overlapHours(pStart, pEnd, oStart, oEnd);
  if (hours <= 0) {
    reasons.push({
      code: "no_overlap",
      detail: "No time-window overlap",
      delta: 0,
    });
    return { match_score: Math.min(25, score), reasons };
  }

  const overlapDelta = Math.min(25, Math.round(8 + hours * 2));
  score += overlapDelta;
  reasons.push({
    code: "window_overlap",
    detail: `Overlap ${hours.toFixed(1)}h`,
    delta: overlapDelta,
  });

  if (
    profile.zone.country.trim().toUpperCase() ===
    offer.zone.country.trim().toUpperCase()
  ) {
    score += 15;
    reasons.push({
      code: "country_match",
      detail: `Country ${offer.zone.country}`,
      delta: 15,
    });
  } else {
    reasons.push({
      code: "country_mismatch",
      detail: `Buyer ${profile.zone.country} ≠ offer ${offer.zone.country}`,
      delta: 0,
    });
  }

  if (
    profile.zone.zone_id?.trim() &&
    offer.zone.zone_id?.trim() &&
    profile.zone.zone_id.trim().toUpperCase() ===
      offer.zone.zone_id.trim().toUpperCase()
  ) {
    score += 10;
    reasons.push({
      code: "zone_id_match",
      detail: `Zone ${offer.zone.zone_id}`,
      delta: 10,
    });
  }

  if (profile.firmness === offer.firmness) {
    score += 10;
    reasons.push({
      code: "firmness_match",
      detail: `Firmness ${offer.firmness}`,
      delta: 10,
    });
  } else {
    reasons.push({
      code: "firmness_mismatch",
      detail: `Buyer ${profile.firmness} ≠ offer ${offer.firmness}`,
      delta: 0,
    });
  }

  if (
    profile.carbon_intensity_max_gco2_kwh != null &&
    offer.carbon_intensity_gco2_kwh != null
  ) {
    if (
      offer.carbon_intensity_gco2_kwh <= profile.carbon_intensity_max_gco2_kwh
    ) {
      score += 10;
      reasons.push({
        code: "carbon_ok",
        detail: `Offer ${offer.carbon_intensity_gco2_kwh} ≤ cap ${profile.carbon_intensity_max_gco2_kwh} gCO₂/kWh`,
        delta: 10,
      });
    } else {
      score -= 15;
      reasons.push({
        code: "carbon_over",
        detail: `Offer ${offer.carbon_intensity_gco2_kwh} > cap ${profile.carbon_intensity_max_gco2_kwh}`,
        delta: -15,
      });
    }
  } else {
    reasons.push({
      code: "carbon_unknown",
      detail: "Carbon intensity not fully specified",
      delta: 0,
    });
  }

  if (
    profile.firmness === "firm" &&
    profile.energy_kwh != null &&
    offer.energy_kwh != null &&
    offer.energy_kwh >= profile.energy_kwh
  ) {
    score += 5;
    reasons.push({
      code: "energy_cover",
      detail: `Offer ${offer.energy_kwh} kWh covers target`,
      delta: 5,
    });
  }
  if (
    profile.firmness === "flex" &&
    profile.capacity_kw != null &&
    offer.capacity_kw != null &&
    offer.capacity_kw >= profile.capacity_kw
  ) {
    score += 5;
    reasons.push({
      code: "capacity_cover",
      detail: `Offer ${offer.capacity_kw} kW covers target`,
      delta: 5,
    });
  }

  return {
    match_score: Math.min(100, Math.max(0, Math.round(score))),
    reasons,
  };
}

export function rankOffersForProfile(
  profile: WattReserveRequest,
  offers: WattCapacityOffer[],
  limit = 10
): Array<{
  offer: WattCapacityOffer;
  match_score: number;
  reasons: WattMatchReason[];
}> {
  return offers
    .filter((o) => o.status === "open")
    .map((offer) => {
      const m = matchProfileToOffer(profile, offer);
      return { offer, match_score: m.match_score, reasons: m.reasons };
    })
    .filter((m) => m.match_score > 0 && !m.reasons.some((r) => r.code === "no_overlap"))
    .sort((a, b) => b.match_score - a.match_score)
    .slice(0, limit);
}
