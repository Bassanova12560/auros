import type { WizardData } from "@/lib/wizard-types";

/** Express path: asset → compliance light → contact → recap (8 screens). */
export const WIZARD_EXPERT_STEPS = [1, 2, 3, 4, 5, 8, 9, 15] as const;

export type ExpertStep = (typeof WIZARD_EXPERT_STEPS)[number];

export function expertStepCount(): number {
  return WIZARD_EXPERT_STEPS.length;
}

export function expertStepIndex(step: number): number {
  const idx = WIZARD_EXPERT_STEPS.indexOf(step as ExpertStep);
  return idx >= 0 ? idx + 1 : 1;
}

export function nextExpertStep(current: number): number | null {
  const idx = WIZARD_EXPERT_STEPS.indexOf(current as ExpertStep);
  if (idx < 0) return WIZARD_EXPERT_STEPS[0];
  if (idx >= WIZARD_EXPERT_STEPS.length - 1) return null;
  return WIZARD_EXPERT_STEPS[idx + 1];
}

export function prevExpertStep(current: number): number | null {
  const idx = WIZARD_EXPERT_STEPS.indexOf(current as ExpertStep);
  if (idx <= 0) return null;
  return WIZARD_EXPERT_STEPS[idx - 1];
}

export function isExpertStep(step: number): boolean {
  return WIZARD_EXPERT_STEPS.includes(step as ExpertStep);
}

/** Placeholders for skipped compliance steps — refined later in dossier. */
export function applyExpertDefaults(data: WizardData): WizardData {
  return {
    ...data,
    goals: data.goals?.length ? data.goals : ["income"],
    timeline: data.timeline?.trim() || "Within 6 months",
    legalStructure: data.legalStructure?.trim() || "Other structure",
    incomeType: data.incomeType?.trim() || "none",
    incomeAmountYear: data.incomeAmountYear ?? 0,
    incomeDescription: data.incomeDescription?.trim() || "",
    legalStatus: data.legalStatus?.length
      ? data.legalStatus
      : ["I need to verify some of these"],
    investorProfile: data.investorProfile?.trim() || "I don't know yet",
    additionalNotes: data.additionalNotes?.trim()
      ? data.additionalNotes
      : "Parcours express AUROS — détails conformité à préciser.",
  };
}

export const EXPERT_MINUTES_PER_STEP = 0.65;

export function expertMinutesLeft(step: number): number {
  const idx = WIZARD_EXPERT_STEPS.indexOf(step as ExpertStep);
  const remaining =
    idx >= 0 ? WIZARD_EXPERT_STEPS.length - idx : WIZARD_EXPERT_STEPS.length;
  return Math.max(1, Math.ceil(remaining * EXPERT_MINUTES_PER_STEP));
}
