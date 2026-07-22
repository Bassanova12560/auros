/**
 * AUROS Recovery & Continuity Layer v0 — playbook templates + HITL enrollments.
 * Institutions pay to sleep: fallback if source dies, operator disappears,
 * control wallet compromised, SPV servicer change, data vendor death.
 * Indicative continuity attestations — never executed custody recovery.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

export type ContinuityScenarioKind =
  | "source_outage"
  | "operator_loss"
  | "wallet_compromise"
  | "servicer_change"
  | "vendor_death";

export type ContinuityChecklistItem = {
  id: string;
  label: string;
};

export type ContinuityPlaybookTemplate = {
  scenario: ContinuityScenarioKind;
  title: string;
  summary: string;
  checklist: ContinuityChecklistItem[];
};

export type ContinuityPlanRecord = {
  id: string;
  assetDnaId: string;
  scenario: ContinuityScenarioKind;
  status: "enrolled" | "reviewed" | "archived";
  /** Checklist item ids marked done at enroll / review (HITL). */
  checklistDone: string[];
  contactEmail?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

export type ContinuityGap = {
  scenario: ContinuityScenarioKind;
  reason: "no_plan" | "incomplete_checklist";
  missingChecklist: ContinuityChecklistItem[];
};

export type ContinuityReadiness = {
  assetDnaId: string;
  readinessScore: number;
  covered: ContinuityScenarioKind[];
  gaps: ContinuityGap[];
  plans: ContinuityPlanRecord[];
  disclaimer: string;
};

export const CONTINUITY_DISCLAIMER =
  "Indicative continuity playbooks + HITL checklists only — AUROS does not execute custody recovery, key rotation, or servicer substitution.";

export const CONTINUITY_SCENARIO_KINDS: ContinuityScenarioKind[] = [
  "source_outage",
  "operator_loss",
  "wallet_compromise",
  "servicer_change",
  "vendor_death",
];

const SCENARIO_SET = new Set<ContinuityScenarioKind>(CONTINUITY_SCENARIO_KINDS);

export const CONTINUITY_PLAYBOOKS: Record<
  ContinuityScenarioKind,
  ContinuityPlaybookTemplate
> = {
  source_outage: {
    scenario: "source_outage",
    title: "Primary data source outage",
    summary:
      "Fallback feed + stale-data policy when utility / ERP / sensor source dies.",
    checklist: [
      { id: "alt_feed", label: "Alternate feed or manual CSV path documented" },
      { id: "stale_sla", label: "Stale-data SLA + desk alert owner named" },
      { id: "attest_link", label: "Source attestation enrollment linked (if any)" },
      { id: "hitl_resume", label: "HITL resume criteria written (not auto)" },
    ],
  },
  operator_loss: {
    scenario: "operator_loss",
    title: "Operator / key person loss",
    summary:
      "Bus-factor plan if issuer ops or named operator disappears mid-lifecycle.",
    checklist: [
      { id: "deputy", label: "Named deputy + contact channel" },
      { id: "runbook", label: "Ops runbook location + access grant path" },
      { id: "legal_notice", label: "Legal notice template for counterparties" },
      { id: "trail_handoff", label: "Validation trail handoff checklist" },
    ],
  },
  wallet_compromise: {
    scenario: "wallet_compromise",
    title: "Control wallet compromise",
    summary:
      "Indicative freeze / rotate / notify playbook — custody stays with the institution.",
    checklist: [
      { id: "freeze_path", label: "Freeze / pause path (platform or counsel) documented" },
      { id: "rotate_keys", label: "Key rotation owners + dual-control note" },
      { id: "notify_list", label: "Regulator / investor / custodian notify list" },
      { id: "evidence_pack", label: "Evidence pack fields for incident report" },
    ],
  },
  servicer_change: {
    scenario: "servicer_change",
    title: "SPV servicer change",
    summary:
      "Continuity when SPV servicer is replaced — docs, bank accounts, reporting.",
    checklist: [
      { id: "successor", label: "Successor servicer shortlist / clause reference" },
      { id: "bank_cutover", label: "Bank account + payment cutover checklist" },
      { id: "reporting", label: "Investor reporting continuity owners" },
      { id: "dna_update", label: "Asset DNA / Toll identity update steps" },
    ],
  },
  vendor_death: {
    scenario: "vendor_death",
    title: "Data vendor death / exit",
    summary:
      "Replace or archive when a paid data vendor sunsets or fails delivery.",
    checklist: [
      { id: "export_rights", label: "Contractual data export / escrow rights noted" },
      { id: "replacement", label: "Replacement vendor or internal model named" },
      { id: "revalidate", label: "Re-validation trail steps after switch" },
      { id: "budget", label: "Budget / SLA owner for cutover window" },
    ],
  },
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "toll-continuity.json");

