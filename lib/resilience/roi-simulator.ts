import type { WelhrStressBand } from "@/lib/eau/water-legal-risk";

export type RoiStressChoice = WelhrStressBand | "medium";

export type RoiSimulationInput = {
  mw_it: number;
  stress: RoiStressChoice;
  /** €/m³ makeup water — indicative utility band */
  water_eur_per_m3: number;
  /** Target: closed loop vs wet tower */
  target_closed_loop: boolean;
};

export type RoiSimulationResult = {
  water_m3_tower_year: number;
  water_m3_target_year: number;
  savings_m3_year: number;
  savings_eur_low_year: number;
  savings_eur_high_year: number;
  pct_water_reduction: number;
  opex_delta_eur_m_low: number;
  opex_delta_eur_m_high: number;
  assumptions: string[];
};

function towerM3(mw: number): number {
  const kwh = mw * 1_000 * 8_760;
  return Math.round((kwh * 1.8) / 1_000);
}

function closedM3(mw: number): number {
  const kwh = mw * 1_000 * 8_760;
  return Math.round((kwh * 0.5) / 1_000);
}

function stressMult(stress: RoiStressChoice): number {
  switch (stress) {
    case "extreme":
      return 1.25;
    case "high":
      return 1.12;
    case "low":
      return 0.92;
    case "medium":
    case "unknown":
    default:
      return 1;
  }
}

export function simulateSustainableRoi(input: RoiSimulationInput): RoiSimulationResult {
  const mw = Math.max(1, Math.min(500, input.mw_it));
  const mult = stressMult(input.stress);
  const tower = towerM3(mw);
  const target = input.target_closed_loop ? closedM3(mw) : Math.round(tower * 0.75);
  const savingsM3 = Math.max(0, tower - target);
  const pct = tower > 0 ? Math.round((savingsM3 / tower) * 100) : 0;
  const eurPerM3 = Math.max(0.5, Math.min(8, input.water_eur_per_m3));
  const baseEur = (savingsM3 * eurPerM3) / 1_000_000;
  const low = Math.round(baseEur * 0.85 * mult * 100) / 100;
  const high = Math.round(baseEur * 1.15 * mult * 100) / 100;
  const opexLow = Math.round(-high * 0.9 * 10) / 10;
  const opexHigh = Math.round(-low * 0.5 * 10) / 10;

  return {
    water_m3_tower_year: tower,
    water_m3_target_year: target,
    savings_m3_year: savingsM3,
    savings_eur_low_year: low,
    savings_eur_high_year: high,
    pct_water_reduction: pct,
    opex_delta_eur_m_low: opexLow,
    opex_delta_eur_m_high: opexHigh,
    assumptions: [
      "Tour wet ~1,8 L/kWh IT ; cible boucle fermée ~0,5 L/kWh (hypothèses pédagogiques AUROS).",
      `Stress zone ×${mult.toFixed(2)} appliqué aux fourchettes €.`,
      "Ne inclut pas CAPEX refroidissement — voir playbook continuité.",
    ],
  };
}
