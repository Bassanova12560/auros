import { getMessages, type Locale } from "@/lib/i18n";

export type ScorePresentation = {
  tierLabel: string;
  microCopy: string;
  tierKey: "high" | "strong" | "moderate" | "prep";
};

export function scorePresentation(
  score: number,
  locale: Locale
): ScorePresentation {
  const s = getMessages(locale).scoreReveal;
  if (score >= 75) {
    return { tierLabel: s.tierHigh, microCopy: s.microHigh, tierKey: "high" };
  }
  if (score >= 65) {
    return {
      tierLabel: s.tierStrong,
      microCopy: s.microStrong,
      tierKey: "strong",
    };
  }
  if (score >= 55) {
    return {
      tierLabel: s.tierModerate,
      microCopy: s.microModerate,
      tierKey: "moderate",
    };
  }
  return { tierLabel: s.tierPrep, microCopy: s.microPrep, tierKey: "prep" };
}
