import type { WelhrResult, WelhrStressBand } from "@/lib/eau/water-legal-risk";

export const CONTINUITY_WELCOME_ROUTE = "/eau/continuity";
export const CONTINUITY_PLAYBOOK_ROUTE = "/eau/continuity/playbook";

export const CONTINUITY_DISCLAIMER =
  "Playbook de continuité indicatif AUROS — scénarios d’ingénierie et fourchettes économiques à valider par counsel, utility et EPC. Aucune exécution automatique.";

export type ContinuityCoolingProfile = "tower" | "closed_loop" | "hybrid";

export type ContinuityPlaybookInput = {
  project_label: string;
  region: string;
  mw_it: number;
  cooling: ContinuityCoolingProfile;
  welhr: WelhrResult;
};

export type ContinuityScenario = {
  id: string;
  title: string;
  trigger: string;
  actions: string[];
  capex_eur_m: [number, number];
  opex_delta_eur_m_year: [number, number];
  water_savings_m3_year?: number;
  roi_years?: [number, number];
};

export type ContinuityPlaybook = {
  generated_at: string;
  input_summary: string;
  executive_summary: string;
  scenarios: ContinuityScenario[];
  next_steps: string[];
  assumptions: string[];
  disclaimer: string;
};

function stressMultiplier(band: WelhrStressBand): number {
  switch (band) {
    case "extreme":
      return 1.35;
    case "high":
      return 1.2;
    case "medium":
      return 1.05;
    case "low":
      return 0.9;
    default:
      return 1.1;
  }
}

function annualWaterM3Tower(mw: number): number {
  const kwhYear = mw * 1_000 * 8_760;
  const litersPerKwh = 1.8;
  return Math.round((kwhYear * litersPerKwh) / 1_000);
}

function annualWaterM3Closed(mw: number): number {
  const kwhYear = mw * 1_000 * 8_760;
  return Math.round((kwhYear * 0.5) / 1_000);
}

