import {
  WETS_CRITERIA,
  weightsForCategory,
  type WetsCategory,
  type WetsCriterionScore,
} from "./constants";

/** Ensure all 7 criteria present (fills gaps for projects scored under v1). */
export function mergeCriteriaWithDefaults(
  category: WetsCategory,
  existing: WetsCriterionScore[]
): WetsCriterionScore[] {
  const weights = weightsForCategory(category);
  const byKey = new Map(existing.map((c) => [c.category, c]));
  return WETS_CRITERIA.map((key) => {
    const prev = byKey.get(key);
    if (prev) {
      return { ...prev, weight: weights[key] };
    }
    return {
      category: key,
      score: 0,
      weight: weights[key],
      justification: "",
      sources: [],
    };
  });
}