export function isContinuityScenarioKind(
  value: unknown
): value is ContinuityScenarioKind {
  return (
    typeof value === "string" &&
    SCENARIO_SET.has(value as ContinuityScenarioKind)
  );
}

export function getContinuityPlaybook(
  scenario: ContinuityScenarioKind
): ContinuityPlaybookTemplate {
  return CONTINUITY_PLAYBOOKS[scenario];
}

export function normalizeOptionalText(
  value: unknown,
  max: number
): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, max);
  return trimmed || undefined;
}

export function normalizeRequiredText(
  value: unknown,
  max: number
): string | null {
  return normalizeOptionalText(value, max) ?? null;
}

function load(): ContinuityPlanRecord[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as ContinuityPlanRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: ContinuityPlanRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-2_000), null, 2), "utf8");
  } catch {
    // ignore
  }
}

function normalizeChecklistDone(
  scenario: ContinuityScenarioKind,
  raw: unknown
): string[] {
  const allowed = new Set(
    CONTINUITY_PLAYBOOKS[scenario].checklist.map((c) => c.id)
  );
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    const id = item.trim();
    if (allowed.has(id) && !out.includes(id)) out.push(id);
  }
  return out;
}

export function parseEnrollContinuityInput(raw: unknown):
  | {
      ok: true;
      data: {
        assetDnaId: string;
        scenario: ContinuityScenarioKind;
        checklistDone: string[];
        contactEmail?: string;
        notes?: string;
      };
    }
  | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "invalid_body" };
  }
  const body = raw as Record<string, unknown>;
  const assetDnaId = normalizeRequiredText(body.assetDnaId, 120);
  if (!assetDnaId) return { ok: false, error: "invalid_asset_dna_id" };
  if (!isContinuityScenarioKind(body.scenario)) {
    return { ok: false, error: "invalid_scenario" };
  }
  const contactEmail = normalizeOptionalText(body.contactEmail, 160);
  if (
    body.contactEmail !== undefined &&
    body.contactEmail !== null &&
    body.contactEmail !== "" &&
    (!contactEmail || !contactEmail.includes("@"))
  ) {
    return { ok: false, error: "invalid_contact_email" };
  }
  return {
    ok: true,
    data: {
      assetDnaId,
      scenario: body.scenario,
      checklistDone: normalizeChecklistDone(
        body.scenario,
        body.checklistDone ?? body.checklist
      ),
      contactEmail: contactEmail?.toLowerCase(),
      notes: normalizeOptionalText(body.notes, 800),
    },
  };
}

export function parseAssessContinuityInput(raw: unknown):
  | {
      ok: true;
      data: {
        assetDnaId: string;
        scenarios?: ContinuityScenarioKind[];
      };
    }
  | { ok: false; error: string } {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "invalid_body" };
  }
  const body = raw as Record<string, unknown>;
  const assetDnaId = normalizeRequiredText(body.assetDnaId, 120);
  if (!assetDnaId) return { ok: false, error: "invalid_asset_dna_id" };

  let scenarios: ContinuityScenarioKind[] | undefined;
  if (body.scenarios !== undefined) {
    if (!Array.isArray(body.scenarios) || body.scenarios.length === 0) {
      return { ok: false, error: "invalid_scenarios" };
    }
    scenarios = [];
    for (const s of body.scenarios) {
      if (!isContinuityScenarioKind(s)) {
        return { ok: false, error: "invalid_scenarios" };
      }
      if (!scenarios.includes(s)) scenarios.push(s);
    }
  }

  return { ok: true, data: { assetDnaId, scenarios } };
}

