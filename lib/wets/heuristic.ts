import { computeWelhrFromText } from "@/lib/eau/water-legal-risk";

import {
  WETS_CRITERIA,
  WETS_WEIGHTS,
  type WetsCategory,
  type WetsCriterionScore,
} from "./constants";

/** Deterministic seed scores when AI unavailable — uses WELHR + heuristics. */
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
      input.category === "data_center_water" ? "data_center" : "water_rights",
  });

  const hasLegal = Boolean(input.legal_structure?.trim());
  const hasSite = Boolean(input.website_url?.trim());
  const lower = text.toLowerCase();

  const legal = hasLegal
    ? /spv|trust|concession|titre/.test(lower)
      ? 7
      : 5
    : 2.5;
  const hydro = Math.round((welhr.breakdown.hydric_stress / 100) * 10 * 10) / 10;
  const social =
    Math.round((welhr.breakdown.social_license / 100) * 10 * 10) / 10;
  const ops = hasSite ? (hasLegal ? 6 : 4) : 2;
  const token = /token|rwa|on-?chain|mint/.test(lower) ? 5 : 3;

  return WETS_CRITERIA.map((category) => {
    const score =
      category === "legal_legitimacy"
        ? legal
        : category === "hydrological_risk"
          ? hydro
          : category === "social_litigation_risk"
            ? social
            : category === "operational_transparency"
              ? ops
              : token;
    return {
      category,
      score,
      weight: WETS_WEIGHTS[category],
      justification:
        category === "hydrological_risk"
          ? `WELHR proxy: stress ${welhr.stress_band}${welhr.region_matched ? ` (${welhr.region_matched})` : ""}. Indicative only.`
          : category === "social_litigation_risk"
            ? `WELHR social/legal signals: ${welhr.signals.slice(0, 3).join(", ") || "none"}. Cross-check risk_events.`
            : "Heuristic draft — validate with counsel and public sources before publishing.",
      sources: input.website_url ? [input.website_url] : [],
    };
  });
}
