import type { MicaQuestionId } from "@/lib/mica-checker/types";
import { WIZARD_PHASES } from "@/lib/wizard-phases";

export type WizardMode = "explore" | "pro";

export type WizardTier = "starter" | "pro" | "institutional";

/** Explore: 5 questions + récap (gratuit). */
export const EXPLORE_STEPS = [1, 2, 3, 6, 9, 15] as const;

/** Pro: 19 questions (1–14 + MiCA 16–20) + récap step 15. */
export const PRO_STEPS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 15,
] as const;

export type ExploreStep = (typeof EXPLORE_STEPS)[number];
export type ProStep = (typeof PRO_STEPS)[number];

export const MICA_WIZARD_STEPS = [16, 17, 18, 19, 20] as const;

export const MICA_STEP_TO_QUESTION: Record<number, MicaQuestionId> = {
  16: "issuerType",
  17: "assetClass",
  18: "euNexus",
  19: "whitepaper",
  20: "investorType",
};

export const VALUE_BUCKETS = [
  { id: "under_100k", min: 0, max: 99_999, labelFr: "< 100 k€", labelEn: "< €100k" },
  { id: "100k_500k", min: 100_000, max: 500_000, labelFr: "100 k – 500 k€", labelEn: "€100k – €500k" },
  { id: "500k_2m", min: 500_001, max: 2_000_000, labelFr: "500 k – 2 M€", labelEn: "€500k – €2M" },
  { id: "over_2m", min: 2_000_001, max: 10_000_000, labelFr: "> 2 M€", labelEn: "> €2M" },
] as const;

export type ValueBucketId = (typeof VALUE_BUCKETS)[number]["id"];

export function bucketMidpoint(id: ValueBucketId): number {
  const b = VALUE_BUCKETS.find((x) => x.id === id);
  if (!b) return 250_000;
  if (id === "over_2m") return 3_000_000;
  return Math.round((b.min + b.max) / 2);
}

export function parseWizardMode(raw: string | null | undefined): WizardMode | null {
  const v = raw?.trim().toLowerCase();
  if (v === "explore" || v === "pro") return v;
  return null;
}

/** Legacy `?expert=1` and stored expertMode map to explore. */
export function modeFromLegacyExpert(expert: boolean): WizardMode {
  return expert ? "explore" : "pro";
}

export function stepsForMode(mode: WizardMode): readonly number[] {
  return mode === "explore" ? EXPLORE_STEPS : PRO_STEPS;
}

export function stepCountForMode(mode: WizardMode): number {
  return stepsForMode(mode).filter((s) => s !== 15).length;
}

export function stepIndexInMode(mode: WizardMode, step: number): number {
  const steps = stepsForMode(mode);
  const idx = steps.indexOf(step as ExploreStep & ProStep);
  return idx >= 0 ? idx + 1 : 1;
}

export function nextStepForMode(mode: WizardMode, current: number): number | null {
  const steps = stepsForMode(mode);
  const idx = steps.indexOf(current as ExploreStep & ProStep);
  if (idx < 0) return steps[0];
  if (idx >= steps.length - 1) return null;
  return steps[idx + 1];
}

export function prevStepForMode(mode: WizardMode, current: number): number | null {
  const steps = stepsForMode(mode);
  const idx = steps.indexOf(current as ExploreStep & ProStep);
  if (idx <= 0) return null;
  return steps[idx - 1];
}

export function isStepInMode(mode: WizardMode, step: number): boolean {
  return stepsForMode(mode).includes(step as ExploreStep & ProStep);
}

export function isMicaStep(step: number): boolean {
  return (MICA_WIZARD_STEPS as readonly number[]).includes(step);
}

/** Map wizard step → phase index (0–3) for 4-part journey UI. */
export function phaseIndexForStep(mode: WizardMode, step: number): number {
  if (step === 15) return 3;
  if (mode === "explore") {
    if (step <= 3) return 0;
    if (step === 6) return 1;
    if (step === 9) return 2;
    return 3;
  }
  if (step <= 5) return 0;
  if (step <= 9) return 1;
  if (step <= 20) return 2;
  return 3;
}

export function firstStepOfPhaseForMode(
  mode: WizardMode,
  phaseIndex: number
): number {
  const steps = stepsForMode(mode);
  for (const s of steps) {
    if (phaseIndexForStep(mode, s) === phaseIndex) return s;
  }
  return steps[0];
}

export function phaseLabelsForMode(mode: WizardMode): typeof WIZARD_PHASES {
  return WIZARD_PHASES;
}

export const WIZARD_TIER_AMOUNTS: Record<WizardTier, number> = {
  starter: 49_000,
  pro: 199_000,
  institutional: 499_000,
};

export const WIZARD_TIER_LABELS: Record<
  WizardTier,
  { fr: string; en: string; es: string }
> = {
  starter: {
    fr: "Starter — 490 €",
    en: "Starter — €490",
    es: "Starter — 490 €",
  },
  pro: {
    fr: "Pro — 1 990 €",
    en: "Pro — €1,990",
    es: "Pro — 1 990 €",
  },
  institutional: {
    fr: "Institutional — 4 990 €",
    en: "Institutional — €4,990",
    es: "Institutional — 4 990 €",
  },
};

export function isWizardTier(raw: string): raw is WizardTier {
  return raw === "starter" || raw === "pro" || raw === "institutional";
}
