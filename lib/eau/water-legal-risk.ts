/**
 * Water / Energy Legal & Hydrological Risk (WELHR) — indicative due-diligence
 * layer for RWA water, cooling, data-center, and hydro assets.
 *
 * Not a legal opinion. Curated stress bands + text signals (litigation /
 * moratorium / social license). Full PACER/WRI feeds come later.
 */

export type WelhrStressBand = "extreme" | "high" | "medium" | "low" | "unknown";

export type WelhrBreakdown = {
  hydric_stress: number;
  legal_litigation: number;
  social_license: number;
  water_rights_clarity: number;
};

export type WelhrPriority =
  | "map_water_rights"
  | "check_local_moratorium"
  | "litigation_screen"
  | "community_engagement"
  | "cooling_water_contract"
  | "stress_zone_disclosure";

export type WelhrResult = {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  risk_tier: "elevated" | "moderate" | "contained";
  stress_band: WelhrStressBand;
  region_matched: string | null;
  breakdown: WelhrBreakdown;
  priorities: WelhrPriority[];
  signals: string[];
  disclaimer: string;
};

/** Curated hydric-stress proxies (WRI Aqueduct-class bands — indicative). */
const REGION_STRESS: Array<{
  keys: RegExp;
  label: string;
  band: WelhrStressBand;
  score: number;
}> = [
  {
    keys: /\b(arizona|phoenix|tucson|nevada|las\s*vegas|new\s*mexico|utah)\b/i,
    label: "US Southwest (arid)",
    band: "extreme",
    score: 18,
  },
  {
    keys: /\b(california|texas|colorado\s*river|basin\s*states?)\b/i,
    label: "US West / Colorado basin",
    band: "high",
    score: 28,
  },
  {
    keys: /\b(michigan|ohio|georgia|virginia|north\s*carolina|oregon|washington)\b/i,
    label: "US data-center corridor",
    band: "medium",
    score: 48,
  },
  {
    keys: /\b(spain|espagne|andalusia|andalousie|murcia|portugal|greece|gr[eè]ce|italy|italie|sicily)\b/i,
    label: "Southern EU water stress",
    band: "high",
    score: 32,
  },
  {
    keys: /\b(france|paris|lyon|idf|île-de-france|ile-de-france|belgium|belgique|netherlands|pays-bas)\b/i,
    label: "NW Europe",
    band: "medium",
    score: 58,
  },
  {
    keys: /\b(nordic|sweden|su[eè]de|norway|norv[eè]ge|finland|finlande|quebec|qu[eé]bec|ontario)\b/i,
    label: "Cool / high-water regions",
    band: "low",
    score: 78,
  },
  {
    keys: /\b(chile|chili|atacama|middle\s*east|golfe|uae|saudi|mena|cape\s*town)\b/i,
    label: "High-stress arid markets",
    band: "extreme",
    score: 15,
  },
];

const DISCLAIMER =
  "AUROS WELHR — indicative hydrological & local-legal risk screen. Not a legal opinion, water-right title, or insurance. Counsel and local utility contracts required.";

function gradeFromScore(score: number): WelhrResult["grade"] {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 50) return "C";
  if (score >= 35) return "D";
  return "F";
}

function riskTier(score: number): WelhrResult["risk_tier"] {
  if (score < 45) return "elevated";
  if (score < 65) return "moderate";
  return "contained";
}

function matchRegion(text: string): {
  label: string | null;
  band: WelhrStressBand;
  score: number;
} {
  for (const row of REGION_STRESS) {
    if (row.keys.test(text)) {
      return { label: row.label, band: row.band, score: row.score };
    }
  }
  return { label: null, band: "unknown", score: 45 };
}

/**
 * Higher = lower risk (bank-friendly). 0–100.
 */
