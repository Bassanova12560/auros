import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  WETS_CRITERIA,
  computeFinalScore,
  gradeFromFinalScore,
  weightsForCategory,
} from "@/lib/wets/constants";
import {
  applyEnergyAndPqcToCriteria,
  quantumBadgeFromCriteria,
} from "@/lib/wets/energy-fields";
import { heuristicWetsCriteria } from "@/lib/wets/heuristic";
import { mergeCriteriaWithDefaults } from "@/lib/wets/merge-criteria";
import { pqcScoreFromChecklist } from "@/lib/wets/pqc-evidence";
import { computeProjectQuantumExposure } from "@/lib/wets/quantum-composite";
import { QUANTUM_EXPOSURE_VERTICALS } from "@/lib/wets/quantum-exposure";
import { QUANTUM_PLAYBOOK_CLAUSES } from "@/lib/wets/quantum-playbook";

describe("wets v2", () => {
  it("has seven criteria with weights summing to 1", () => {
    assert.equal(WETS_CRITERIA.length, 7);
    for (const cat of [
      "water_rights",
      "energy_infra",
      "energy_microgrid",
      "data_center_water",
    ] as const) {
      const w = weightsForCategory(cat);
      const sum = Object.values(w).reduce((a, b) => a + b, 0);
      assert.ok(Math.abs(sum - 1) < 0.001, `${cat} weights=${sum}`);
    }
  });

  it("energy weights prioritize grid interconnection", () => {
    const e = weightsForCategory("energy_infra");
    const w = weightsForCategory("water_rights");
    assert.ok(e.grid_interconnection_realism > w.grid_interconnection_realism);
  });

  it("heuristic returns seven criteria", () => {
    const c = heuristicWetsCriteria({
      name: "AI campus microgrid",
      description:
        "Behind-the-meter SMR + battery, SPV, transfer agent re-issue on key compromise, Michigan cooling",
      jurisdiction: "Michigan",
      legal_structure: "SPV + transfer agent",
      website_url: "https://example.com",
      category: "energy_microgrid",
    });
    assert.equal(c.length, 7);
    assert.ok(computeFinalScore(c) > 0);
    assert.ok(
      c.find((x) => x.category === "grid_interconnection_realism")!.score >= 6
    );
  });

  it("merge fills missing v1 criteria", () => {
    const merged = mergeCriteriaWithDefaults("energy_infra", [
      {
        category: "legal_legitimacy",
        score: 5,
        weight: 0.3,
        justification: "old",
        sources: [],
      },
    ]);
    assert.equal(merged.length, 7);
    assert.equal(merged[0]!.score, 5);
    assert.ok(
      merged.some((c) => c.category === "post_quantum_legal_recourse")
    );
  });

  it("grades bands", () => {
    assert.equal(gradeFromFinalScore(8.1), "A");
    assert.equal(gradeFromFinalScore(3.9), "D");
  });

  it("quantum exposure index has verticals", () => {
    assert.ok(QUANTUM_EXPOSURE_VERTICALS.length >= 5);
  });

  it("unsourced PQC checkboxes do not inflate score", () => {
    const unsourced = pqcScoreFromChecklist({
      offchain_register: true,
      key_compromise_remedy: true,
      token_vs_title: true,
      crypto_agility: true,
    });
    assert.equal(unsourced.sourced, 0);
    assert.ok(unsourced.score <= 3);

    const sourced = pqcScoreFromChecklist(
      {
        offchain_register: true,
        key_compromise_remedy: true,
        token_vs_title: true,
        crypto_agility: false,
      },
      {
        offchain_register: { url: "https://example.com/spa.pdf" },
        key_compromise_remedy: { excerpt: "Issuer may freeze and re-issue" },
        token_vs_title: { url: "https://example.com/om.md" },
      }
    );
    assert.equal(sourced.sourced, 3);
    assert.ok(sourced.score >= 6.5);
  });

  it("BTM and sourced PQC lift grid and quantum scores", () => {
    const base = heuristicWetsCriteria({
      name: "Campus BTM",
      description: "Solar battery campus",
      jurisdiction: "Texas",
      legal_structure: "PPA",
      website_url: "https://example.com",
      category: "energy_microgrid",
    });
    const scored = applyEnergyAndPqcToCriteria("energy_microgrid", base, {
      behind_the_meter: true,
      permits_status: "obtained",
      pqc_checklist: {
        offchain_register: true,
        key_compromise_remedy: true,
        token_vs_title: true,
        crypto_agility: false,
      },
      pqc_evidence: {
        offchain_register: { url: "https://example.com/register" },
        key_compromise_remedy: { excerpt: "re-issue to Register owner" },
        token_vs_title: { url: "https://example.com/claim" },
      },
    });
    assert.ok(
      scored.find((c) => c.category === "grid_interconnection_realism")!
        .score >= 7.5
    );
    const badge = quantumBadgeFromCriteria(scored);
    assert.ok(badge.show);
    assert.ok(badge.score >= 6.5);
  });

  it("project QEI composite reduces exposure with strong recourse", () => {
    const weak = computeProjectQuantumExposure({
      category: "water_rights",
      pqcScore: 2.5,
    });
    const strong = computeProjectQuantumExposure({
      category: "water_rights",
      pqcScore: 8.5,
    });
    assert.ok(strong.effective_exposure < weak.effective_exposure);
    assert.ok(strong.recourse_delta > weak.recourse_delta);
  });

  it("playbook has four clauses", () => {
    assert.equal(QUANTUM_PLAYBOOK_CLAUSES.length, 4);
  });
});