export function enrollContinuityPlan(input: {
  assetDnaId: string;
  scenario: ContinuityScenarioKind;
  checklistDone?: string[];
  contactEmail?: string;
  notes?: string;
}): ContinuityPlanRecord {
  const now = new Date().toISOString();
  const checklistDone = normalizeChecklistDone(
    input.scenario,
    input.checklistDone ?? []
  );
  const row: ContinuityPlanRecord = {
    id: `cont_${randomBytes(8).toString("hex")}`,
    assetDnaId: input.assetDnaId.trim().slice(0, 120),
    scenario: input.scenario,
    status: "enrolled",
    checklistDone,
    contactEmail: input.contactEmail?.trim().toLowerCase().slice(0, 160),
    notes: input.notes?.trim().slice(0, 800),
    createdAt: now,
    updatedAt: now,
  };
  const all = load();
  all.push(row);
  save(all);
  return row;
}

export function listContinuityPlans(opts?: {
  assetDnaId?: string;
  scenario?: ContinuityScenarioKind;
  limit?: number;
}): ContinuityPlanRecord[] {
  let rows = load().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  if (opts?.assetDnaId) {
    const id = opts.assetDnaId.trim();
    rows = rows.filter((r) => r.assetDnaId === id);
  }
  if (opts?.scenario) {
    rows = rows.filter((r) => r.scenario === opts.scenario);
  }
  const limit = Math.min(Math.max(opts?.limit ?? 50, 1), 200);
  return rows.slice(0, limit);
}

function latestPlanForScenario(
  plans: ContinuityPlanRecord[],
  scenario: ContinuityScenarioKind
): ContinuityPlanRecord | undefined {
  return plans.find(
    (p) => p.scenario === scenario && p.status !== "archived"
  );
}

function scenarioScore(
  plan: ContinuityPlanRecord | undefined,
  scenario: ContinuityScenarioKind
): { score: number; gap?: ContinuityGap } {
  const template = CONTINUITY_PLAYBOOKS[scenario];
  if (!plan) {
    return {
      score: 0,
      gap: {
        scenario,
        reason: "no_plan",
        missingChecklist: template.checklist,
      },
    };
  }
  const done = new Set(plan.checklistDone);
  const missing = template.checklist.filter((c) => !done.has(c.id));
  if (missing.length === 0) {
    return { score: 100 };
  }
  const filled = template.checklist.length - missing.length;
  const partial = Math.round(
    40 + (60 * filled) / Math.max(template.checklist.length, 1)
  );
  return {
    score: partial,
    gap: {
      scenario,
      reason: "incomplete_checklist",
      missingChecklist: missing,
    },
  };
}

/**
 * Indicative readiness: enrolled playbooks + checklist fill vs templates.
 * Does not claim operational continuity or custody recovery capability.
 */
export function assessContinuityReadiness(input: {
  assetDnaId: string;
  scenarios?: ContinuityScenarioKind[];
}): ContinuityReadiness {
  const assetDnaId = input.assetDnaId.trim().slice(0, 120);
  const scenarios =
    input.scenarios && input.scenarios.length > 0
      ? input.scenarios.filter(isContinuityScenarioKind)
      : [...CONTINUITY_SCENARIO_KINDS];

  const plans = listContinuityPlans({ assetDnaId, limit: 200 });
  const covered: ContinuityScenarioKind[] = [];
  const gaps: ContinuityGap[] = [];
  let sum = 0;

  for (const scenario of scenarios) {
    const plan = latestPlanForScenario(plans, scenario);
    const { score, gap } = scenarioScore(plan, scenario);
    sum += score;
    if (plan) covered.push(scenario);
    if (gap) gaps.push(gap);
  }

  const readinessScore =
    scenarios.length === 0
      ? 0
      : Math.round(sum / scenarios.length);

  return {
    assetDnaId,
    readinessScore,
    covered,
    gaps,
    plans: plans.filter((p) => scenarios.includes(p.scenario)),
    disclaimer: CONTINUITY_DISCLAIMER,
  };
}