export function buildContinuityPlaybook(input: ContinuityPlaybookInput): ContinuityPlaybook {
  const mult = stressMultiplier(input.welhr.stress_band);
  const mw = Math.max(1, Math.min(500, input.mw_it));
  const towerM3 = annualWaterM3Tower(mw);
  const closedM3 = annualWaterM3Closed(mw);
  const savingsM3 = Math.max(0, towerM3 - closedM3);

  const baseCapexClosed: [number, number] = [
    Math.round((8 + mw * 0.04) * mult * 10) / 10,
    Math.round((14 + mw * 0.07) * mult * 10) / 10,
  ];

  const scenarios: ContinuityScenario[] = [
    {
      id: "non_potable_switch",
      title: "Bascule source non potable",
      trigger:
        input.welhr.stress_band === "extreme" || input.welhr.stress_band === "high"
          ? "Restriction utility / moratorium potable signalé (WELHR elevated)."
          : "Clause contractuelle utility — préférence source industrielle.",
      actions: [
        "Auditer droits eau / permis reuse — mapper titre vs allocation token.",
        "Négocier contrat makeup eau industrielle + monitoring qualité.",
        "Publier disclosure stress zone (WETS social_litigation_risk).",
      ],
      capex_eur_m: [Math.round(1.2 * mult * 10) / 10, Math.round(2.8 * mult * 10) / 10],
      opex_delta_eur_m_year: [-0.4, 0.2],
      water_savings_m3_year: Math.round(savingsM3 * 0.25),
      roi_years: [3, 7],
    },
    {
      id: "closed_loop",
      title: "Refroidissement boucle fermée",
      trigger: `Objectif −70 % eau douce vs tour wet — ${mw} MW IT.`,
      actions: [
        "Étude EPC boucle fermée / adiabatique hybride — capacity rights pack.",
        "Aligner file interconnexion + BTM si délestage énergie couplé.",
        "Checklist PQC + Shield reseal sur contrats refroidissement.",
      ],
      capex_eur_m: baseCapexClosed,
      opex_delta_eur_m_year: [-1.2, -0.3],
      water_savings_m3_year: savingsM3,
      roi_years: [5, 12],
    },
    {
      id: "it_derate",
      title: "Délestage IT graduel (continuité opérationnelle)",
      trigger:
        input.welhr.risk_tier === "elevated"
          ? "Stress hydrique + social license — fenêtre estivale."
          : "Test annuel PRA — pas une panne grid.",
      actions: [
        "Plan 15 / 30 / 50 % derate avec SLA clients cloud documentés.",
        "CFU-E / CFU-W preuves de settle pour reporting RSE.",
        "Mettre à jour WELHR risk events après exercice.",
      ],
      capex_eur_m: [0.2, 0.9],
      opex_delta_eur_m_year: [0.1, 0.6],
      roi_years: [0, 1],
    },
  ];

  const exec = `Projet ${input.project_label} (${mw} MW, ${input.region}) — bande stress ${input.welhr.stress_band}, grade WELHR ${input.welhr.grade}. Trois scénarios indicatifs : bascule non potable (CAPEX faible), boucle fermée (économie d’eau ~${savingsM3.toLocaleString("fr-FR")} m³/an vs tour wet), délestage IT (continuité réputationnelle).`;

  return {
    generated_at: new Date().toISOString(),
    input_summary: `${input.project_label} · ${mw} MW · ${input.cooling} · ${input.region}`,
    executive_summary: exec,
    scenarios,
    next_steps: input.welhr.priorities.slice(0, 3).map((p) => `Priorité WELHR : ${p}`),
    assumptions: [
      "Fourchettes CAPEX/OPEX indicatives — devis EPC et utility requis.",
      "Eau tour 1,8 L/kWh et boucle 0,5 L/kWh — hypothèses pédagogiques AUROS.",
      `Multiplicateur stress zone ×${mult.toFixed(2)} (${input.welhr.stress_band}).`,
    ],
    disclaimer: CONTINUITY_DISCLAIMER,
  };
}

export function continuityPlaybookMarkdown(pb: ContinuityPlaybook): string {
  const lines = [
    `# AUROS — Playbook continuité hydrique / refroidissement (indicatif)`,
    ``,
    pb.disclaimer,
    ``,
    `**Généré :** ${pb.generated_at}`,
    `**Contexte :** ${pb.input_summary}`,
    ``,
    `## Synthèse`,
    ``,
    pb.executive_summary,
    ``,
    `## Scénarios`,
    ``,
  ];
  for (const s of pb.scenarios) {
    lines.push(
      `### ${s.title}`,
      ``,
      `**Déclencheur :** ${s.trigger}`,
      ``,
      `**Actions :**`,
      ...s.actions.map((a) => `- ${a}`),
      ``,
      `**CAPEX (M€) :** ${s.capex_eur_m[0]}–${s.capex_eur_m[1]}`,
      `**Δ OPEX (M€/an) :** ${s.opex_delta_eur_m_year[0]}–${s.opex_delta_eur_m_year[1]}`,
      s.water_savings_m3_year != null
        ? `**Eau évitée (m³/an est.) :** ${s.water_savings_m3_year.toLocaleString("fr-FR")}`
        : "",
      s.roi_years ? `**ROI indicatif (ans) :** ${s.roi_years[0]}–${s.roi_years[1]}` : "",
      ``
    );
  }
  lines.push(`## Prochaines étapes (max 3)`, ``);
  for (const n of pb.next_steps) lines.push(`- ${n}`);
  lines.push(``, `## Hypothèses`, ``);
  for (const a of pb.assumptions) lines.push(`- ${a}`);
  lines.push(
    ``,
    `---`,
    `WELHR : https://getauros.com/eau/risk`,
    `WETS : https://getauros.com/eau/trust`,
    ``
  );
  return lines.filter(Boolean).join("\n");
}
