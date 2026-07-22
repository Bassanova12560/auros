/** Green P1+ cash products — Fast Track, Investor Room, Index Pack, Readiness MRR. */

import type { Locale } from "@/lib/i18n";

export const GREEN_FAST_TRACK_EUR = 499;
export const GREEN_FAST_TRACK_CENTS = GREEN_FAST_TRACK_EUR * 100;
export const GREEN_FAST_TRACK_PRODUCT = "green_fast_track" as const;

export const GREEN_INVESTOR_ROOM_EUR = 199;
export const GREEN_INVESTOR_ROOM_CENTS = GREEN_INVESTOR_ROOM_EUR * 100;
export const GREEN_INVESTOR_ROOM_PRODUCT = "green_investor_room" as const;

export const GREEN_INDEX_PACK_EUR = 99;
export const GREEN_INDEX_PACK_CENTS = GREEN_INDEX_PACK_EUR * 100;
export const GREEN_INDEX_PACK_PRODUCT = "green_index_pack" as const;

export const GREEN_READINESS_MRR_EUR = 149;
export const GREEN_READINESS_MRR_CENTS = GREEN_READINESS_MRR_EUR * 100;
export const GREEN_READINESS_MRR_PRODUCT = "green_readiness_mrr" as const;

export type GreenP1Product =
  | typeof GREEN_FAST_TRACK_PRODUCT
  | typeof GREEN_INVESTOR_ROOM_PRODUCT
  | typeof GREEN_INDEX_PACK_PRODUCT
  | typeof GREEN_READINESS_MRR_PRODUCT;

export function greenFastTrackLabel(locale: Locale = "fr"): string {
  if (locale === "en") return "AUROS Green — Fast Track 24h";
  if (locale === "es") return "AUROS Green — Fast Track 24h";
  return "AUROS Green — Fast Track 24h";
}

export function greenFastTrackDescription(locale: Locale = "fr"): string {
  if (locale === "en") {
    return "Priority RTMS pre-check within ~24 business hours. Human review — not a certification.";
  }
  if (locale === "es") {
    return "Pre-check RTMS prioritario en ~24h laborables. Revisión humana — no es certificación.";
  }
  return "Pré-diag RTMS prioritaire sous ~24h ouvrées. Revue humaine — pas une certification.";
}

export function greenInvestorRoomLabel(locale: Locale = "fr"): string {
  if (locale === "en") return "AUROS Green — Investor Room";
  if (locale === "es") return "AUROS Green — Investor Room";
  return "AUROS Green — Investor Room";
}

export function greenInvestorRoomDescription(locale: Locale = "fr"): string {
  if (locale === "en") {
    return "30-day access to verified/pilot listings room. Data matching only — not brokerage.";
  }
  if (locale === "es") {
    return "Acceso 30 días a la sala verified/pilot. Solo matching de datos — no corretaje.";
  }
  return "Accès 30 jours à la salle verified/pilot. Matching data uniquement — pas de courtage.";
}

export function greenIndexPackLabel(locale: Locale = "fr"): string {
  if (locale === "en") return "AUROS Green — Index Pack (monthly)";
  if (locale === "es") return "AUROS Green — Index Pack (mensual)";
  return "AUROS Green — Index Pack (mensuel)";
}

export function greenIndexPackDescription(locale: Locale = "fr"): string {
  if (locale === "en") {
    return "Commercial index pack: citation kit, CSV, JSON feed rights for internal/tools use. Not full redistribution.";
  }
  if (locale === "es") {
    return "Pack índice comercial: kit de cita, CSV, derechos feed JSON para uso interno/herramientas. No redistribución plena.";
  }
  return "Pack indice commercial : kit citation, CSV, droits feed JSON usage interne/outils. Pas de redistribution pleine.";
}

export function greenReadinessMrrLabel(locale: Locale = "fr"): string {
  if (locale === "en") return "AUROS Green — Readiness MRR";
  if (locale === "es") return "AUROS Green — Readiness MRR";
  return "AUROS Green — Readiness MRR";
}

export function greenReadinessMrrDescription(locale: Locale = "fr"): string {
  if (locale === "en") {
    return "Monthly RTMS readiness queue + priority ops review. Indicative coaching — not regulated advice.";
  }
  if (locale === "es") {
    return "Cola mensual RTMS + revisión ops prioritaria. Coaching indicativo — no consejo regulado.";
  }
  return "File mensuelle readiness RTMS + revue ops prioritaire. Coaching indicatif — pas un conseil réglementé.";
}
