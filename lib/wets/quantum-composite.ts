/**
 * Project-level quantum exposure = vertical QEI base − recourse delta.
 */

import type { WetsCategory } from "./constants";
import {
  QUANTUM_EXPOSURE_VERTICALS,
  type QeiBand,
  type QeiVertical,
  type QeiVerticalId,
} from "./quantum-exposure";

export function qeiVerticalForWetsCategory(
  category: WetsCategory
): QeiVertical {
  const map: Record<WetsCategory, QeiVerticalId> = {
    water_rights: "water_rights",
    water_credits: "water_rights",
    energy_infra: "energy_grid",
    energy_microgrid: "energy_microgrid",
    data_center_water: "energy_grid",
    other: "commodities",
  };
  const id = map[category];
  return (
    QUANTUM_EXPOSURE_VERTICALS.find((v) => v.id === id) ??
    QUANTUM_EXPOSURE_VERTICALS[0]!
  );
}

/** Recourse delta from WETS post_quantum_legal_recourse score (0–10). */
export function recourseDeltaFromPqcScore(pqcScore: number): number {
  const s = Math.max(0, Math.min(10, pqcScore));
  // 2.5 (default weak) → 0; 8.5 (strong sourced) → ~4.2
  return Math.round(Math.max(0, s - 2.5) * 0.7 * 10) / 10;
}

export function bandFromExposure(score: number): QeiBand {
  if (score >= 6.5) return "elevated";
  if (score >= 4) return "moderate";
  return "contained";
}

export type ProjectQuantumExposure = {
  vertical: QeiVertical;
  vertical_base: number;
  pqc_score: number;
  recourse_delta: number;
  effective_exposure: number;
  band: QeiBand;
  label: string;
};

export function computeProjectQuantumExposure(input: {
  category: WetsCategory;
  pqcScore: number;
}): ProjectQuantumExposure {
  const vertical = qeiVerticalForWetsCategory(input.category);
  const recourse_delta = recourseDeltaFromPqcScore(input.pqcScore);
  const effective_exposure = Math.round(
    Math.max(0, Math.min(10, vertical.exposure_score - recourse_delta)) * 10
  ) / 10;
  const band = bandFromExposure(effective_exposure);
  const label =
    band === "contained"
      ? "Exposition effective contenue (recours documenté)"
      : band === "moderate"
        ? "Exposition effective modérée — revue diligence"
        : "Exposition effective élevée vs moyenne de classe";
  return {
    vertical,
    vertical_base: vertical.exposure_score,
    pqc_score: input.pqcScore,
    recourse_delta,
    effective_exposure,
    band,
    label,
  };
}
