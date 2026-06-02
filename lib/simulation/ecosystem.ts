import { runComparatorsAgent } from "@/lib/simulation/agents/comparators.agent";
import {
  runAcademyAsyncAgent,
  runAcademyEnvAgent,
  runAcademyHttpAgent,
  runAcademyLocalAgent,
} from "@/lib/simulation/agents/academy.agent";
import {
  runCronAuthProbe,
  runIntegrationsAgent,
} from "@/lib/simulation/agents/integrations.agent";
import {
  runHttpAgent,
  runHttpGenerateAgent,
} from "@/lib/simulation/agents/http.agent";
import {
  runJurisdictionsAgent,
  runJurisdictionsAsyncAgent,
} from "@/lib/simulation/agents/jurisdictions.agent";
import { runWizardAgent } from "@/lib/simulation/agents/wizard.agent";
import { isSimulationMode } from "@/lib/simulation/mode";
import {
  summarizeReport,
  type EcosystemSimulationOptions,
  type EcosystemSimulationReport,
  type SimAgentResult,
} from "@/lib/simulation/types";

export async function runEcosystemSimulation(
  options: EcosystemSimulationOptions = {}
): Promise<EcosystemSimulationReport> {
  const baseUrl =
    options.baseUrl?.replace(/\/$/, "") ??
    process.env.BASE_URL?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const agents: SimAgentResult[] = [];

  agents.push({
    id: "wizard",
    label: "Wizard & dossier",
    checks: runWizardAgent(),
  });

  agents.push({
    id: "jurisdictions",
    label: "Juridictions & Starter Kit",
    checks: [
      ...runJurisdictionsAgent(),
      ...(await runJurisdictionsAsyncAgent()),
    ],
  });

  agents.push({
    id: "comparators",
    label: "Comparateurs RWA",
    checks: runComparatorsAgent(),
  });

  agents.push({
    id: "academy",
    label: "AUROS Academy (sécurité & intégrité)",
    checks: [
      ...runAcademyLocalAgent(),
      ...runAcademyEnvAgent(),
      ...(await runAcademyAsyncAgent()),
    ],
  });

  if (options.withIntegrations !== false) {
    const integrationChecks = await runIntegrationsAgent();
    agents.push({
      id: "integrations",
      label: "Intégrations (Supabase, Stripe, Resend)",
      checks: integrationChecks,
    });
  }

  if (options.withHttp) {
    const httpChecks = await runHttpAgent(baseUrl, options.timeoutMs);
    httpChecks.push(
      ...(await runHttpGenerateAgent(baseUrl, isSimulationMode()))
    );
    httpChecks.push(...(await runCronAuthProbe(baseUrl)));
    httpChecks.push(...(await runAcademyHttpAgent(baseUrl, options.timeoutMs)));
    agents.push({
      id: "http",
      label: `HTTP smoke (${baseUrl})`,
      checks: httpChecks,
    });
  }

  const summary = summarizeReport(agents);

  return {
    ok: summary.ok,
    passed: summary.passed,
    total: summary.total,
    warnings: summary.warnings,
    agents,
    baseUrl,
    simulationMode: isSimulationMode(),
    finishedAt: new Date().toISOString(),
  };
}

export function formatEcosystemReport(report: EcosystemSimulationReport): string {
  const lines: string[] = [
    `AUROS ecosystem simulation — ${report.finishedAt}`,
    `base=${report.baseUrl} · simulationMode=${report.simulationMode}`,
    "",
  ];

  for (const agent of report.agents) {
    lines.push(`=== ${agent.label} (${agent.id}) ===`);
    for (const c of agent.checks) {
      const tag = c.ok ? "OK" : c.severity === "warn" ? "WARN" : "FAIL";
      lines.push(`  [${tag}] ${c.name} — ${c.detail}`);
    }
    lines.push("");
  }

  lines.push(
    `=== Résumé ${report.passed}/${report.total} OK · ${report.warnings} warnings ===`
  );
  lines.push(report.ok ? "→ Ecosystem healthy" : "→ Fix FAIL items");

  return lines.join("\n");
}

// Backward compatibility for existing imports
export { runWizardAgent as runLocalSimulationChecks } from "@/lib/simulation/agents/wizard.agent";
export { summarizeReport as summarizeChecks } from "@/lib/simulation/types";
