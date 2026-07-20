/** AUROS Water/Energy Trust Score (WETS) — constants & types */

export const WETS_CRITERIA = [
  "legal_legitimacy",
  "hydrological_risk",
  "social_litigation_risk",
  "operational_transparency",
  "token_economics",
] as const;

export type WetsCriterion = (typeof WETS_CRITERIA)[number];

export const WETS_WEIGHTS: Record<WetsCriterion, number> = {
  legal_legitimacy: 0.3,
  hydrological_risk: 0.2,
  social_litigation_risk: 0.25,
  operational_transparency: 0.15,
  token_economics: 0.1,
};

export const WETS_CRITERION_LABELS: Record<WetsCriterion, string> = {
  legal_legitimacy: "Légitimité légale",
  hydrological_risk: "Risque hydrologique",
  social_litigation_risk: "Risque social / litige",
  operational_transparency: "Transparence opérationnelle",
  token_economics: "Économie du token",
};

export const WETS_CATEGORIES = [
  "water_rights",
  "water_credits",
  "energy_infra",
  "data_center_water",
  "other",
] as const;

export type WetsCategory = (typeof WETS_CATEGORIES)[number];

export const WETS_CATEGORY_LABELS: Record<WetsCategory, string> = {
  water_rights: "Droits d’eau",
  water_credits: "Crédits eau",
  energy_infra: "Infra énergie",
  data_center_water: "Data center / eau",
  other: "Autre",
};

export type WetsGrade = "A" | "B" | "C" | "D";

export type WetsCriterionScore = {
  category: WetsCriterion;
  score: number;
  weight: number;
  justification: string;
  sources: string[];
};

export type WetsProject = {
  id: string;
  owner_user_id: string | null;
  name: string;
  ticker: string | null;
  category: WetsCategory;
  website_url: string | null;
  description: string | null;
  legal_structure: string | null;
  jurisdiction: string | null;
  status: "draft" | "published";
  public_slug: string | null;
  report_markdown: string | null;
  report_html: string | null;
  created_at: string;
  updated_at: string;
};

export type WetsTrustRow = {
  id: string;
  name: string;
  ticker: string | null;
  category: WetsCategory;
  status: "draft" | "published";
  jurisdiction: string | null;
  public_slug: string | null;
  owner_user_id: string | null;
  created_at: string;
  final_score: number;
  grade: WetsGrade;
};

export function gradeFromFinalScore(score: number): WetsGrade {
  if (score >= 8) return "A";
  if (score >= 6) return "B";
  if (score >= 4) return "C";
  return "D";
}

export function computeFinalScore(criteria: WetsCriterionScore[]): number {
  const sum = criteria.reduce((acc, c) => acc + c.score * c.weight, 0);
  return Math.round(sum * 10) / 10;
}

export const WETS_CONSOLE_ROUTE = "/eau/trust";
export const WETS_DISCLAIMER =
  "AUROS Water/Energy Trust Score — indicative independent screen for water/energy RWAs. Not a credit rating, legal opinion, or investment advice. Counsel required.";
