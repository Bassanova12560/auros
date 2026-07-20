import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

import { getJurisdictionMessages, jurisdictionLabel } from "./i18n";

export type StarterLeadContext = {
  projectType: string;
  jurisdictions: string[];
  projectValue?: string | null;
  locale: Locale;
};

const VALUE_LABELS: CatalogMap< Record<string, string>> = {
  fr: {
    under1m: "< 1 M€",
    "1to5m": "1–5 M€",
    "5to20m": "5–20 M€",
    over20m: "> 20 M€",
  },
  en: {
    under1m: "< €1M",
    "1to5m": "€1–5M",
    "5to20m": "€5–20M",
    over20m: "> €20M",
  },
  es: {
    under1m: "< 1 M€",
    "1to5m": "1–5 M€",
    "5to20m": "5–20 M€",
    over20m: "> 20 M€",
  },
};

export function primaryJurisdictionId(jurisdictions: string[]): string {
  return jurisdictions.find((j) => j !== "unsure") ?? "luxembourg";
}

export function secondaryJurisdictionIds(jurisdictions: string[]): string[] {
  const primary = primaryJurisdictionId(jurisdictions);
  return jurisdictions.filter((j) => j !== "unsure" && j !== primary);
}

export function formatJurisdictionLabel(id: string, locale: Locale): string {
  const messages = getJurisdictionMessages(locale);
  return jurisdictionLabel(messages, id);
}

export function formatJurisdictionList(
  jurisdictions: string[],
  locale: Locale
): string {
  return jurisdictions
    .filter((j) => j !== "unsure")
    .map((j) => formatJurisdictionLabel(j, locale))
    .join(" · ");
}

export function projectValueLabel(
  value: string | null | undefined,
  locale: Locale
): string | null {
  if (!value) return null;
  return VALUE_LABELS[resolveCatalogLocale(locale)]?.[value] ?? null;
}

function projectTypeLabel(projectType: string, locale: Locale): string {
  const messages = getJurisdictionMessages(locale);
  return messages.forms.projectTypes[projectType] ?? projectType;
}

export function personaHeadline(ctx: StarterLeadContext): string {
  const primary = formatJurisdictionLabel(
    primaryJurisdictionId(ctx.jurisdictions),
    ctx.locale
  );
  const value = projectValueLabel(ctx.projectValue, ctx.locale);
  const type = projectTypeLabel(ctx.projectType, ctx.locale);

  if (ctx.locale === "en") {
    return value
      ? `${type} · ${value} · jurisdiction ${primary}`
      : `${type} · jurisdiction ${primary}`;
  }

  if (ctx.locale === "es") {
    return value
      ? `${type} · ${value} · jurisdicción ${primary}`
      : `${type} · jurisdicción ${primary}`;
  }

  return value
    ? `${type} · ${value} · juridiction ${primary}`
    : `${type} · juridiction ${primary}`;
}
