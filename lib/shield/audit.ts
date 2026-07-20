/**
 * Premium Shield audit log — hash-only events for SLA / compliance trails.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

export type ShieldAuditEvent = {
  id: string;
  key_hash: string;
  action:
    | "tap"
    | "ingest"
    | "pack"
    | "reseal"
    | "export"
    | "quota_check";
  receipt_id?: string;
  pack_id?: string;
  content_hash?: string;
  meta?: Record<string, unknown>;
  created_at: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "shield-audit.json");

function load(): ShieldAuditEvent[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as ShieldAuditEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: ShieldAuditEvent[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-10_000), null, 2), "utf8");
  } catch {
    // ignore
  }
}

export function appendShieldAudit(
  input: Omit<ShieldAuditEvent, "id" | "created_at">
): ShieldAuditEvent {
  const event: ShieldAuditEvent = {
    ...input,
    id: `sha_${randomBytes(10).toString("hex")}`,
    created_at: new Date().toISOString(),
  };
  const all = load();
  all.push(event);
  save(all);
  return event;
}

export function listShieldAudit(
  keyHash: string,
  limit = 50
): ShieldAuditEvent[] {
  return load()
    .filter((e) => e.key_hash === keyHash)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, Math.min(limit, 200));
}

/** Honest SLA envelope surfaced on Premium Evidence Packs. */
export const SHIELD_SLA = {
  verify_availability_target: "99.9%",
  verify_latency_p99_ms_target: 800,
  receipt_retention_years_min: 7,
  note: "Indicative operational targets — not a regulated SLA contract.",
} as const;
