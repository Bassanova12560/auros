import { assetSlugFromWizardType } from "@/lib/wizard-asset-slug";
import {
  getMessages,
  tierLabelForLocale,
  type Locale,
} from "@/lib/i18n";
import { calculateScore, tierFromScore } from "@/lib/score";

export function quickScoreFromWizardFields(
  params: {
    assetType: string;
    estimatedValue: number;
    country: string;
  },
  locale: Locale = "fr"
): {
  score: number;
  tier: ReturnType<typeof tierFromScore>;
  tierLabel: string;
  explanation: string;
} {
  const slug = assetSlugFromWizardType(params.assetType);
  const score = calculateScore({
    assetType: slug,
    value: params.estimatedValue,
    country: params.country,
  });
  const tier = tierFromScore(score);
  const tierLabel = tierLabelForLocale(locale, tier.tier);
  const m = getMessages(locale).quickScoreExplain;

  let explanation = m.default;
  if (score >= 75) explanation = m.high;
  else if (score >= 51) explanation = m.mid;
  else explanation = m.low;

  return { score, tier, tierLabel, explanation };
}