export function computeWelhrFromText(input: {
  text: string;
  region?: string;
  asset_hint?: "data_center" | "water_rights" | "energy" | "cooling" | "other";
}): WelhrResult {
  const text = `${input.region ?? ""} ${input.text}`.trim();
  const lower = text.toLowerCase();
  const signals: string[] = [];
  const priorities: WelhrPriority[] = [];

  const region = matchRegion(text);
  let hydric = region.score;
  if (region.label) signals.push(`stress_band:${region.band}·${region.label}`);

  // Explicit stress language
  if (/water\s*stress|stress\s*hydrique|arid|drought|s[eé]cheresse|scarce\s*water/.test(lower)) {
    hydric = Math.min(hydric, 22);
    signals.push("explicit_water_stress");
  }
  if (/aqueduct|wri|usgs|epa\s*water/.test(lower)) {
    hydric = Math.min(100, hydric + 8);
    signals.push("stress_data_cited");
  }

  // Legal / litigation
  let legal = 62;
  if (/moratorium|moratoire|rezoning|zoning\s*block|county\s*block|blocked\s*by\s*county/.test(lower)) {
    legal -= 28;
    signals.push("moratorium_or_rezoning");
    priorities.push("check_local_moratorium");
  }
  if (
    /clean\s*water\s*act|litigation|lawsuit|poursuite|contentieux|injunction|epa\s*violation/.test(
      lower
    )
  ) {
    legal -= 24;
    signals.push("litigation_signal");
    priorities.push("litigation_screen");
  }
  if (/permit\s*denied|refus\s*de\s*permis|utility\s*refusal|contrat\s*d.eau\s*refus/.test(lower)) {
    legal -= 18;
    signals.push("permit_or_contract_refusal");
  }
  if (/water\s*board|conseil\s*de\s*l.eau|local\s*authority\s*approval|contrat\s*d.eau\s*sign/.test(lower)) {
    legal += 12;
    signals.push("local_water_authority_path");
  }
  if (/counsel|avocat|legal\s*opinion|avis\s*juridique/.test(lower)) {
    legal += 6;
    signals.push("counsel_mentioned");
  }
  legal = Math.max(0, Math.min(100, legal));

  // Social license
  let social = 58;
  if (
    /community\s*opposition|opposition\s*locale|nimby|protest|riverkeeper|petition|chute\s*de\s*valeur|property\s*value/.test(
      lower
    )
  ) {
    social -= 26;
    signals.push("community_opposition");
    priorities.push("community_engagement");
  }
  if (/public\s*hearing|consultation\s*publique|mou|community\s*benefit|accord\s*local/.test(lower)) {
    social += 14;
    signals.push("engagement_process");
  }
  if (/data\s*center|datacenter|hyperscale|ai\s*campus|gpu\s*cluster|refroidissement|cooling\s*tower/.test(lower)) {
    social -= 8;
    signals.push("data_center_cooling_profile");
    priorities.push("cooling_water_contract");
  }
  if (input.asset_hint === "data_center" || input.asset_hint === "cooling") {
    social -= 6;
    priorities.push("cooling_water_contract");
  }
  social = Math.max(0, Math.min(100, social));

  // Water rights clarity
  let rights = 48;
  if (/titre|title|concession|water\s*right|droits?\s+d.eau|allocation|affermage|d[eé]cret/.test(lower)) {
    rights += 22;
    signals.push("rights_instrument_cited");
  } else {
    priorities.push("map_water_rights");
  }
  if (/audit\s*hydrolog|hydrological\s*audit|bilan\s*eau|metered\s*flow/.test(lower)) {
    rights += 14;
    signals.push("hydro_audit");
  }
  if (/spv|special\s*purpose/.test(lower)) rights += 6;
  rights = Math.max(0, Math.min(100, rights));

  if (region.band === "extreme" || region.band === "high") {
    priorities.push("stress_zone_disclosure");
  }

  const breakdown: WelhrBreakdown = {
    hydric_stress: Math.round(hydric),
    legal_litigation: Math.round(legal),
    social_license: Math.round(social),
    water_rights_clarity: Math.round(rights),
  };

  // Weights: stress + legal dominate for fund DD
  const score = Math.round(
    breakdown.hydric_stress * 0.3 +
      breakdown.legal_litigation * 0.3 +
      breakdown.social_license * 0.2 +
      breakdown.water_rights_clarity * 0.2
  );

  const uniqPriorities = [...new Set(priorities)].slice(0, 3);
  if (uniqPriorities.length === 0) {
    uniqPriorities.push("stress_zone_disclosure");
  }

  return {
    score,
    grade: gradeFromScore(score),
    risk_tier: riskTier(score),
    stress_band: region.band,
    region_matched: region.label,
    breakdown,
    priorities: uniqPriorities,
    signals: signals.slice(0, 12),
    disclaimer: DISCLAIMER,
  };
}
