import { computeWattScoreFromText } from "@/lib/green/scoring/watt-score";

import type { ChargeflowCreateRequest } from "./schema";
import type { ChargeflowAurosEnrichment } from "./canonical";

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
