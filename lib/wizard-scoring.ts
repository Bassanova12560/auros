import { computeAdmissionReadiness } from "@/lib/admission-scoring";
import type { Locale } from "@/lib/i18n";
import { admissionOverallLabel } from "@/lib/platform-display-i18n";
import { tierFromScore, type Tier } from "@/lib/score";
import { scorePresentation } from "@/lib/score-presentation";
import type { WizardData } from "@/lib/wizard-types";

import { PRIME_LOCATIONS } from "@/lib/wizard-constants";

export type ScoreResult = {
  score: number;
  tier: Tier;
  label: string;
  color: string;
  admissionPercent: number;
  admissionLabel: string;
};

export function computeWizardScore(
  data: WizardData,
  locale: Locale = "fr"
): ScoreResult {
  const readiness = computeAdmissionReadiness(data);
  let score = readiness.overallAdmission;

  if (
    data.assetType === "Real estate" ||
    data.assetType === "Vehicles & classic cars"
  ) {
    score = Math.min(100, score + 3);
  }
  if (PRIME_LOCATIONS.includes(data.country)) {
    score = Math.min(100, score + 2);
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const presentation = scorePresentation(score, locale);
  const tierInfo = tierFromScore(score);
  return {
    score,
    tier: tierInfo.tier,
    label: presentation.tierLabel,
    color: tierInfo.color,
    admissionPercent: readiness.overallAdmission,
    admissionLabel: admissionOverallLabel(locale, readiness.label),
  };
}
