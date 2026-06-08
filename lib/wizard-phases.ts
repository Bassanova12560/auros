import type { Locale } from "@/lib/i18n";

export type WizardPhase = {
  id: string;
  steps: number[];
  labels: Record<Locale, string>;
};

export const WIZARD_PHASES: WizardPhase[] = [
  {
    id: "asset",
    steps: [1, 2, 3, 4, 5],
    labels: {
      fr: "L'actif",
      en: "The asset",
      es: "El activo",
    },
  },
  {
    id: "strategy",
    steps: [6, 7, 8, 9],
    labels: {
      fr: "Stratégie",
      en: "Strategy",
      es: "Estrategia",
    },
  },
  {
    id: "compliance",
    steps: [10, 11, 12, 13, 14],
    labels: {
      fr: "Conformité",
      en: "Compliance",
      es: "Conformidad",
    },
  },
  {
    id: "summary",
    steps: [15],
    labels: {
      fr: "Récap",
      en: "Summary",
      es: "Resumen",
    },
  },
];

export function wizardPhaseForStep(step: number): WizardPhase | null {
  return WIZARD_PHASES.find((p) => p.steps.includes(step)) ?? null;
}

export function wizardPhaseIndex(step: number): number {
  const idx = WIZARD_PHASES.findIndex((p) => p.steps.includes(step));
  return idx >= 0 ? idx : 0;
}

/** First wizard step for a phase index (0-based). */
export function firstStepOfPhase(phaseIndex: number): number {
  const phase = WIZARD_PHASES[phaseIndex];
  return phase?.steps[0] ?? 1;
}
