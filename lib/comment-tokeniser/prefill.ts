import type { WizardPrefill } from "@/lib/wizard-prefill";

import {
  getCommentTokeniserCopy,
  getCommentTokeniserLanding,
  type CommentTokeniserSlug,
} from "./landings";

export function prefillFromCommentTokeniser(
  slug: CommentTokeniserSlug,
  locale: "fr" | "en" | "es" = "fr"
): WizardPrefill {
  const landing = getCommentTokeniserLanding(slug)!;
  const copy = getCommentTokeniserCopy(slug, locale);

  return {
    assetType: landing.wizardAssetType,
    estimatedValue: landing.defaultValueEur,
    currency: "EUR",
    country: landing.defaultCountry,
    description: copy.defaultDescription,
    mode: "explore",
    fromTool: "comment-tokeniser",
    valueBucket: landing.defaultValueEur >= 2_000_000 ? "over_2m" : "500k_2m",
  };
}
