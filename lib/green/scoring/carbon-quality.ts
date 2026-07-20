import type { GreenCompareRow } from "../compare-data";
import type { WizardData } from "@/lib/wizard-types";

import {
  GREEN_CARBON_PROFILES,
  type CarbonQualityProfile,
  type CarbonQualitySignal,
  type CarbonRegistry,
} from "./carbon-profiles";

export type CarbonQualityScore = {
  score: number;
  tier: "premium" | "acceptable" | "caution" | "avoid";
  /** Max 3 improvement signals (UX psychology). */
  priority_keys: CarbonQualityPriorityKey[];
  registry: CarbonRegistry;
  ccp_aligned: boolean | "partial" | "unknown";
};

export type CarbonQualityPriorityKey =
  | "ccp_alignment"
  | "registry_retirement"
  | "additionality"
  | "permanence"
  | "vintage_risk"
  | "on_chain_only";

const REGISTRY_POINTS: Record<CarbonRegistry, number> = {
  gold_standard: 22,
  verra: 20,
  puro: 18,
  mixed: 12,
  other: 10,
  unknown: 6,
  none: 0,
};

const SIGNAL_POINTS: Record<CarbonQualitySignal, number> = {
  strong: 18,
  moderate: 11,
  weak: 4,
  unknown: 7,
};

function tierFromScore(score: number): CarbonQualityScore["tier"] {
  if (score >= 75) return "premium";
  if (score >= 60) return "acceptable";
  if (score >= 45) return "caution";
  return "avoid";
}

function ccpPoints(aligned: CarbonQualityProfile["ccp_aligned"]): number {
  if (aligned === true) return 25;
  if (aligned === "partial") return 14;
  if (aligned === "unknown") return 8;
  return 0;
}

function vintagePoints(risk: CarbonQualityProfile["vintage_risk"]): number {
  if (risk === "low") return 10;
  if (risk === "medium") return 6;
  return 2;
}

function buildPriorities(
  profile: CarbonQualityProfile,
  score: number
): CarbonQualityPriorityKey[] {
  const keys: CarbonQualityPriorityKey[] = [];
  if (profile.ccp_aligned !== true) keys.push("ccp_alignment");
  if (profile.registry === "mixed" || profile.registry === "unknown")
    keys.push("registry_retirement");
  if (profile.additionality === "weak" || profile.additionality === "unknown")
    keys.push("additionality");
  if (profile.permanence === "weak") keys.push("permanence");
  if (profile.vintage_risk === "high") keys.push("vintage_risk");
  if (profile.on_chain_wrapper) keys.push("on_chain_only");
  if (keys.length === 0 && score < 75) keys.push("ccp_alignment");
  return keys.slice(0, 3);
}

export function computeCarbonQualityFromProfile(
  profile: CarbonQualityProfile
): CarbonQualityScore {
  let score =
    REGISTRY_POINTS[profile.registry] +
    ccpPoints(profile.ccp_aligned) +
    SIGNAL_POINTS[profile.additionality] +
    SIGNAL_POINTS[profile.permanence] +
    vintagePoints(profile.vintage_risk);

  if (profile.on_chain_wrapper && profile.registry !== "gold_standard") {
    score -= 8;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));

  return {
    score,
    tier: tierFromScore(score),
    priority_keys: buildPriorities(profile, score),
    registry: profile.registry,
    ccp_aligned: profile.ccp_aligned,
  };
}

export function inferCarbonProfileFromText(text: string): CarbonQualityProfile {
  const t = text.toLowerCase();
  const registry: CarbonRegistry = /gold standard|gs4gg/.test(t)
    ? "gold_standard"
    : /verra|vcs/.test(t)
      ? "verra"
      : /puro\.earth|puro/.test(t)
        ? "puro"
        : /registre|registry|retired|retirement/.test(t)
          ? "mixed"
          : "unknown";

  return {
    registry,
    ccp_aligned: /ccp|icvcm|core carbon/.test(t)
      ? true
      : /partial|transition/.test(t)
        ? "partial"
        : "unknown",
    additionality: /additionality|additionnel/.test(t) ? "strong" : "unknown",
    permanence: /permanence|permanent|reversal/.test(t) ? "moderate" : "unknown",
    vintage_risk: /vintage|expir/.test(t) ? "medium" : "low",
    on_chain_wrapper: /on-chain|polygon|ethereum|token/.test(t),
  };
}

export function computeCarbonQualityForCompareRow(
  row: GreenCompareRow
): CarbonQualityScore | null {
  if (row.type !== "carbon") return null;
  const profile =
    GREEN_CARBON_PROFILES[row.id] ??
    inferCarbonProfileFromText(`${row.name} ${row.impactNote} ${row.token}`);
  return computeCarbonQualityFromProfile(profile);
}

export function computeCarbonQualityForWizard(
  data: WizardData
): CarbonQualityScore | null {
  const text = [
    data.description,
    data.additionalNotes,
    data.incomeDescription,
    data.assetType,
  ]
    .filter(Boolean)
    .join(" ");
  if (!/carbon|carbone|co2|tco2|offset|crédit/.test(text.toLowerCase())) {
    return null;
  }
  return computeCarbonQualityFromProfile(inferCarbonProfileFromText(text));
}

export function formatCarbonQualityDisplay(score: number | null): string {
  if (score == null) return "—";
  return String(score);
}

export function formatCarbonQualityTierLabel(
  tier: CarbonQualityScore["tier"],
  locale: "fr" | "en" | "es" | "ar" | "zh" = "fr"
): string {
  const labels = {
    fr: {
      premium: "Premium",
      acceptable: "Acceptable",
      caution: "Prudence",
      avoid: "Éviter",
    },
    en: {
      premium: "Premium",
      acceptable: "Acceptable",
      caution: "Caution",
      avoid: "Avoid",
    },
    es: {
      premium: "Premium",
      acceptable: "Aceptable",
      caution: "Precaución",
      avoid: "Evitar",
    },
  } as const;
  const loc = locale === "fr" || locale === "es" ? locale : "en";
  return labels[loc][tier];
}
