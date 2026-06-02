import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  type Locale,
  type Messages,
} from "./types";

export * from "./types";

const CATALOG: Record<Locale, Messages> = { fr, en, es };

export function getMessages(locale: Locale): Messages {
  return CATALOG[locale] ?? CATALOG[DEFAULT_LOCALE];
}

export function isLocale(value: string): value is Locale {
  return value === "fr" || value === "en" || value === "es";
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    return raw && isLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

export function storeLocale(locale: Locale) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // ignore
  }
}

export function tierLabelForLocale(
  locale: Locale,
  tier: "high" | "mid" | "low"
): string {
  const t = getMessages(locale).tiers;
  if (tier === "high") return t.high;
  if (tier === "mid") return t.mid;
  return t.low;
}
