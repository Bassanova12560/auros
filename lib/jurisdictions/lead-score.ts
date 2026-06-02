export type LeadTier = "hot" | "warm" | "cold";

const VALUE_SCORE: Record<string, number> = {
  under1m: 15,
  "1to5m": 45,
  "5to20m": 75,
  over20m: 95,
};

const TYPE_BONUS: Record<string, number> = {
  real_estate: 12,
  funds: 8,
  bonds: 6,
  private_credit: 10,
  other: 0,
};

export function scoreQuoteLead(input: {
  projectValue?: string | null;
  projectType?: string | null;
}): { score: number; tier: LeadTier } {
  const base = VALUE_SCORE[input.projectValue ?? ""] ?? 10;
  const bonus = TYPE_BONUS[input.projectType ?? ""] ?? 0;
  const score = Math.min(100, base + bonus);

  if (score >= 70) return { score, tier: "hot" };
  if (score >= 40) return { score, tier: "warm" };
  return { score, tier: "cold" };
}

export function scoreGuideLead(input: {
  projectType?: string | null;
  jurisdictionCount: number;
}): { score: number; tier: LeadTier } {
  const bonus = TYPE_BONUS[input.projectType ?? ""] ?? 0;
  const jurisdictionBonus = Math.min(20, input.jurisdictionCount * 5);
  const score = Math.min(100, 25 + bonus + jurisdictionBonus);

  if (score >= 55) return { score, tier: "warm" };
  return { score, tier: "cold" };
}
