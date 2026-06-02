import type { Locale } from "@/lib/i18n";

import { JURISDICTIONS } from "./data";
import type { JurisdictionAssetType } from "./types";

export type SeoLandingSlug = `${string}-${string}`;

const ASSET_SLUGS: Record<JurisdictionAssetType, string> = {
  real_estate: "real-estate",
  bonds: "bonds",
  private_credit: "private-credit",
  funds: "funds",
};

export type SeoLanding = {
  slug: string;
  jurisdictionId: string;
  assetType: JurisdictionAssetType;
  assetSlug: string;
};

export function buildSeoSlug(
  jurisdictionId: string,
  assetType: JurisdictionAssetType
): string {
  return `${jurisdictionId}-${ASSET_SLUGS[assetType]}`;
}

export function getAllSeoLandings(): SeoLanding[] {
  const landings: SeoLanding[] = [];
  for (const j of JURISDICTIONS) {
    for (const asset of j.assetTypes) {
      const assetSlug = ASSET_SLUGS[asset];
      landings.push({
        slug: `${j.id}-${assetSlug}`,
        jurisdictionId: j.id,
        assetType: asset,
        assetSlug,
      });
    }
  }
  return landings;
}

export function parseSeoLandingSlug(slug: string): SeoLanding | null {
  for (const j of JURISDICTIONS) {
    for (const asset of j.assetTypes) {
      const expected = buildSeoSlug(j.id, asset);
      if (slug === expected) {
        return {
          slug: expected,
          jurisdictionId: j.id,
          assetType: asset,
          assetSlug: ASSET_SLUGS[asset],
        };
      }
    }
  }
  return null;
}

export type SeoLandingCopy = {
  title: string;
  description: string;
  h1: string;
  intro: string;
  bullets: string[];
  ctaGuide: string;
  ctaCompare: string;
  ctaStarterKit: string;
};

export function getSeoLandingCopy(
  locale: Locale,
  landing: SeoLanding,
  jurisdictionName: string,
  assetLabel: string
): SeoLandingCopy {
  const jurisdiction = JURISDICTIONS.find((j) => j.id === landing.jurisdictionId)!;

  if (locale === "en") {
    return {
      title: `Tokenize ${assetLabel} in ${jurisdictionName} | AUROS`,
      description: `Indicative fees, licence timelines and investor tax for ${assetLabel.toLowerCase()} tokenization in ${jurisdictionName}. B2B comparator and Starter Kit.`,
      h1: `${assetLabel} tokenization in ${jurisdictionName}`,
      intro: `Compare state and advisory costs, licence vs production timelines, and investor tax treatment before engaging counsel. Indicative data for ${assetLabel.toLowerCase()} sponsors.`,
      bullets: [
        `Setup budget (indicative): €${jurisdiction.feeMinEur.toLocaleString("en")}–€${jurisdiction.feeMaxEur.toLocaleString("en")}`,
        `Timeline: ${jurisdiction.delayMinMonths}–${jurisdiction.delayMaxMonths} months to production`,
        `KYC level: ${jurisdiction.kycLevel}`,
      ],
      ctaGuide: "Get my free comparative study",
      ctaCompare: "Open full comparator",
      ctaStarterKit: "Starter Kit — from €5,000",
    };
  }

  if (locale === "es") {
    return {
      title: `Tokenizar ${assetLabel} en ${jurisdictionName} | AUROS`,
      description: `Costes, plazos de licencia e impuestos inversor para tokenización ${assetLabel.toLowerCase()} en ${jurisdictionName}.`,
      h1: `Tokenización ${assetLabel.toLowerCase()} en ${jurisdictionName}`,
      intro: `Compare costes, plazos y fiscalidad antes de contactar con un abogado. Datos indicativos para patrocinadores ${assetLabel.toLowerCase()}.`,
      bullets: [
        `Presupuesto setup (indicativo): ${jurisdiction.feeMinEur.toLocaleString("es")}–${jurisdiction.feeMaxEur.toLocaleString("es")} €`,
        `Plazo: ${jurisdiction.delayMinMonths}–${jurisdiction.delayMaxMonths} meses hasta producción`,
        `Nivel KYC: ${jurisdiction.kycLevel}`,
      ],
      ctaGuide: "Recibir mi estudio comparativo",
      ctaCompare: "Abrir comparador completo",
      ctaStarterKit: "Starter Kit — desde 5 000 €",
    };
  }

  return {
    title: `Tokeniser ${assetLabel.toLowerCase()} au ${jurisdictionName} | AUROS`,
    description: `Frais, délais de licence et fiscalité investisseur pour la tokenisation ${assetLabel.toLowerCase()} au ${jurisdictionName}. Comparateur B2B et Starter Kit.`,
    h1: `Tokenisation ${assetLabel.toLowerCase()} — ${jurisdictionName}`,
    intro: `Comparez frais État et conseil, délais licence vs production et fiscalité investisseur avant d'appeler un cabinet. Données indicatives pour sponsors ${assetLabel.toLowerCase()}.`,
    bullets: [
      `Budget setup (indicatif) : ${jurisdiction.feeMinEur.toLocaleString("fr")}–${jurisdiction.feeMaxEur.toLocaleString("fr")} €`,
      `Délai : ${jurisdiction.delayMinMonths}–${jurisdiction.delayMaxMonths} mois jusqu'à la production`,
      `Niveau KYC : ${jurisdiction.kycLevel}`,
    ],
    ctaGuide: "Recevoir mon étude comparative gratuite",
    ctaCompare: "Ouvrir le comparateur complet",
    ctaStarterKit: "Starter Kit — dès 5 000 €",
  };
}
