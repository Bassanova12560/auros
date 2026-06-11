/** Shareable wizard phase slugs — French URLs for the four journey parts. */

export const WIZARD_PHASE_URL_SLUGS = [
  "actif",
  "strategie",
  "conformite",
  "recap",
] as const;

export type WizardPhaseUrlSlug = (typeof WIZARD_PHASE_URL_SLUGS)[number];

export function phaseSlugFromIndex(index: number): WizardPhaseUrlSlug | null {
  return WIZARD_PHASE_URL_SLUGS[index] ?? null;
}

export function phaseIndexFromSlug(slug: string): number | null {
  const normalized = slug.trim().toLowerCase();
  const idx = WIZARD_PHASE_URL_SLUGS.indexOf(normalized as WizardPhaseUrlSlug);
  return idx >= 0 ? idx : null;
}

export function isWizardPhaseUrlSlug(slug: string): slug is WizardPhaseUrlSlug {
  return phaseIndexFromSlug(slug) !== null;
}
