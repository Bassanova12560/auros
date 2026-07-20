import { computeMicaReadiness } from "@/lib/mica-checker/scoring";
import type { MicaAnswers } from "@/lib/mica-checker/types";
import { rankJurisdictions } from "@/lib/jurisdiction-picker/scoring";
import type { AssetFilter } from "@/lib/jurisdiction-picker/types";
import { SITE_URL } from "@/lib/comparators/site";

import { parseDescription, type ParsedAssetType } from "../nlp/parse-description";
import {
  DIMENSION_RECOMMENDATIONS,
  MICA_CLASSIFICATIONS,
  SCORE_DIMENSION_WEIGHTS,
  type MicaClassification,
  type ScoreDimension,
} from "./rules";
import { gradeFromScore, statusFromScore } from "./grades";
import { resolveScoreWeights, type ScoreWeightProfileId } from "./weight-profiles";

export type StructuredScoreInput = {
  description?: string;
  asset_type?: ParsedAssetType;
  issuer_type?: MicaAnswers["issuerType"];
  asset_class?: MicaAnswers["assetClass"];
  eu_nexus?: MicaAnswers["euNexus"];
  whitepaper?: MicaAnswers["whitepaper"];
  investor_type?: MicaAnswers["investorType"];
  value_eur?: number;
  jurisdiction?: string;
  has_kyc?: boolean;
  has_data_room?: boolean;
  documents_count?: number;
  profile?: ScoreWeightProfileId;
  weights?: Partial<Record<ScoreDimension, number>>;
};

export type ScoreBreakdown = Record<ScoreDimension, number>;

export type ProtocolScoreResult = {
  score: number;
  grade: ReturnType<typeof gradeFromScore>;
  status: ReturnType<typeof statusFromScore>;
  breakdown: ScoreBreakdown;
  mica_classification: MicaClassification;
  critical_gaps: string[];
  recommendations: string[];
  recommended_jurisdictions: { id: string; score: number; rationale: string }[];
  recommended_platforms: { id: string; name: string; category: string; apy: number }[];
  meta: {
    version: "1.0";
    computed_at: string;
    full_report_url: string;
    parsed_keywords: string[];
    weights_applied?: Record<ScoreDimension, number>;
    weights_source?: "default" | "profile" | "custom";
    weights_profile?: ScoreWeightProfileId;
    weights_normalized?: boolean;
  };
};

function assetToJurisdictionFilter(asset: ParsedAssetType): AssetFilter {
  if (asset === "real_estate") return "real_estate";
  if (asset === "bonds") return "bonds";
  if (asset === "private_credit") return "private_credit";
  if (asset === "private_fund") return "funds";
  return "all";
}

function classifyMica(input: StructuredScoreInput, parsed: ReturnType<typeof parseDescription>): MicaClassification {
  const assetClass = input.asset_class ?? parsed.assetClass;
  if (assetClass === "e_money") return "e_money_token";
  if (assetClass === "financial_instrument") return "financial_instrument";
  if (assetClass === "art_utility") return "utility_token";
  if (parsed.assetType === "stablecoins") return "asset_referenced_token";
  if (!assetClass) return "uncertain";
  return "other_crypto_asset";
}

function scoreLegalStructure(input: StructuredScoreInput, parsed: ReturnType<typeof parseDescription>): number {
  let score = 40;
  const issuer = input.issuer_type ?? parsed.issuerType;
  if (issuer === "company_spv") score += 35;
  else if (issuer === "existing_fund") score += 28;
  else if (issuer === "individual") score += 8;
  if (parsed.hasSpvMention) score += 10;
  if (input.jurisdiction || parsed.jurisdictions.length > 0) score += 12;
  return Math.min(100, score);
}

function scoreKycAml(input: StructuredScoreInput, parsed: ReturnType<typeof parseDescription>): number {
  let score = 35;
  if (input.has_kyc || parsed.hasKycMention) score += 35;
  const investor = input.investor_type ?? parsed.investorType;
  if (investor === "professional") score += 20;
  else if (investor === "retail") score += 5;
  else if (investor === "mixed") score += 10;
  return Math.min(100, score);
}

function scoreMicaCompliance(input: StructuredScoreInput, parsed: ReturnType<typeof parseDescription>): number {
  const answers: MicaAnswers = {
    issuerType: input.issuer_type ?? parsed.issuerType ?? "unsure",
    assetClass: input.asset_class ?? parsed.assetClass ?? "unsure",
    euNexus: input.eu_nexus ?? parsed.euNexus ?? "unsure",
    whitepaper: input.whitepaper ?? parsed.whitepaper ?? "unsure",
    investorType: input.investor_type ?? parsed.investorType ?? "unsure",
  };
  const mica = computeMicaReadiness(answers);
  return mica?.score ?? 25;
}

function scoreDataRoom(input: StructuredScoreInput, parsed: ReturnType<typeof parseDescription>): number {
  let score = 30;
  if (input.has_data_room || parsed.hasDataRoomMention) score += 35;
  const docs = input.documents_count ?? 0;
  if (docs >= 5) score += 25;
  else if (docs >= 3) score += 18;
  else if (docs >= 1) score += 10;
  const value = input.value_eur ?? parsed.valueEur;
  if (value && value >= 500_000) score += 8;
  return Math.min(100, score);
}

