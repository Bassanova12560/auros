import type { Locale } from "@/lib/i18n";
import { GREEN_WIZARD_ASSET_TYPE } from "@/lib/green/constants";
import { rankJurisdictions } from "@/lib/jurisdiction-picker/scoring";
import type {
  AssetFilter,
  JurisdictionPickerResult,
  JurisdictionPriorities,
} from "@/lib/jurisdiction-picker/types";
import { computeMicaReadiness } from "@/lib/mica-checker/scoring";
import type { MicaAnswers, InvestorType, IssuerType } from "@/lib/mica-checker/types";
import type { ParsedAssetType } from "@/lib/protocol/nlp/parse-description";
import {
  computeProtocolScore,
  type ProtocolScoreResult,
  type StructuredScoreInput,
} from "@/lib/protocol/scoring/compute-score";
import type { ScoreDimension } from "@/lib/protocol/scoring/rules";
import { computeEaseSummary, type EaseSummary } from "@/lib/readiness-ease";
import { assetSlugFromWizardType } from "@/lib/wizard-asset-slug";
import { bucketMidpoint, type WizardMode } from "@/lib/wizard-modes";
import { computeWizardScore, type ScoreResult } from "@/lib/wizard-scoring";
import type { WizardData } from "@/lib/wizard-types";
import { DOC_NONE } from "@/lib/wizard-constants";

export type ExploreScoringResult = {
  mode: "explore";
  ease: EaseSummary;
  score: ScoreResult;
};

export type ProScoringResult = {
  mode: "pro";
  ease: EaseSummary;
  protocol: ProtocolScoreResult;
  mica: ReturnType<typeof computeMicaReadiness> | null;
  jurisdictions: JurisdictionPickerResult;
};

export type UnifiedWizardScoring = ExploreScoringResult | ProScoringResult;

const DEFAULT_JURISDICTION_PRIORITIES: JurisdictionPriorities = {
  speed: 55,
  cost: 50,
  tax: 45,
};

const DIMENSION_LABELS_FR: Record<ScoreDimension, string> = {
  legal_structure: "Structure juridique",
  kyc_aml: "KYC / AML",
  mica_compliance: "Conformité MiCA",
  data_room: "Data room",
  investor_protection: "Protection investisseurs",
};

const DIMENSION_LABELS_EN: Record<ScoreDimension, string> = {
  legal_structure: "Legal structure",
  kyc_aml: "KYC / AML",
  mica_compliance: "MiCA compliance",
  data_room: "Data room",
  investor_protection: "Investor protection",
};

function slugToParsedAssetType(slug: string): ParsedAssetType {
  if (slug === "real_estate" || slug === "land_island") return "real_estate";
  if (slug === "private_credit") return "private_credit";
  if (slug === "precious_metals") return "commodities";
  return "other";
}

function assetFilterFromWizard(data: WizardData): AssetFilter {
  if (data.assetType === GREEN_WIZARD_ASSET_TYPE) return "all";
  const slug = assetSlugFromWizardType(data.assetType);
  if (slug === "real_estate" || slug === "land_island") return "real_estate";
  if (slug === "private_credit") return "private_credit";
  return "all";
}

function mapLegalStructureToIssuer(legalStructure: string): IssuerType | undefined {
  switch (legalStructure) {
    case "Through a company / SCI":
      return "company_spv";
    case "Through a trust or foundation":
      return "existing_fund";
    case "Personal ownership (direct)":
      return "individual";
    default:
      return undefined;
  }
}

function mapInvestorProfileToType(profile: string): InvestorType | undefined {
  switch (profile) {
    case "Retail investors (general public)":
      return "retail";
    case "Accredited investors only":
    case "Institutional investors":
      return "professional";
    default:
      return undefined;
  }
}

function buildMicaAnswers(data: WizardData): MicaAnswers | null {
  const m = data.mica;
  if (!m) return null;
  const answers: MicaAnswers = {
    issuerType: m.issuerType ?? null,
    assetClass: m.assetClass ?? null,
    euNexus: m.euNexus ?? null,
    whitepaper: m.whitepaper ?? null,
    investorType: m.investorType ?? null,
  };
  const hasAny = Object.values(answers).some((v) => v != null);
  return hasAny ? answers : null;
}

/** Map wizard payload → protocol scoring input. */
export function wizardToProtocolInput(data: WizardData): StructuredScoreInput {
  const slug = assetSlugFromWizardType(data.assetType);
  const docs = (data.documents ?? []).filter((d) => d !== DOC_NONE);
  const mica = data.mica ?? {};
  const valueEur = data.valueBucket
    ? bucketMidpoint(data.valueBucket)
    : data.estimatedValue;

  return {
    description: data.description,
    asset_type: slugToParsedAssetType(slug),
    issuer_type:
      mica.issuerType ?? mapLegalStructureToIssuer(data.legalStructure),
    asset_class: mica.assetClass ?? undefined,
    eu_nexus: mica.euNexus ?? undefined,
    whitepaper: mica.whitepaper ?? undefined,
    investor_type:
      mica.investorType ?? mapInvestorProfileToType(data.investorProfile),
    value_eur: valueEur > 0 ? valueEur : undefined,
    jurisdiction: data.country || undefined,
    has_kyc: docs.includes("kyc_aml_policy") || docs.includes("spv_documents"),
    has_data_room: docs.length >= 3,
    documents_count: docs.length,
  };
}

export function getScoreDimensionLabels(
  locale: Locale
): Record<ScoreDimension, string> {
  return locale === "fr" ? DIMENSION_LABELS_FR : DIMENSION_LABELS_EN;
}

export function computeUnifiedWizardScore(
  mode: WizardMode,
  data: WizardData,
  locale: Locale = "fr",
  jurisdictionPriorities: JurisdictionPriorities = DEFAULT_JURISDICTION_PRIORITIES
): UnifiedWizardScoring {
  if (mode === "explore") {
    const score = computeWizardScore(data, locale);
    const ease = computeEaseSummary(data, locale, score.score);
    return { mode: "explore", ease, score };
  }

  const protocol = computeProtocolScore(wizardToProtocolInput(data));
  const micaAnswers = buildMicaAnswers(data);
  const mica = micaAnswers ? computeMicaReadiness(micaAnswers) : null;
  const jurisdictions = rankJurisdictions(
    jurisdictionPriorities,
    assetFilterFromWizard(data)
  );
  const ease = computeEaseSummary(data, locale, protocol.score);

  return { mode: "pro", ease, protocol, mica, jurisdictions };
}
