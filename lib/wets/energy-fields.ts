import {
  WETS_CRITERIA,
  weightsForCategory,
  type WetsCategory,
  type WetsCriterionScore,
} from "./constants";
import { heuristicWetsCriteria } from "./heuristic";

export type WetsEnergyFields = {
  interconnection_queue_position: string | null;
  permits_status: "unknown" | "none" | "filed" | "obtained" | null;
  behind_the_meter: boolean;
  pqc_checklist: Record<string, boolean>;
  is_demo: boolean;
};

export function enrichDescriptionWithEnergyFields(input: {
  description?: string | null;
  interconnection_queue_position?: string | null;
  permits_status?: string | null;
  behind_the_meter?: boolean;
  pqc_checklist?: Record<string, boolean>;
}): string {
  const parts = [input.description?.trim() ?? ""];
  if (input.behind_the_meter) {
    parts.push("Behind-the-meter / microgrid on-site (bypass grid queue).");
  }
  if (input.interconnection_queue_position?.trim()) {
    parts.push(
      `Interconnection queue position: ${input.interconnection_queue_position.trim()}.`
    );
  }
  if (input.permits_status && input.permits_status !== "unknown") {
    parts.push(`Permits status: ${input.permits_status}.`);
  }
  const pqc = input.pqc_checklist ?? {};
  const yes = Object.entries(pqc)
    .filter(([, v]) => v)
    .map(([k]) => k);
  if (yes.length) {
    parts.push(`PQC checklist affirmed: ${yes.join(", ")}.`);
  }
  return parts.filter(Boolean).join(" ");
}

export function pqcScoreFromChecklist(
  checklist: Record<string, boolean>
): { score: number; affirmed: number } {
  const keys = [
    "offchain_register",
    "key_compromise_remedy",
    "token_vs_title",
    "crypto_agility",
  ];
  const affirmed = keys.filter((k) => checklist[k]).length;
  // 0 affirmed → 2.5; 4 → 8.5
  const score = Math.round((2.5 + affirmed * 1.5) * 10) / 10;
  return { score: Math.min(10, score), affirmed };
}

export function applyEnergyAndPqcToCriteria(
  category: WetsCategory,
  base: WetsCriterionScore[],
  fields: {
    behind_the_meter?: boolean;
    permits_status?: string | null;
    interconnection_queue_position?: string | null;
    pqc_checklist?: Record<string, boolean>;
  }
): WetsCriterionScore[] {
  const weights = weightsForCategory(category);
  const byKey = new Map(base.map((c) => [c.category, { ...c, weight: weights[c.category] }]));

  for (const key of WETS_CRITERIA) {
    if (!byKey.has(key)) {
      byKey.set(key, {
        category: key,
        score: 0,
        weight: weights[key],
        justification: "",
        sources: [],
      });
    }
  }

  const grid = byKey.get("grid_interconnection_realism")!;
  if (fields.behind_the_meter) {
    grid.score = Math.max(grid.score, 7.5);
    grid.justification =
      "Behind-the-meter / on-site microgrid documented — reduces dependence on multi-year interconnection queue.";
  } else if (fields.permits_status === "obtained") {
    grid.score = Math.max(grid.score, 6.5);
    grid.justification =
      (grid.justification || "") +
      " Permits obtained (not merely filed).";
  } else if (fields.permits_status === "filed") {
    grid.score = Math.min(grid.score, 4.5);
    grid.justification =
      "Permits filed but not obtained — interconnection realism remains constrained.";
  }
  if (
    fields.interconnection_queue_position &&
    /wait|pending|year|ans|backlog/i.test(fields.interconnection_queue_position)
  ) {
    grid.score = Math.min(grid.score, 3.5);
  }

  const pqc = byKey.get("post_quantum_legal_recourse")!;
  if (fields.pqc_checklist && Object.keys(fields.pqc_checklist).length) {
    const { score, affirmed } = pqcScoreFromChecklist(fields.pqc_checklist);
    pqc.score = score;
    pqc.justification = `PQC checklist: ${affirmed}/4 items affirmed. Without off-chain register + remedy, keep sceptical.`;
  }

  return WETS_CRITERIA.map((k) => byKey.get(k)!);
}

export function scoreDemoProject(input: {
  name: string;
  category: WetsCategory;
  description: string;
  jurisdiction: string;
  legal_structure: string;
  behind_the_meter?: boolean;
  permits_status?: WetsEnergyFields["permits_status"];
  interconnection_queue_position?: string;
  pqc_checklist?: Record<string, boolean>;
}): WetsCriterionScore[] {
  const description = enrichDescriptionWithEnergyFields({
    description: input.description,
    behind_the_meter: input.behind_the_meter,
    permits_status: input.permits_status,
    interconnection_queue_position: input.interconnection_queue_position,
    pqc_checklist: input.pqc_checklist,
  });
  const base = heuristicWetsCriteria({
    name: input.name,
    description,
    jurisdiction: input.jurisdiction,
    legal_structure: input.legal_structure,
    website_url: "https://getauros.com/eau/trust",
    category: input.category,
  });
  return applyEnergyAndPqcToCriteria(input.category, base, {
    behind_the_meter: input.behind_the_meter,
    permits_status: input.permits_status,
    interconnection_queue_position: input.interconnection_queue_position,
    pqc_checklist: input.pqc_checklist,
  });
}

export function quantumBadgeFromCriteria(criteria: WetsCriterionScore[]): {
  show: boolean;
  label: string;
  score: number;
} {
  const pqc = criteria.find((c) => c.category === "post_quantum_legal_recourse");
  const score = pqc?.score ?? 0;
  if (score >= 6.5) {
    return {
      show: true,
      label: "Quantum checklist — recourse path documented (indicative)",
      score,
    };
  }
  if (score >= 4) {
    return {
      show: true,
      label: "Quantum exposure — partial recourse (review required)",
      score,
    };
  }
  return {
    show: true,
    label: "Quantum exposure — weak / undocumented recourse",
    score,
  };
}
