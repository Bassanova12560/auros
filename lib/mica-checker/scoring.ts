import type {
  AssetClass,
  EuNexus,
  InvestorType,
  IssuerType,
  MicaAnswers,
  MicaQuestionId,
  MicaReadinessResult,
  MicaTier,
  WhitepaperStatus,
} from "./types";

const WEIGHTS: Record<MicaQuestionId, number> = {
  issuerType: 0.2,
  assetClass: 0.25,
  euNexus: 0.15,
  whitepaper: 0.25,
  investorType: 0.15,
};

const ISSUER_SCORES: Record<IssuerType, number> = {
  company_spv: 92,
  existing_fund: 82,
  individual: 38,
  unsure: 22,
};

const ASSET_SCORES: Record<AssetClass, number> = {
  financial_instrument: 72,
  art_utility: 78,
  e_money: 32,
  unsure: 20,
};

const EU_SCORES: Record<EuNexus, number> = {
  issuer_eu: 58,
  asset_eu: 62,
  investors_eu: 52,
  no_eu: 88,
  unsure: 18,
};

const WHITEPAPER_SCORES: Record<WhitepaperStatus, number> = {
  ready: 95,
  draft: 62,
  none: 22,
  unsure: 15,
};

const INVESTOR_SCORES: Record<InvestorType, number> = {
  professional: 88,
  retail: 48,
  mixed: 42,
  unsure: 28,
};

const QUESTION_SCORE_GETTERS: Record<
  MicaQuestionId,
  (answers: MicaAnswers) => number | null
> = {
  issuerType: (a) => (a.issuerType ? ISSUER_SCORES[a.issuerType] : null),
  assetClass: (a) => (a.assetClass ? ASSET_SCORES[a.assetClass] : null),
  euNexus: (a) => (a.euNexus ? EU_SCORES[a.euNexus] : null),
  whitepaper: (a) => (a.whitepaper ? WHITEPAPER_SCORES[a.whitepaper] : null),
  investorType: (a) =>
    a.investorType ? INVESTOR_SCORES[a.investorType] : null,
};

const RECOMMENDATION_IDS: Record<MicaQuestionId, Record<string, string>> = {
  issuerType: {
    individual: "issuer_structure",
    unsure: "issuer_structure",
    existing_fund: "issuer_governance",
    company_spv: "issuer_ok",
  },
  assetClass: {
    e_money: "asset_emt",
    unsure: "asset_classify",
    financial_instrument: "asset_prospectus",
    art_utility: "asset_whitepaper",
  },
  euNexus: {
    unsure: "eu_nexus",
    issuer_eu: "eu_casp",
    asset_eu: "eu_nexus",
    investors_eu: "eu_prospectus",
    no_eu: "eu_optional",
  },
  whitepaper: {
    none: "whitepaper_draft",
    unsure: "whitepaper_draft",
    draft: "whitepaper_review",
    ready: "whitepaper_ok",
  },
  investorType: {
    retail: "investor_retail",
    mixed: "investor_retail",
    unsure: "investor_define",
    professional: "investor_ok",
  },
};

function tierFromScore(score: number): MicaTier {
  if (score >= 72) return "solid";
  if (score >= 48) return "progress";
  return "early";
}

export function isMicaAnswersComplete(
  answers: MicaAnswers
): answers is Required<MicaAnswers> {
  return (
    answers.issuerType !== null &&
    answers.assetClass !== null &&
    answers.euNexus !== null &&
    answers.whitepaper !== null &&
    answers.investorType !== null
  );
}

export function computeMicaReadiness(answers: MicaAnswers): MicaReadinessResult | null {
  if (!isMicaAnswersComplete(answers)) return null;

  let weighted = 0;
  const gaps: { id: MicaQuestionId; score: number; recId: string }[] = [];

  for (const questionId of Object.keys(WEIGHTS) as MicaQuestionId[]) {
    const score = QUESTION_SCORE_GETTERS[questionId](answers);
    if (score === null) return null;
    weighted += score * WEIGHTS[questionId];
    const answerKey = answers[questionId] as string;
    const recId =
      RECOMMENDATION_IDS[questionId][answerKey] ??
      RECOMMENDATION_IDS[questionId].unsure ??
      questionId;
    gaps.push({ id: questionId, score, recId });
  }

  const score = Math.round(Math.min(100, Math.max(0, weighted)));
  gaps.sort((a, b) => a.score - b.score);

  const seen = new Set<string>();
  const recommendations: { id: string; label: string }[] = [];
  for (const gap of gaps) {
    if (gap.recId.endsWith("_ok")) continue;
    if (seen.has(gap.recId)) continue;
    seen.add(gap.recId);
    recommendations.push({ id: gap.recId, label: gap.recId });
    if (recommendations.length >= 3) break;
  }

  while (recommendations.length < 3) {
    recommendations.push({ id: "counsel", label: "counsel" });
  }

  return {
    score,
    tier: tierFromScore(score),
    recommendations: recommendations.slice(0, 3),
  };
}
