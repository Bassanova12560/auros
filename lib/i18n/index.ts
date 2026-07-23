import { ar } from "./locales/ar";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { zh } from "./locales/zh";
import {
  fromCatalog,
  isRtlLocale,
  localeCatalog,
  resolveCatalogLocale,
} from "./locale-catalog";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_STORAGE_KEY,
  type Locale,
  type Messages,
} from "./types";

export * from "./types";
export { fromCatalog, isRtlLocale, localeCatalog, resolveCatalogLocale };

const CATALOG: Record<Locale, Messages> = { fr, en, es, ar, zh };

export function getMessages(locale: Locale): Messages {
  return CATALOG[locale] ?? CATALOG[DEFAULT_LOCALE];
}

export function isLocale(value: string): value is Locale {
  return (
    value === "fr" ||
    value === "en" ||
    value === "es" ||
    value === "ar" ||
    value === "zh"
  );
}

/** Parse a raw cookie / storage value into a Locale. */
export function localeFromCookieValue(
  raw: string | undefined | null
): Locale | null {
  return raw && isLocale(raw) ? raw : null;
}

function readCookieLocale(): Locale | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(
      new RegExp(
        `(?:^|; )${LOCALE_STORAGE_KEY.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`
      )
    );
    return localeFromCookieValue(
      match?.[1] ? decodeURIComponent(match[1]) : null
    );
  } catch {
    return null;
  }
}

function writeCookieLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${LOCALE_STORAGE_KEY}=${encodeURIComponent(locale)};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};SameSite=Lax`;
  } catch {
    // ignore
  }
}

/** Cookie first (matches SSR), then localStorage — used for client first paint. */
export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  const fromCookie = readCookieLocale();
  if (fromCookie) return fromCookie;
  try {
    const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
    return localeFromCookieValue(raw);
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
  writeCookieLocale(locale);
}

export function applyDocumentLocale(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.dir = isRtlLocale(locale) ? "rtl" : "ltr";
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
