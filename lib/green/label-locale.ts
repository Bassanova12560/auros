import type { Locale } from "@/lib/i18n";

/** Normalize stored or submitted label application locale. */
export function normalizeGreenLabelPreferredLocale(
  value: string | null | undefined
): Locale {
  if (value === "en" || value === "es") return value;
  return "fr";
}

export function isGreenLabelPreferredLocale(value: string): value is Locale {
  return value === "fr" || value === "en" || value === "es";
}
