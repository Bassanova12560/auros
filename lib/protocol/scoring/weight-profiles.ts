import type { ScoreDimension } from "./rules";
import { SCORE_DIMENSION_WEIGHTS } from "./rules";

export const SCORE_WEIGHT_PROFILE_IDS = [
  "default",
  "real_estate_fund",
  "credit_fund",
] as const;

export type ScoreWeightProfileId = (typeof SCORE_WEIGHT_PROFILE_IDS)[number];

export type DimensionWeightsPct = Record<ScoreDimension, number>;

/** Percent weights (0–100) per profile — must sum to 100. */
export const SCORE_WEIGHT_PROFILES: Record<ScoreWeightProfileId, DimensionWeightsPct> = {
  default: {
    legal_structure: 25,
    kyc_aml: 20,
    mica_compliance: 30,
    data_room: 15,
    investor_protection: 10,
  },
  real_estate_fund: {
    legal_structure: 30,
    kyc_aml: 15,
    mica_compliance: 25,
    data_room: 20,
    investor_protection: 10,
  },
  credit_fund: {
    legal_structure: 20,
    kyc_aml: 25,
    mica_compliance: 30,
    data_room: 15,
    investor_protection: 10,
  },
};

export type ResolvedScoreWeights = {
  /** Fractions 0–1 for computeProtocolScore */
  fractions: Record<ScoreDimension, number>;
  /** Percent display (sums to 100) */
  applied: DimensionWeightsPct;
  source: "default" | "profile" | "custom";
  profile?: ScoreWeightProfileId;
  normalized: boolean;
};

const DIMENSIONS = Object.keys(SCORE_DIMENSION_WEIGHTS) as ScoreDimension[];

function defaultFractions(): Record<ScoreDimension, number> {
  return { ...SCORE_DIMENSION_WEIGHTS };
}

function pctToFractions(pct: DimensionWeightsPct): Record<ScoreDimension, number> {
  const sum = DIMENSIONS.reduce((acc, d) => acc + pct[d], 0);
  if (sum <= 0) return defaultFractions();
  const out = {} as Record<ScoreDimension, number>;
  for (const d of DIMENSIONS) {
    out[d] = pct[d] / sum;
  }
  return out;
}

export function resolveScoreWeights(input: {
  profile?: ScoreWeightProfileId;
  weights?: Partial<DimensionWeightsPct>;
}): ResolvedScoreWeights {
  if (input.weights) {
    const raw = {} as DimensionWeightsPct;
    for (const d of DIMENSIONS) {
      raw[d] = input.weights[d] ?? 0;
    }
    const sum = DIMENSIONS.reduce((acc, d) => acc + raw[d], 0);
    const normalized = Math.abs(sum - 100) > 0.01;
    const applied = {} as DimensionWeightsPct;
    if (sum <= 0) {
      return {
        fractions: defaultFractions(),
        applied: { ...SCORE_WEIGHT_PROFILES.default },
        source: "default",
        normalized: false,
      };
    }
    for (const d of DIMENSIONS) {
      applied[d] = normalized ? Math.round((raw[d] / sum) * 1000) / 10 : raw[d];
    }
    return {
      fractions: pctToFractions(applied),
      applied,
      source: "custom",
      normalized,
    };
  }

  const profile = input.profile ?? "default";
  const applied = SCORE_WEIGHT_PROFILES[profile] ?? SCORE_WEIGHT_PROFILES.default;
  return {
    fractions: pctToFractions(applied),
    applied: { ...applied },
    source: profile === "default" ? "default" : "profile",
    profile,
    normalized: false,
  };
}

export function requiresPremiumWeights(input: {
  profile?: ScoreWeightProfileId;
  weights?: Partial<DimensionWeightsPct>;
}): boolean {
  if (input.weights) return true;
  if (input.profile && input.profile !== "default") return true;
  return false;
}
