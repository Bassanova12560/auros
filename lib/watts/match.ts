import type {
  WattMatchReason,
  WattMatchResult,
  WattReserveRequest,
  WattSuggestedUnitKind,
} from "./types";

function parseIso(raw: string): Date | null {
  const d = new Date(raw);
  return Number.isFinite(d.getTime()) ? d : null;
}

/**
 * Deterministic matching v1 — rules only (no LLM).
 * Score starts at 50; window/zone/carbon adjust; firmness picks CFU kind.
 */
export function matchWattProfile(profile: WattReserveRequest): WattMatchResult {
  const reasons: WattMatchReason[] = [];
  const start = parseIso(profile.window.start);
  const end = parseIso(profile.window.end);

  if (!start || !end) {
    reasons.push({
      code: "invalid_window",
      detail: "start/end must be valid ISO timestamps",
      delta: 0,
    });
    return { ok: false, error: "Invalid reservation window", reasons };
  }
  if (end.getTime() <= start.getTime()) {
    reasons.push({
      code: "invalid_window_order",
      detail: "end must be after start",
      delta: 0,
    });
    return { ok: false, error: "end must be after start", reasons };
  }

  const durationHours =
    (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  if (durationHours > 168) {
    reasons.push({
      code: "window_too_long",
      detail: "Window exceeds 7 days — split into smaller profiles",
      delta: 0,
    });
    return {
      ok: false,
      error: "Reservation window must be ≤ 7 days",
      reasons,
    };
  }

  let score = 50;
  reasons.push({
    code: "base",
    detail: "Indicative base score for profile completeness",
    delta: 50,
  });

  score += 20;
  reasons.push({
    code: "valid_window",
    detail: `Valid window · ${durationHours.toFixed(1)}h`,
    delta: 20,
  });

  if (profile.zone.country.trim()) {
    score += 10;
    reasons.push({
      code: "zone_country",
      detail: `Zone country=${profile.zone.country}${profile.zone.zone_id ? ` · ${profile.zone.zone_id}` : ""}`,
      delta: 10,
    });
  }

  if (profile.zone.zone_id?.trim()) {
    score += 5;
    reasons.push({
      code: "zone_id",
      detail: "Fine-grained zone_id provided",
      delta: 5,
    });
  }

  if (profile.carbon_intensity_max_gco2_kwh != null) {
    score += 10;
    reasons.push({
      code: "carbon_cap",
      detail: `Carbon intensity cap ${profile.carbon_intensity_max_gco2_kwh} gCO₂/kWh (indicative)`,
      delta: 10,
    });
  } else {
    reasons.push({
      code: "unknown_carbon",
      detail: "No carbon_intensity_max — matching quality unknown",
      delta: 0,
    });
  }

  let suggested_unit_kind: WattSuggestedUnitKind = "e";
  if (profile.firmness === "flex") {
    suggested_unit_kind = "f";
    reasons.push({
      code: "firmness_flex",
      detail: "Flex firmness → suggest CFU-F (capacity window) on confirm",
      delta: 0,
    });
  } else {
    suggested_unit_kind = "e";
    reasons.push({
      code: "firmness_firm",
      detail: "Firm + energy_kwh → suggest CFU-E (energy session) on confirm",
      delta: 0,
    });
  }

  if (profile.energy_kwh != null && profile.energy_kwh > 0) {
    score += 5;
    reasons.push({
      code: "energy_target",
      detail: `Target energy ${profile.energy_kwh} kWh`,
      delta: 5,
    });
  }
  if (profile.capacity_kw != null && profile.capacity_kw > 0) {
    score += 5;
    reasons.push({
      code: "capacity_target",
      detail: `Target capacity ${profile.capacity_kw} kW`,
      delta: 5,
    });
  }

  score = Math.min(100, Math.max(0, Math.round(score)));

  return {
    ok: true,
    match_score: score,
    reasons,
    suggested_unit_kind,
  };
}
