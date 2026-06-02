/**
 * Unified tokenization-readiness scoring for the landing widget and wizard.
 * Tier labels/colors are shared across dossier, dashboard, and wizard Step 10.
 */

export type Tier = "low" | "mid" | "high";

export type TierInfo = {
  tier: Tier;
  /** Human-readable label shown under the score number. */
  label: string;
  /** Accent color (text + dot) for the tier — matches the brand palette. */
  color: string;
};

/** Single source of truth for tier thresholds. */
export function tierFromScore(score: number): TierInfo {
  if (score >= 75) {
    return {
      tier: "high",
      label: "High tokenization potential",
      color: "#f5f5f7",
    };
  }
  if (score >= 51) {
    return {
      tier: "mid",
      label: "Good potential",
      color: "#ffffff",
    };
  }
  return {
    tier: "low",
    label: "Needs preparation",
    color: "rgba(255,255,255,0.5)",
  };
}

export function calculateScore(params: {
  assetType?: string;
  value?: number;
  country?: string;
  documents?: string[];
  objectives?: string[];
  description?: string;
}): number {
  let score = 40;
  // Asset type base score
  const typeScores: Record<string, number> = {
    real_estate: 18,
    precious_metals: 16,
    luxury_vehicle: 12,
    classic_cars: 12,
    fine_art: 10,
    wine_spirits: 10,
    watches_jewelry: 10,
    private_credit: 14,
    solar_energy: 13,
    forest: 11,
    yacht: 9,
    other: 5,
  };
  score += typeScores[params.assetType || "other"] || 5;
  // Value bonus
  if (params.value) {
    if (params.value >= 1000000) score += 12;
    else if (params.value >= 500000) score += 9;
    else if (params.value >= 200000) score += 6;
    else if (params.value >= 50000) score += 3;
  }
  // Country bonus (EU/Swiss/UK = higher compliance)
  const goodCountries = [
    "france",
    "germany",
    "switzerland",
    "luxembourg",
    "netherlands",
    "austria",
    "belgium",
    "united kingdom",
  ];
  if (
    params.country &&
    goodCountries.some((c) => params.country!.toLowerCase().includes(c))
  ) {
    score += 8;
  }
  // Documents bonus
  if (params.documents && params.documents.length > 0) {
    const hasKeyDoc = params.documents.some((d) =>
      [
        "title deed",
        "certificate of authenticity",
        "expert valuation",
        "lbma certification",
        "vehicle registration",
      ].includes(d.toLowerCase())
    );
    if (hasKeyDoc) score += 7;
    if (params.documents.length >= 3) score += 5;
    else if (params.documents.length >= 2) score += 3;
  }
  // Cap at 97
  return Math.min(score, 97);
}

/** Homepage widget: infer asset type and value from free-text description. */
export function calculateScoreFromText(text: string): number {
  const lower = text.toLowerCase();

  let assetType = "other";
  if (/villa|house|apartment|maison|immeuble|terrain/.test(lower))
    assetType = "real_estate";
  else if (/porsche|ferrari|lamborghini|car|voiture/.test(lower))
    assetType = "luxury_vehicle";
  else if (/gold|or|lingot|silver|platine|bullion/.test(lower))
    assetType = "precious_metals";
  else if (/painting|art|tableau|sculpture|basquiat/.test(lower))
    assetType = "fine_art";
  else if (/wine|vin|cave|champagne|bordeaux/.test(lower))
    assetType = "wine_spirits";
  else if (/watch|montre|patek|rolex|jewelry/.test(lower))
    assetType = "watches_jewelry";
  else if (/yacht|boat|bateau/.test(lower)) assetType = "yacht";
  else if (/forest|forêt|timber/.test(lower)) assetType = "forest";
  else if (/solar|solaire|éolien/.test(lower)) assetType = "solar_energy";
  // Try to detect value from text
  const valueMatch = lower.match(/(\d[\d,\s]*)\s*(€|eur|usd|\$|chf|£|k|m)/i);
  let value = 0;
  if (valueMatch) {
    value = parseFloat(valueMatch[1].replace(/[,\s]/g, ""));
    if (valueMatch[2].toLowerCase() === "k") value *= 1000;
    if (valueMatch[2].toLowerCase() === "m") value *= 1000000;
  }
  return calculateScore({ assetType, value, description: text });
}

/** Detect asset category slug from free-text (homepage widget). */
export function detectAssetTypeFromText(text: string): string {
  const lower = text.toLowerCase();
  if (/villa|house|apartment|maison|immeuble|terrain|immobilier/.test(lower))
    return "real_estate";
  if (/porsche|ferrari|lamborghini|car|voiture|vehicle|911/.test(lower))
    return "luxury_vehicle";
  if (/gold|or|lingot|silver|platine|bullion|precious/.test(lower))
    return "precious_metals";
  if (/painting|art|tableau|sculpture|basquiat|œuvre/.test(lower))
    return "fine_art";
  if (/wine|vin|cave|champagne|bordeaux|spirit/.test(lower))
    return "wine_spirits";
  if (/watch|montre|patek|rolex|jewelry|diamond/.test(lower))
    return "watches_jewelry";
  if (/yacht|boat|bateau/.test(lower)) return "yacht";
  if (/forest|forêt|timber/.test(lower)) return "forest";
  if (/solar|solaire|éolien|energy/.test(lower)) return "solar_energy";
  return "other";
}

/** Human-readable value band for score result UI. */
export function valueRangeLabel(valueEur: number): string {
  if (valueEur >= 1_000_000) return "€1M+";
  if (valueEur >= 500_000) return "€500K–1M";
  if (valueEur >= 200_000) return "€200K–500K";
  if (valueEur >= 50_000) return "€50K–200K";
  if (valueEur > 0) return "Under €50K";
  return "Value not detected";
}
