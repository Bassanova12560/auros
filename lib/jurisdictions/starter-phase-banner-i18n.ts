import type { Locale } from "@/lib/i18n";

export type StarterPhaseBannerMessages = {
  eyebrow: string;
  body: (country: string) => string;
};

const FR: StarterPhaseBannerMessages = {
  eyebrow: "Phase 1 · Dossier actif (gratuit)",
  body: (country) =>
    `Votre juridiction (${country}) est déjà cadrée par le memo phase 0. Ce wizard prépare l'admission de l'actif — description, valorisation, data room.`,
};

const EN: StarterPhaseBannerMessages = {
  eyebrow: "Phase 1 · Asset dossier (free)",
  body: (country) =>
    `Your jurisdiction (${country}) is already framed by the phase 0 memo. This wizard prepares asset admission — description, valuation, data room.`,
};

const ES: StarterPhaseBannerMessages = {
  eyebrow: "Fase 1 · Dossier activo (gratis)",
  body: (country) =>
    `Su jurisdicción (${country}) ya está definida por el memo fase 0. Este wizard prepara la admisión del activo.`,
};

export function getStarterPhaseBannerMessages(
  locale: Locale
): StarterPhaseBannerMessages {
  if (locale === "en") return EN;
  if (locale === "es") return ES;
  return FR;
}
