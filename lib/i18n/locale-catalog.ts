import type { CatalogLocale, CatalogMap, Locale } from "./types";

type CatalogLookup = Partial<Record<Locale, unknown>>;

/**
 * Pick a catalog key for `locale`.
 * With a map: prefer exact locale, then `en`, then `fr` (so `ar`/`zh` are used when present).
 * Without a map (legacy): `ar`/`zh` → `en` so existing 3-locale CatalogMaps keep working.
 */
export function resolveCatalogLocale(locale: Locale): "fr" | "en" | "es";
export function resolveCatalogLocale(
  locale: Locale,
  map: CatalogLookup
): CatalogLocale;
export function resolveCatalogLocale(
  locale: Locale,
  map?: CatalogLookup
): CatalogLocale {
  if (map) {
    if (map[locale] !== undefined) return locale;
    if (map.en !== undefined) return "en";
    return "fr";
  }
  if (locale === "fr" || locale === "es") return locale;
  return "en";
}

/** Prefer `map[locale]`, else `en`, else `fr`. */
export function fromCatalog<T>(map: CatalogMap<T>, locale: Locale): T {
  return (map[locale] ?? map.en ?? map.fr) as T;
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
