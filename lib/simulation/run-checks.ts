/**
 * @deprecated Use runEcosystemSimulation from ./ecosystem — kept for backward compatibility.
 */
import { runWizardAgent } from "@/lib/simulation/agents/wizard.agent";
import type { SimCheck as EcosystemSimCheck } from "@/lib/simulation/types";

export type SimCheck = { name: string; ok: boolean; detail: string };

export function runLocalSimulationChecks(): SimCheck[] {
  return runWizardAgent().map(({ name, ok, detail }) => ({ name, ok, detail }));
}

export function summarizeChecks(checks: SimCheck[]): {
  passed: number;
  total: number;
  ok: boolean;
} {
  const failed = checks.filter((c) => !c.ok).length;
  return {
    passed: checks.length - failed,
    total: checks.length,
    ok: failed === 0,
  };
}

export function toLegacyChecks(checks: EcosystemSimCheck[]): SimCheck[] {
  return checks.map((c) => ({
    name: `[${c.agent}] ${c.name}`,
    ok: c.ok,
    detail: c.detail,
  }));
}
