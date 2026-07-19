import { computeH2oScoreFromText } from "@/lib/green/scoring/h2o-score";
import { computeWattScoreFromText } from "@/lib/green/scoring/watt-score";

import type { ChargeflowAurosEnrichment } from "./canonical";
import type {
  ChargeflowCreateRequest,
  ChargeflowWCreateRequest,
} from "./schema";

/** Build Watt companion from session context (indicative, not meter truth). */
export function enrichChargeflowWithWatt(
  input: ChargeflowCreateRequest
): ChargeflowAurosEnrichment {
  const claim = input.attributes?.renewable_claim ?? "unknown";
  const country = input.session.location?.country ?? "";
  const text = [
    "EV charging session renewable kWh",
    `${input.session.energy_kwh} kWh`,
    claim === "go" || claim === "rec" || claim === "ppa_matched"
      ? "guarantee of origin renewable certified"
      : "grid charge",
    country,
    input.session.operator_id ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const watt = computeWattScoreFromText(text, { country: country || undefined });
  const priceEurPerKwh = 0.2;
  const energyValue = Math.round(input.session.energy_kwh * priceEurPerKwh);

  if (!watt) {
    const rating = Math.max(
      25,
      Math.min(85, Math.round(40 + Math.log10(input.session.energy_kwh + 1) * 15))
    );
    return {
      watt_rating: rating,
      watt_tier: rating >= 70 ? "high" : rating >= 45 ? "mid" : "early",
      energy_value_eur_indicative: energyValue,
    };
  }

  return {
    watt_rating: watt.rating,
    watt_tier: watt.tier,
    energy_value_eur_indicative: energyValue,
  };
}

/** Build H₂O companion from flow context (indicative). */
export function enrichChargeflowWithH2o(
  input: ChargeflowWCreateRequest
): ChargeflowAurosEnrichment {
  const country = input.flow.location?.country ?? "";
  const hint = input.attributes?.asset_class_hint ?? "unknown";
  const text = [
    "hydrological water flow m³ concession",
    `${input.flow.volume_m3} m³`,
    hint !== "unknown" ? hint.replace(/_/g, " ") : "water rights",
    country,
    input.flow.operator_id ?? "",
    input.attributes?.notes ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const h2o = computeH2oScoreFromText(text);
  if (!h2o) {
    const rating = Math.max(
      30,
      Math.min(80, Math.round(35 + Math.log10(input.flow.volume_m3 + 1) * 8))
    );
    return {
      h2o_rating: rating,
      h2o_tier: rating >= 70 ? "high" : rating >= 50 ? "mid" : "low",
      h2o_asset_class: hint,
      flow_m3_indicative: input.flow.volume_m3,
    };
  }

  return {
    h2o_rating: h2o.rating,
    h2o_tier: h2o.tier,
    h2o_asset_class: h2o.asset_class,
    flow_m3_indicative: input.flow.volume_m3,
  };
}
