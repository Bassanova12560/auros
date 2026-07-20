/** AUROS Green API Premium — self-serve subscription pricing. */

import type { Locale } from "@/lib/i18n";

export const GREEN_API_PREMIUM_MONTHLY_EUR = 299;
export const GREEN_API_PREMIUM_AMOUNT_CENTS = GREEN_API_PREMIUM_MONTHLY_EUR * 100;

export const PREMIUM_TIER_MONTHLY_LIMIT = 25_000;
export const ENTERPRISE_TIER_MONTHLY_LIMIT = 100_000;

export const GREEN_API_PREMIUM_PRODUCT = "green_api_premium" as const;

export type GreenApiPremiumProduct = typeof GREEN_API_PREMIUM_PRODUCT;

export function greenApiPremiumLabel(locale: Locale = "fr"): string {
  if (locale === "en" || locale === "zh") return "AUROS Green API Premium";
  if (locale === "es") return "AUROS Green API Premium";
  if (locale === "ar") return "AUROS Green API Premium";
  return "AUROS Green API Premium";
}

export function greenApiPremiumDescription(locale: Locale = "fr"): string {
  if (locale === "en" || locale === "zh") {
    return "25,000 req/month · batch 50 CQS · score history · changelog webhooks · SLA email";
  }
  if (locale === "es") {
    return "25 000 req/mes · batch 50 CQS · historial · webhooks changelog · SLA email";
  }
  if (locale === "ar") {
    return "25,000 req/month · batch 50 CQS · score history · changelog webhooks · SLA email";
  }
  return "25 000 req/mois · batch 50 CQS · historique scores · webhooks changelog · SLA email";
}
