/**
 * Platform compatibility — delegates to RWA admission matrix.
 * Keeps valueInEur / assetSlug helpers used across dossier & PDF.
 */

import { computeAdmissionReadiness } from "@/lib/admission-scoring";
import type { RwaPlatformId } from "@/lib/rwa-platforms";
import { COUNTRIES_EUROPE } from "@/lib/wizard-countries";
import type { Currency, WizardData } from "@/lib/wizard-types";

const DOC_NONE = "None yet";

/** Maps Step 1 display labels to category slugs (keep in sync with wizard). */
const ASSET_TYPE_SLUG: Record<string, string> = {
  "Real estate": "real_estate",
  "Fine art": "fine_art",
  Collectibles: "collectibles",
  "Vehicles & classic cars": "luxury_vehicle",
  "Wine & spirits": "wine_spirits",
  "Watches & jewelry": "watches_jewelry",
  "Music & royalties": "music_royalties",
  "Film & IP rights": "film_ip",
  "Land & island": "land_island",
  "Fashion & luxury goods": "fashion",
  "Private equity / SME shares": "private_credit",
  "Commodities & precious metals": "precious_metals",
  Other: "other",
};

export type PlatformMatchId = RwaPlatformId;

export type PlatformMatchInput = Pick<
  WizardData,
  | "assetType"
  | "estimatedValue"
  | "currency"
  | "country"
  | "documents"
  | "legalStructure"
  | "legalStatus"
  | "investorProfile"
  | "incomeType"
  | "incomeAmountYear"
  | "description"
  | "city"
  | "firstName"
  | "email"
>;

export type PlatformMatchResult = {
  id: PlatformMatchId;
  name: string;
  /** Compatibility fit */
  score: number;
  /** Estimated platform acceptance readiness */
  admissionPercent: number;
  label: "HIGH ADMISSION" | "LIKELY" | "POSSIBLE" | "LOW" | "STRONG MATCH" | "GOOD MATCH";
  description: string;
  url: string;
  processTimeline?: string;
  keyRequirements?: string;
  missingDocuments?: string[];
};

export function assetSlugFromLabel(assetType: string): string {
  if (ASSET_TYPE_SLUG[assetType]) return ASSET_TYPE_SLUG[assetType];
  if (assetType.includes("_")) return assetType;
  return "other";
}

export function valueInEur(value: number, currency: Currency): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  switch (currency) {
    case "USD":
      return value * 0.92;
    case "GBP":
      return value * 1.17;
    case "CHF":
      return value * 1.05;
    default:
      return value;
  }
}

/** @deprecated Use computeAdmissionReadiness — kept for PDF backward compat */
export function calculatePlatformMatch(
  _platform: PlatformMatchId,
  _dossierData: PlatformMatchInput
): number {
  const readiness = computeAdmissionReadiness(
    _dossierData as WizardData
  );
  const hit = readiness.topPlatforms.find((p) => p.id === _platform);
  return hit?.matchPercent ?? 0;
}

/** Rank platforms by admission readiness (top 3 for cards). */
export function getTopPlatformMatches(
  dossierData: PlatformMatchInput
): PlatformMatchResult[] {
  const readiness = computeAdmissionReadiness(dossierData as WizardData);
  return readiness.topPlatforms.slice(0, 3).map((p) => ({
    id: p.id,
    name: p.name,
    score: p.matchPercent,
    admissionPercent: p.admissionPercent,
    label:
      p.admissionPercent >= 82
        ? "HIGH ADMISSION"
        : p.admissionPercent >= 68
          ? "LIKELY"
          : p.admissionPercent >= 50
            ? "POSSIBLE"
            : "LOW",
    description: p.description,
    url: p.url,
    processTimeline: p.processTimeline,
    keyRequirements: p.keyRequirements,
    missingDocuments: p.missingDocuments,
  }));
}

export { DOC_NONE, COUNTRIES_EUROPE };
