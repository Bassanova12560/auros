import type { ComparatorId } from "./registry";

export type RiskTier = "conservative" | "core" | "advanced";

export const RISK_TIER_ORDER: RiskTier[] = [
  "conservative",
  "core",
  "advanced",
];

/** Profil de risque unifié — même logique sur tous les comparateurs. */
export function resolveRiskTier(
  comparatorId: ComparatorId,
  category: string
): RiskTier {
  switch (comparatorId) {
    case "stablecoins":
      if (category === "treasury") return "conservative";
      if (category === "credit") return "advanced";
      return "core";
    case "obligations":
      if (category === "sovereign") return "conservative";
      if (category === "structured") return "advanced";
      return "core";
    case "immobilier":
      if (category === "land") return "advanced";
      return "core";
    case "matieres-premieres":
      if (category === "precious_metals") return "conservative";
      return "advanced";
    case "private-credit":
      if (category === "prime") return "core";
      return "advanced";
    case "private-equity":
      if (category === "public_equity") return "core";
      return "advanced";
    case "art-collectibles":
      return "advanced";
    default:
      return "core";
  }
}

/** Suggestions de comparateurs connexes (max 2). */
export const COMPARATOR_CROSS_LINKS: Record<
  ComparatorId,
  ComparatorId[]
> = {
  stablecoins: ["obligations", "private-credit"],
  immobilier: ["stablecoins", "private-equity"],
  obligations: ["stablecoins", "private-credit"],
  "matieres-premieres": ["obligations", "private-equity"],
  "private-credit": ["obligations", "private-equity"],
  "private-equity": ["private-credit", "obligations"],
  "art-collectibles": ["private-equity", "matieres-premieres"],
};
