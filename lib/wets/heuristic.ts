import { computeWelhrFromText } from "@/lib/eau/water-legal-risk";

import {
  WETS_CRITERIA,
  WETS_CRITERION_HINTS,
  isEnergyHeavyCategory,
  weightsForCategory,
  type WetsCategory,
  type WetsCriterion,
  type WetsCriterionScore,
} from "./constants";

/** Deterministic seed scores when AI unavailable — WELHR + grid + PQC heuristics. */
export function heuristicWetsCriteria(input: {
  name: string;
  description?: string | null;
  jurisdiction?: string | null;
  legal_structure?: string | null;
  website_url?: string | null;
  category: WetsCategory;
}): WetsCriterionScore[] {
  const text = [
    input.name,
    input.description ?? "",
    input.jurisdiction ?? "",
    input.legal_structure ?? "",
  ].join(" ");
  const welhr = computeWelhrFromText({
    text,
    region: input.jurisdiction ?? undefined,
    asset_hint:
      input.category === "data_center_water"
        ? "data_center"
        : input.category.startsWith("energy")
          ? "energy"
          : "water_rights",
  });

  const hasLegal = Boolean(input.legal_structure?.trim());
  const hasSite = Boolean(input.website_url?.trim());
  const lower = text.toLowerCase();
  const weights = weightsForCategory(input.category);

  const legal = hasLegal
    ? /spv|trust|concession|titre|transfer\s*agent|registrar/.test(lower)
      ? 7
      : 5
    : 2.5;
  const hydro = Math.round((welhr.breakdown.hydric_stress / 100) * 10 * 10) / 10;
  const social =
    Math.round((welhr.breakdown.social_license / 100) * 10 * 10) / 10;
  const ops = hasSite ? (hasLegal ? 6 : 4) : 2;
  const token = /token|rwa|on-?chain|mint/.test(lower) ? 5 : 3;

  // Grid interconnection realism
  let grid = 3;
  if (
    /behind[\s-]?the[\s-]?meter|microgrid|on[\s-]?site|smr|solar\+?battery|batterie\s*sur\s*site/.test(
      lower
    ) ||
    input.category === "energy_microgrid"
  ) {
    grid = 7.5;
  } else if (
    /interconnection\s*(agreement|queue)|isa\s*signed|permis\s*obtenu|queue\s*position|cod\s*\d{4}/.test(
      lower
    )
  ) {
    grid = 6.5;
  } else if (
    /pending\s*interconnection|queue\s*wait|3[\s-]?5\s*years|en\s*attente\s*de\s*raccord/.test(
      lower
    )
  ) {
    grid = 2;
  } else if (!isEnergyHeavyCategory(input.category)) {
    grid = 5; // neutral for pure water
  }

  // Post-quantum legal recourse — severe default
  let pqc = 2.5;
  if (
    /off[\s-]?chain\s*register|transfer\s*agent|registrar|re[\s-]?issu|freeze|gel\s*du\s*token|token\s*=\s*claim|rescission|recovery/.test(
      lower
    )
  ) {
    pqc = 6.5;
  }
  if (/pqc|post[\s-]?quantum|reseal|crypto\s*agility|hybrid_pqc/.test(lower)) {
    pqc = Math.min(10, pqc + 2);
  }
  if (/token\s*=\s*title|bearer|possession\s*=\s*property/.test(lower)) {
    pqc = Math.min(pqc, 2);
  }

  const scoreMap: Record<WetsCriterion, number> = {
    legal_legitimacy: legal,
    hydrological_risk: hydro,
    social_litigation_risk: social,
    grid_interconnection_realism: grid,
    operational_transparency: ops,
    token_economics: token,
    post_quantum_legal_recourse: pqc,
  };

  return WETS_CRITERIA.map((category) => ({
    category,
    score: scoreMap[category],
    weight: weights[category],
    justification:
      category === "hydrological_risk"
        ? `WELHR proxy: stress ${welhr.stress_band}${welhr.region_matched ? ` (${welhr.region_matched})` : ""}. Indicative only.`
        : category === "social_litigation_risk"
          ? `WELHR social/legal signals: ${welhr.signals.slice(0, 3).join(", ") || "none"}. Cross-check risk_events.`
          : category === "grid_interconnection_realism"
            ? WETS_CRITERION_HINTS.grid_interconnection_realism
            : category === "post_quantum_legal_recourse"
              ? "Default sceptique sans recours off-chain documenté. Valider les 4 questions PQC avant publish."
              : "Heuristic draft — validate with counsel and public sources before publishing.",
    sources: input.website_url ? [input.website_url] : [],
  }));
}
