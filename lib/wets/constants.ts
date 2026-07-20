/** AUROS Water/Energy Trust Score (WETS) — constants & types */

export const WETS_CRITERIA = [
  "legal_legitimacy",
  "hydrological_risk",
  "social_litigation_risk",
  "grid_interconnection_realism",
  "operational_transparency",
  "token_economics",
  "post_quantum_legal_recourse",
] as const;

export type WetsCriterion = (typeof WETS_CRITERIA)[number];

/** Default weights — energy categories override via weightsForCategory(). Sum = 1. */
export const WETS_WEIGHTS: Record<WetsCriterion, number> = {
  legal_legitimacy: 0.2,
  hydrological_risk: 0.14,
  social_litigation_risk: 0.14,
  grid_interconnection_realism: 0.16,
  operational_transparency: 0.1,
  token_economics: 0.08,
  post_quantum_legal_recourse: 0.18,
};

export const WETS_CRITERION_LABELS: Record<WetsCriterion, string> = {
  legal_legitimacy: "Légitimité légale",
  hydrological_risk: "Risque hydrologique",
  social_litigation_risk: "Risque social / litige",
  grid_interconnection_realism: "Réalisme raccordement réseau",
  operational_transparency: "Transparence opérationnelle",
  token_economics: "Économie du token",
  post_quantum_legal_recourse: "Recours légal post-quantique",
};

export const WETS_CRITERION_HINTS: Record<WetsCriterion, string> = {
  legal_legitimacy:
    "SPV, titre, concession, documentation juridique vérifiable.",
  hydrological_risk:
    "Stress hydrique de zone, contrats d’eau, audits (WELHR).",
  social_litigation_risk:
    "Moratoriums, litiges locaux, social license (risk_events).",
  grid_interconnection_realism:
    "Position dans la queue d’interconnexion, permis obtenus vs demandés, COD crédible — ou microgrid behind-the-meter (SMR / solaire+BESS).",
  operational_transparency:
    "Site, reporting, metering, données publiques.",
  token_economics:
    "Supply, droits économiques, clarté du claim on-chain.",
  post_quantum_legal_recourse:
    "Registre off-chain d’autorité, gel/re-émission si clé compromise, token=claim vs token=title, chemin reseal/PQC.",
};

/** 4 factual questions for post_quantum_legal_recourse scoring */
export const WETS_PQC_QUESTIONS = [
  {
    id: "offchain_register",
    q: "Existe-t-il un registre off-chain (SPV / transfer agent / registrar) qui fait foi légale au-dessus de la possession on-chain du token ?",
  },
  {
    id: "key_compromise_remedy",
    q: "En cas de compromission de clé (y compris scénario quantique), la doc prévoit-elle gel / re-émission / recovery au profit du propriétaire légal ?",
  },
  {
    id: "token_vs_title",
    q: "Le montage est-il « token = title » sans filet, ou « token = claim » adossé à un titre juridique ?",
  },
  {
    id: "crypto_agility",
    q: "Y a-t-il un chemin documenté de reseal / migration de clés (PQC schedule ou équivalent custodian) ?",
  },
] as const;

export const WETS_CATEGORIES = [
  "water_rights",
  "water_credits",
  "energy_infra",
  "energy_microgrid",
  "data_center_water",
  "other",
] as const;

export type WetsCategory = (typeof WETS_CATEGORIES)[number];

export const WETS_CATEGORY_LABELS: Record<WetsCategory, string> = {
  water_rights: "Droits d’eau",
  water_credits: "Crédits eau",
  energy_infra: "Infra énergie (réseau)",
  energy_microgrid: "Microgrid / behind-the-meter",
  data_center_water: "Data center / eau",
  other: "Autre",
};

export function isEnergyHeavyCategory(category: WetsCategory): boolean {
  return (
    category === "energy_infra" ||
    category === "energy_microgrid" ||
    category === "data_center_water"
  );
}

/** Category-aware weights (always sum to 1). */
export function weightsForCategory(
  category: WetsCategory
): Record<WetsCriterion, number> {
  if (category === "energy_microgrid") {
    return {
      legal_legitimacy: 0.18,
      hydrological_risk: 0.08,
      social_litigation_risk: 0.1,
      grid_interconnection_realism: 0.22, // high = documented BTM bypass
      operational_transparency: 0.12,
      token_economics: 0.08,
      post_quantum_legal_recourse: 0.22,
    };
  }
  if (category === "energy_infra") {
    return {
      legal_legitimacy: 0.18,
      hydrological_risk: 0.06,
      social_litigation_risk: 0.12,
      grid_interconnection_realism: 0.26,
      operational_transparency: 0.1,
      token_economics: 0.08,
      post_quantum_legal_recourse: 0.2,
    };
  }
  if (category === "data_center_water") {
    return {
      legal_legitimacy: 0.16,
      hydrological_risk: 0.14,
      social_litigation_risk: 0.12,
      grid_interconnection_realism: 0.22,
      operational_transparency: 0.1,
      token_economics: 0.08,
      post_quantum_legal_recourse: 0.18,
    };
  }
  // water_rights / water_credits / other
  return {
    legal_legitimacy: 0.22,
    hydrological_risk: 0.2,
    social_litigation_risk: 0.18,
    grid_interconnection_realism: 0.06,
    operational_transparency: 0.1,
    token_economics: 0.06,
    post_quantum_legal_recourse: 0.18,
  };
}

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
export const WETS_QUANTUM_INDEX_ROUTE = "/trust/quantum";
export const WETS_DISCLAIMER =
  "AUROS Water/Energy Trust Score — indicative independent screen for water/energy RWAs. Not a credit rating, legal opinion, or investment advice. Counsel required.";
