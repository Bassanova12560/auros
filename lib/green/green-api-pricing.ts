/** AUROS Green API Premium — self-serve subscription pricing. */

export const GREEN_API_PREMIUM_MONTHLY_EUR = 299;
export const GREEN_API_PREMIUM_AMOUNT_CENTS = GREEN_API_PREMIUM_MONTHLY_EUR * 100;

export const PREMIUM_TIER_MONTHLY_LIMIT = 25_000;
export const ENTERPRISE_TIER_MONTHLY_LIMIT = 100_000;

export const GREEN_API_PREMIUM_PRODUCT = "green_api_premium" as const;

export type GreenApiPremiumProduct = typeof GREEN_API_PREMIUM_PRODUCT;

export function greenApiPremiumLabel(locale: "fr" | "en" | "es" = "fr"): string {
  if (locale === "en") return "AUROS Green API Premium";
  if (locale === "es") return "AUROS Green API Premium";
  return "AUROS Green API Premium";
}

export function greenApiPremiumDescription(locale: "fr" | "en" | "es" = "fr"): string {
  if (locale === "en") {
    return "25,000 req/month · batch 50 CQS · Registry Connect priority · SLA email";
  }
  if (locale === "es") {
    return "25 000 req/mes · batch 50 CQS · Registry Connect · SLA email";
  }
  return "25 000 req/mois · batch 50 CQS · Registry Connect prioritaire · SLA email";
}
