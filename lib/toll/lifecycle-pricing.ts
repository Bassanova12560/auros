/**
 * Toll cash SKUs — Lookup Pack + Lifecycle Maintain (HITL).
 */

import type { Locale } from "@/lib/i18n";

export const TOLL_LOOKUP_PACK_EUR = 99;
export const TOLL_LOOKUP_PACK_CENTS = TOLL_LOOKUP_PACK_EUR * 100;
export const TOLL_LOOKUP_PACK_PRODUCT = "toll_lookup_pack" as const;
export const TOLL_LOOKUP_PACK_CREDITS = 10_000;

export const TOLL_LIFECYCLE_EUR = 149;
export const TOLL_LIFECYCLE_CENTS = TOLL_LIFECYCLE_EUR * 100;
export const TOLL_LIFECYCLE_PRODUCT = "toll_lifecycle_maintain" as const;
export const TOLL_LIFECYCLE_EVENT_CREDITS = 500;

export type TollCashProduct =
  | typeof TOLL_LOOKUP_PACK_PRODUCT
  | typeof TOLL_LIFECYCLE_PRODUCT;

export function isTollCashProduct(raw: string): raw is TollCashProduct {
  return (
    raw === TOLL_LOOKUP_PACK_PRODUCT || raw === TOLL_LIFECYCLE_PRODUCT
  );
}

export function tollLookupPackLabel(locale: Locale = "fr"): string {
  if (locale === "en") return "AUROS Toll — Lookup Pack (10k credits)";
  if (locale === "es") return "AUROS Toll — Pack Lookup (10k créditos)";
  return "AUROS Toll — Pack Lookup (10k crédits)";
}

export function tollLookupPackDescription(locale: Locale = "fr"): string {
  if (locale === "en") {
    return "10,000 Resolve/Search/Trail lookup credits. Infrastructure toll — not a certification.";
  }
  if (locale === "es") {
    return "10.000 créditos Resolve/Search/Trail. Peaje de infraestructura — no certificación.";
  }
  return "10 000 crédits Resolve/Search/Trail. Péage d’infrastructure — pas une certification.";
}

export function tollLifecycleLabel(locale: Locale = "fr"): string {
  if (locale === "en") return "AUROS Toll — Lifecycle Maintain (monthly)";
  if (locale === "es") return "AUROS Toll — Lifecycle Maintain (mensual)";
  return "AUROS Toll — Lifecycle Maintain (mensuel)";
}

export function tollLifecycleDescription(locale: Locale = "fr"): string {
  if (locale === "en") {
    return "500 billable Proof Stream lifecycle events / month + HITL ops queue. Not brokerage.";
  }
  if (locale === "es") {
    return "500 eventos de ciclo de vida Proof Stream / mes + cola HITL. No corretaje.";
  }
  return "500 événements Proof Stream facturables / mois + file HITL. Pas de courtage.";
}
