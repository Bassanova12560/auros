/**
 * Bank Policy / Eligibility enterprise pilot — one-tenant sticky package.
 * Indicative HITL only — never auto-blocks markets.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

import type { TollPolicyRuleId } from "./policy";
import type { TollEligibilityRuleId } from "./eligibility";

export const BANK_PILOT_DISCLAIMER =
  "Bank pilot indicative only — AUROS does not auto-block trades. Integrator / bank compliance enforces. HITL.";

export type BankPilotRecord = {
  id: string;
  slug: string;
  bankName: string;
  contactEmail: string;
  jurisdiction?: string;
  policyRules: TollPolicyRuleId[];
  eligibilityRules: TollEligibilityRuleId[];
  /** Optional product tags treated as US-restricted for eligibility. */
  restrictedProductFrames: string[];
  status: "pilot" | "active" | "paused";
  createdAt: string;
  notes?: string;
};

export type BankDecisionLogEntry = {
  id: string;
  bankPilotId: string;
  kind: "policy" | "eligibility";
  query: string;
  decision: string;
  ruleIds: string[];
  reasons: string[];
  trustOverall?: number;
  createdAt: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const PILOTS_FILE = join(DATA_DIR, "toll-bank-pilots.json");
const DECISIONS_FILE = join(DATA_DIR, "toll-bank-decisions.json");
const CAP = 2_000;

const DEFAULT_POLICY: TollPolicyRuleId[] = [
  "deny_unknown",
  "deny_doc_stale_90d",
  "deny_unmapped_entity",
  "review_demo_tier",
  "review_low_trust",
  "require_jurisdiction",
];

const DEFAULT_ELIGIBILITY: TollEligibilityRuleId[] = [
  ...DEFAULT_POLICY,
  "deny_us_restricted",
  "require_wallet_attribution",
  "review_pep",
  "restrict_unaccredited",
];

function loadPilots(): BankPilotRecord[] {
  try {
    if (!existsSync(PILOTS_FILE)) return [];
    const parsed = JSON.parse(readFileSync(PILOTS_FILE, "utf8")) as BankPilotRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePilots(rows: BankPilotRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(PILOTS_FILE, JSON.stringify(rows.slice(-CAP), null, 2), "utf8");
  } catch {
    // ignore
  }
}

function loadDecisions(): BankDecisionLogEntry[] {
  try {
    if (!existsSync(DECISIONS_FILE)) return [];
    const parsed = JSON.parse(
      readFileSync(DECISIONS_FILE, "utf8")
    ) as BankDecisionLogEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDecisions(rows: BankDecisionLogEntry[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(
      DECISIONS_FILE,
      JSON.stringify(rows.slice(-CAP), null, 2),
      "utf8"
    );
  } catch {
    // ignore
  }
}

function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

export function enrollBankPilot(input: {
  bankName: string;
  contactEmail: string;
  slug?: string;
  jurisdiction?: string;
  policyRules?: TollPolicyRuleId[];
  eligibilityRules?: TollEligibilityRuleId[];
  restrictedProductFrames?: string[];
  notes?: string;
}): BankPilotRecord | { error: string } {
  const bankName = input.bankName.trim().slice(0, 120);
  const contactEmail = input.contactEmail.trim().toLowerCase();
  if (!bankName || !contactEmail.includes("@")) {
    return { error: "invalid_input" };
  }
  let slug = slugify(input.slug ?? bankName);
  if (!slug) slug = `bank-${randomBytes(3).toString("hex")}`;
  const all = loadPilots();
  if (all.some((p) => p.slug === slug)) {
    return { error: "slug_taken" };
  }
  const row: BankPilotRecord = {
    id: `bp_${randomBytes(8).toString("hex")}`,
    slug,
    bankName,
    contactEmail,
    jurisdiction: input.jurisdiction?.trim().slice(0, 8),
    policyRules:
      input.policyRules?.length ? input.policyRules : DEFAULT_POLICY,
    eligibilityRules: input.eligibilityRules?.length
      ? input.eligibilityRules
      : DEFAULT_ELIGIBILITY,
    restrictedProductFrames: (input.restrictedProductFrames ?? [
      "us-restricted",
      "restricted",
    ]).map((s) => s.toLowerCase()),
    status: "pilot",
    createdAt: new Date().toISOString(),
    notes: input.notes?.trim().slice(0, 400),
  };
  all.push(row);
  savePilots(all);
  return row;
}

export function getBankPilotBySlug(slug: string): BankPilotRecord | null {
  const s = slugify(slug);
  return loadPilots().find((p) => p.slug === s) ?? null;
}

export function listBankPilots(): BankPilotRecord[] {
  return loadPilots().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function appendBankDecision(
  entry: Omit<BankDecisionLogEntry, "id" | "createdAt">
): BankDecisionLogEntry {
  const row: BankDecisionLogEntry = {
    ...entry,
    id: `bd_${randomBytes(8).toString("hex")}`,
    createdAt: new Date().toISOString(),
  };
  const all = loadDecisions();
  all.push(row);
  saveDecisions(all);
  return row;
}

export function listBankDecisions(input: {
  bankPilotId: string;
  limit?: number;
}): BankDecisionLogEntry[] {
  const limit = Math.min(100, Math.max(1, input.limit ?? 20));
  return loadDecisions()
    .filter((d) => d.bankPilotId === input.bankPilotId)
    .reverse()
    .slice(0, limit);
}