function scoreInvestorProtection(input: StructuredScoreInput, parsed: ReturnType<typeof parseDescription>): number {
  let score = 40;
  const whitepaper = input.whitepaper ?? parsed.whitepaper;
  if (whitepaper === "ready") score += 35;
  else if (whitepaper === "draft") score += 20;
  const investor = input.investor_type ?? parsed.investorType;
  if (investor === "professional") score += 18;
  else if (investor === "retail") score += 5;
  if (parsed.hasProfessionalMention && !parsed.hasRetailMention) score += 10;
  return Math.min(100, score);
}

function buildCriticalGaps(breakdown: ScoreBreakdown): string[] {
  const dims = (Object.keys(breakdown) as ScoreDimension[]).sort(
    (a, b) => breakdown[a] - breakdown[b]
  );
  const gaps: string[] = [];
  for (const dim of dims) {
    if (breakdown[dim] >= 60) continue;
    const rec = DIMENSION_RECOMMENDATIONS[dim][0];
    if (rec) gaps.push(rec);
    if (gaps.length >= 3) break;
  }
  return gaps;
}

function buildRecommendations(breakdown: ScoreBreakdown): string[] {
  const dims = (Object.keys(breakdown) as ScoreDimension[]).sort(
    (a, b) => breakdown[a] - breakdown[b]
  );
  const recs: string[] = [];
  for (const dim of dims) {
    for (const rec of DIMENSION_RECOMMENDATIONS[dim]) {
      if (recs.includes(rec)) continue;
      recs.push(rec);
      if (recs.length >= 3) return recs;
    }
  }
  return recs.slice(0, 3);
}

function buildWizardUrl(input: StructuredScoreInput, parsed: ReturnType<typeof parseDescription>): string {
  const params = new URLSearchParams();
  const asset = input.asset_type ?? parsed.assetType;
  if (asset && asset !== "other") params.set("asset", asset);
  if (input.jurisdiction) params.set("jurisdiction", input.jurisdiction);
  else if (parsed.jurisdictions[0]) params.set("jurisdiction", parsed.jurisdictions[0]);
  const q = params.toString();
  return `${SITE_URL}/wizard${q ? `?${q}` : ""}`;
}

export function computeProtocolScore(input: StructuredScoreInput): ProtocolScoreResult {
  const parsed = input.description ? parseDescription(input.description) : parseDescription("");
  const assetType = input.asset_type ?? parsed.assetType;

  const breakdown: ScoreBreakdown = {
    legal_structure: scoreLegalStructure(input, parsed),
    kyc_aml: scoreKycAml(input, parsed),
    mica_compliance: scoreMicaCompliance(input, parsed),
    data_room: scoreDataRoom(input, parsed),
    investor_protection: scoreInvestorProtection(input, parsed),
  };

  const resolvedWeights = resolveScoreWeights({
    profile: input.profile,
    weights: input.weights,
  });

  let score = 0;
  for (const dim of Object.keys(SCORE_DIMENSION_WEIGHTS) as ScoreDimension[]) {
    score += breakdown[dim] * resolvedWeights.fractions[dim];
  }
  score = Math.round(Math.min(100, Math.max(0, score)));

  const jurisdictionRank = rankJurisdictions(
    { speed: 55, cost: 50, tax: 45 },
    assetToJurisdictionFilter(assetType)
  );

  const micaClass = classifyMica(input, parsed);
  if (!MICA_CLASSIFICATIONS.includes(micaClass)) {
    // satisfy type narrowing
  }

  let recommendations = buildRecommendations(breakdown);
  if (assetType === "low_carbon_power") {
    recommendations = [
      "Keep nuclear / low-carbon outside AUROS Green Verified — use /power and generation_source (indicative, not GO/REC).",
      ...recommendations.filter(
        (r) => !r.toLowerCase().includes("green verified")
      ),
    ].slice(0, 3);
  }

  return {
    score,
    grade: gradeFromScore(score),
    status: statusFromScore(score),
    breakdown,
    mica_classification: micaClass,
    critical_gaps: buildCriticalGaps(breakdown),
    recommendations,
    recommended_jurisdictions: jurisdictionRank.recommendations.map((r) => ({
      id: r.id,
      score: r.score,
      rationale: r.rationaleId,
    })),
    recommended_platforms: [],
    meta: {
      version: "1.0",
      computed_at: new Date().toISOString(),
      full_report_url: buildWizardUrl(input, parsed),
      parsed_keywords: parsed.keywords,
      weights_applied: resolvedWeights.applied,
      weights_source: resolvedWeights.source,
      weights_profile: resolvedWeights.profile,
      weights_normalized: resolvedWeights.normalized || undefined,
    },
  };
}

export async function attachRecommendedPlatforms(
  result: ProtocolScoreResult,
  platforms: { id: string; name: string; category: string; apy: number }[]
): Promise<ProtocolScoreResult> {
  return {
    ...result,
    recommended_platforms: platforms.slice(0, 3),
  };
}
