export type SimSeverity = "error" | "warn";

export type SimCheck = {
  agent: string;
  name: string;
  ok: boolean;
  detail: string;
  severity?: SimSeverity;
};

export type SimAgentResult = {
  id: string;
  label: string;
  checks: SimCheck[];
};

export type EcosystemSimulationOptions = {
  baseUrl?: string;
  withHttp?: boolean;
  withIntegrations?: boolean;
  timeoutMs?: number;
};

export type EcosystemSimulationReport = {
  ok: boolean;
  passed: number;
  total: number;
  warnings: number;
  agents: SimAgentResult[];
  baseUrl: string;
  simulationMode: boolean;
  finishedAt: string;
};

export function check(
  agent: string,
  name: string,
  ok: boolean,
  detail: string,
  severity: SimSeverity = "error"
): SimCheck {
  return { agent, name, ok, detail, severity };
}

export function warnCheck(
  agent: string,
  name: string,
  ok: boolean,
  detail: string
): SimCheck {
  return check(agent, name, ok, detail, "warn");
}

export function summarizeReport(agents: SimAgentResult[]): {
  ok: boolean;
  passed: number;
  total: number;
  warnings: number;
} {
  const checks = agents.flatMap((a) => a.checks);
  const errors = checks.filter((c) => !c.ok && c.severity !== "warn");
  const warnings = checks.filter((c) => !c.ok && c.severity === "warn");
  return {
    ok: errors.length === 0,
    passed: checks.length - errors.length - warnings.length,
    total: checks.length,
    warnings: warnings.length,
  };
}
