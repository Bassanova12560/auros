import type { CatalogLocale, CatalogMap, Locale } from "./types";

/**
 * Secondary catalogs ship FR/EN/ES. Arabic & Chinese UI chrome is native;
 * deep page copy falls back to English until those catalogs are translated.
 */
export function resolveCatalogLocale(locale: Locale): CatalogLocale {
  if (locale === "fr" || locale === "es") return locale;
  return "en";
}

export function fromCatalog<T>(map: CatalogMap<T>, locale: Locale): T {
  return map[resolveCatalogLocale(locale)];
}

/**
 * Build a full Locale map. Missing `ar` / `zh` fall back to English.
 */
export function localeCatalog<T>(base: {
  fr: T;
  en: T;
  es: T;
  ar?: T;
  zh?: T;
}): Record<Locale, T> {
  return {
    fr: base.fr,
    en: base.en,
    es: base.es,
    ar: base.ar ?? base.en,
    zh: base.zh ?? base.en,
  };
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === "ar";
}
