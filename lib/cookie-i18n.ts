import { resolveCatalogLocale, type Locale } from "@/lib/i18n";

export type CookieBannerMessages = {
  aria: string;
  body: string;
  decline: string;
  accept: string;
};

const FR: CookieBannerMessages = {
  aria: "Préférences cookies",
  body: "Cookies analytiques pour améliorer l'expérience. Pas de publicité.",
  decline: "Refuser",
  accept: "Accepter",
};

const EN: CookieBannerMessages = {
  aria: "Cookie preferences",
  body: "We use analytics cookies to improve your experience. No advertising.",
  decline: "Decline",
  accept: "Accept",
};

const ES: CookieBannerMessages = {
  aria: "Preferencias de cookies",
  body: "Cookies analíticas para mejorar la experiencia. Sin publicidad.",
  decline: "Rechazar",
  accept: "Aceptar",
};

export function getCookieBannerMessages(locale: Locale): CookieBannerMessages {
  const map = { fr: FR, en: EN, es: ES };
  return map[resolveCatalogLocale(locale)] ?? FR;
}
