import type { Locale } from "@/lib/i18n";

import type { L10n, L10nList } from "./types";

export function tL10n(map: L10n, locale: Locale): string {
  if (locale === "fr") return map.fr;
  if (locale === "es" && map.es) return map.es;
  if (locale === "ar" && map.ar) return map.ar;
  if (locale === "zh" && map.zh) return map.zh;
  return map.en || map.fr;
}

export function tL10nList(map: L10nList, locale: Locale): string[] {
  if (locale === "fr") return [...map.fr];
  if (locale === "es" && map.es) return [...map.es];
  if (locale === "ar" && map.ar) return [...map.ar];
  if (locale === "zh" && map.zh) return [...map.zh];
  return [...(map.en || map.fr)];
}
