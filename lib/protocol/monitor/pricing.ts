import type { Locale } from "@/lib/i18n";

/** AUROS Protocol Monitor — self-serve Starter / Pro pricing. */

export const MONITOR_STARTER_MONTHLY_EUR = 49;
export const MONITOR_PRO_MONTHLY_EUR = 199;

export const MONITOR_STARTER_AMOUNT_CENTS = MONITOR_STARTER_MONTHLY_EUR * 100;
export const MONITOR_PRO_AMOUNT_CENTS = MONITOR_PRO_MONTHLY_EUR * 100;

export const MONITOR_PRODUCT = "protocol_monitor" as const;

export type MonitorPlan = "starter" | "pro";

export function monitorPlanAmountCents(plan: MonitorPlan): number {
  return plan === "pro" ? MONITOR_PRO_AMOUNT_CENTS : MONITOR_STARTER_AMOUNT_CENTS;
}

export function monitorPlanLabel(
  plan: MonitorPlan,
  locale: Locale = "fr"
): string {
  if (plan === "pro") {
    if (locale === "en") return "AUROS Protocol Monitor Pro";
    if (locale === "es") return "AUROS Protocol Monitor Pro";
    return "AUROS Protocol Monitor Pro";
  }
  if (locale === "en") return "AUROS Protocol Monitor Starter";
  if (locale === "es") return "AUROS Protocol Monitor Starter";
  return "AUROS Protocol Monitor Starter";
}

export function monitorPlanDescription(
  plan: MonitorPlan,
  locale: Locale = "fr"
): string {
  if (plan === "pro") {
    if (locale === "en") {
      return "25 monitored assets · regulatory feed · Twin delta · webhooks";
    }
    if (locale === "es") {
      return "25 activos monitorizados · feed regulatorio · Twin delta · webhooks";
    }
    return "25 actifs monitorés · feed réglementaire · Twin delta · webhooks";
  }
  if (locale === "en") {
    return "5 monitored assets · regulatory feed · Twin delta · webhooks";
  }
  if (locale === "es") {
    return "5 activos monitorizados · feed regulatorio · Twin delta · webhooks";
  }
  return "5 actifs monitorés · feed réglementaire · Twin delta · webhooks";
}
