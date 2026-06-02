import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { runComparatorsAgent } from "../lib/simulation/agents/comparators.agent";
import { runJurisdictionsAgent } from "../lib/simulation/agents/jurisdictions.agent";
import { runWizardAgent } from "../lib/simulation/agents/wizard.agent";
import { runEcosystemSimulation } from "../lib/simulation/ecosystem";
import { summarizeReport } from "../lib/simulation/types";

describe("simulation/ecosystem", () => {
  it("wizard agent passes core checks", () => {
    const checks = runWizardAgent();
    assert.ok(checks.length >= 7);
    assert.ok(checks.every((c) => c.ok), checks.filter((c) => !c.ok).map((c) => c.name).join(", "));
  });

  it("jurisdictions agent passes core checks", () => {
    const checks = runJurisdictionsAgent();
    assert.ok(checks.length >= 10);
    assert.ok(checks.every((c) => c.ok), checks.filter((c) => !c.ok).map((c) => c.name).join(", "));
  });

  it("comparators agent passes core checks", () => {
    const checks = runComparatorsAgent();
    assert.ok(checks.length >= 5);
    assert.ok(checks.every((c) => c.ok), checks.filter((c) => !c.ok).map((c) => c.name).join(", "));
  });

  it("ecosystem run without HTTP or integrations", async () => {
    process.env.GEMINI_API_KEY = "";
    process.env.GROQ_API_KEY = "";
    const report = await runEcosystemSimulation({
      withHttp: false,
      withIntegrations: false,
    });
    const summary = summarizeReport(report.agents);
    const failed = report.agents
      .flatMap((a) => a.checks)
      .filter((c) => !c.ok && c.severity !== "warn");
    assert.equal(
      summary.ok,
      true,
      failed.map((c) => `${c.agent}/${c.name}: ${c.detail}`).join("; ")
    );
    assert.ok(report.agents.some((a) => a.id === "wizard"));
    assert.ok(report.agents.some((a) => a.id === "jurisdictions"));
    assert.ok(report.agents.some((a) => a.id === "comparators"));
    assert.ok(report.agents.some((a) => a.id === "academy"));
  });
});
