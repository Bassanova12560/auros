/** Green Market cash products — intro fee + verified listing (one-shot). */

import type { Locale } from "@/lib/i18n";

export const GREEN_MARKET_INTRO_EUR = 149;
export const GREEN_MARKET_INTRO_CENTS = GREEN_MARKET_INTRO_EUR * 100;
export const GREEN_MARKET_INTRO_PRODUCT = "green_market_intro" as const;

export const GREEN_MARKET_VERIFIED_EUR = 299;
export const GREEN_MARKET_VERIFIED_CENTS = GREEN_MARKET_VERIFIED_EUR * 100;
export const GREEN_MARKET_VERIFIED_PRODUCT = "green_market_verified" as const;

export function greenMarketIntroLabel(locale: Locale = "fr"): string {
  if (locale === "en") return "AUROS Green — qualified intro";
  if (locale === "es") return "AUROS Green — introducción cualificada";
  return "AUROS Green — mise en relation qualifiée";
}

export function greenMarketIntroDescription(locale: Locale = "fr"): string {
  if (locale === "en") {
    return "Paid data matching intro (not brokerage). AUROS ops reviews then connects parties. Indicative only.";
  }
  if (locale === "es") {
    return "Introducción de matching de datos de pago (no corretaje). Ops AUROS revisa y conecta. Solo indicativo.";
  }
  return "Mise en relation data payante (pas de courtage). Revue ops AUROS puis connexion. Indicatif uniquement.";
}

export function greenMarketVerifiedLabel(locale: Locale = "fr"): string {
  if (locale === "en") return "AUROS Green — Verified listing";
  if (locale === "es") return "AUROS Green — Listing Verified";
  return "AUROS Green — Listing Verified";
}

export function greenMarketVerifiedDescription(locale: Locale = "fr"): string {
  if (locale === "en") {
    return "Featured Verified badge + priority on marketplace + RTMS pre-check path. Human review.";
  }
  if (locale === "es") {
    return "Badge Verified destacado + prioridad en marketplace + ruta pre-check RTMS. Revisión humana.";
  }
  return "Badge Verified mis en avant + priorité marketplace + parcours pré-diag RTMS. Revue humaine.";
}
