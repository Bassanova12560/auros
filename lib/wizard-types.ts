/**
 * Shared wizard / dossier types used by the AI router, API route, dossier
 * preview, and PDF generator.
 */

import type { MicaAnswers } from "@/lib/mica-checker/types";
import { normalizeDocumentIds } from "@/lib/rwa-document-phases";
import type { ValueBucketId } from "@/lib/wizard-modes";

export type Currency = "EUR" | "USD" | "GBP" | "CHF";

export type WizardData = {
  assetType: string;
  description: string;
  estimatedValue: number;
  currency: Currency;
  country: string;
  city: string;
  documents: string[];
  goals: string[];
  timeline: string;
  platform: string;
  firstName?: string;
  email?: string;
  marketingConsent?: boolean;
  legalStructure: string;
  incomeType: string;
  incomeAmountYear: number;
  incomeDescription: string;
  legalStatus: string[];
  investorProfile: string;
  additionalNotes: string;
  /** Explore mode — valeur par fourchette. */
  valueBucket?: ValueBucketId;
  /** Pro mode — réponses MiCA (étapes 16–20). */
  mica?: Partial<MicaAnswers>;
};

export type DossierContent = {
  legalDescription: string;
  valuation: string;
  dueDiligence: string;
  kycPreFilled: string;
  micaCompliance: string;
  smartContract: string;
};

export type AiProvider = "groq" | "gemini" | "mistral" | "template";

export type AiGenerationMeta = {
  provider: AiProvider;
  generatedAt: string;
};

export const GOAL_LABELS: Record<string, string> = {
  income: "Generate passive income",
  liquidity: "Access liquidity",
  diversification: "Portfolio diversification",
  estate: "Estate planning",
};

const DOC_NONE = "None yet";

/** Normalize partial wizard payloads from localStorage / API body. */
export function normalizeWizardData(
  raw: Partial<WizardData> & Record<string, unknown>
): WizardData {
  const documents = normalizeDocumentIds(
    Array.isArray(raw.documents)
      ? raw.documents.filter((d) => typeof d === "string" && d !== DOC_NONE)
      : []
  );
  const goals = Array.isArray(raw.goals)
    ? raw.goals.filter((g) => typeof g === "string")
    : [];

  const currency = raw.currency;
  const validCurrency: Currency =
    currency === "USD" ||
    currency === "GBP" ||
    currency === "CHF" ||
    currency === "EUR"
      ? currency
      : "EUR";

  return {
    assetType: typeof raw.assetType === "string" ? raw.assetType : "",
    description: typeof raw.description === "string" ? raw.description : "",
    estimatedValue:
      typeof raw.estimatedValue === "number" && Number.isFinite(raw.estimatedValue)
        ? raw.estimatedValue
        : 0,
    currency: validCurrency,
    country: typeof raw.country === "string" ? raw.country : "",
    city: typeof raw.city === "string" ? raw.city : "",
    documents,
    goals,
    timeline: typeof raw.timeline === "string" ? raw.timeline : "",
    platform: typeof raw.platform === "string" ? raw.platform : "",
    firstName:
      typeof raw.firstName === "string" ? raw.firstName : undefined,
    email: typeof raw.email === "string" ? raw.email : undefined,
    marketingConsent: raw.marketingConsent === true,
    legalStructure:
      typeof raw.legalStructure === "string" ? raw.legalStructure : "",
    incomeType: typeof raw.incomeType === "string" ? raw.incomeType : "",
    incomeAmountYear:
      typeof raw.incomeAmountYear === "number" &&
      Number.isFinite(raw.incomeAmountYear)
        ? raw.incomeAmountYear
        : 0,
    incomeDescription:
      typeof raw.incomeDescription === "string" ? raw.incomeDescription : "",
    legalStatus: Array.isArray(raw.legalStatus)
      ? raw.legalStatus.filter((s) => typeof s === "string")
      : [],
    investorProfile:
      typeof raw.investorProfile === "string" ? raw.investorProfile : "",
    additionalNotes:
      typeof raw.additionalNotes === "string" ? raw.additionalNotes : "",
    valueBucket:
      raw.valueBucket === "under_100k" ||
      raw.valueBucket === "100k_500k" ||
      raw.valueBucket === "500k_2m" ||
      raw.valueBucket === "over_2m"
        ? raw.valueBucket
        : undefined,
    mica:
      raw.mica && typeof raw.mica === "object"
        ? (raw.mica as Partial<MicaAnswers>)
        : undefined,
  };
}
