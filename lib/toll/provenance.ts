/**
 * AUROS Data Provenance Ledger v0 — indicative trail (raw vs derived).
 * Not an oracle; HITL for auditor / AI citation.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

export type ProvenanceRecord = {
  id: string;
  assetDnaId: string;
  fieldKey: string;
  valueSummary: string;
  originSystem: string;
  actor?: string;
  version: number;
  /** Prior record id when this value is derived / transformed. Absent = raw. */
  transformedFrom?: string;
  createdAt: string;
  /** Optional link to Source Attestation Network enrollment. */
  attestationSourceId?: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "toll-provenance.json");
const CAP = 2_000;

function load(): ProvenanceRecord[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as ProvenanceRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: ProvenanceRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-CAP), null, 2), "utf8");
  } catch {
    // ignore
  }
}

export function isDerivedProvenance(row: ProvenanceRecord): boolean {
  return Boolean(row.transformedFrom);
}

/** Append a provenance row (auto version per asset + field). */
export function appendProvenanceRecord(input: {
  assetDnaId: string;
  fieldKey: string;
  valueSummary: string;
  originSystem: string;
  actor?: string;
  transformedFrom?: string;
  attestationSourceId?: string;
}): ProvenanceRecord {
  const assetDnaId = input.assetDnaId.trim();
  const fieldKey = input.fieldKey.trim().slice(0, 120);
  const all = load();
  const siblings = all.filter(
    (r) => r.assetDnaId === assetDnaId && r.fieldKey === fieldKey
  );
  const version =
    siblings.reduce((max, r) => Math.max(max, r.version), 0) + 1;

  let transformedFrom = input.transformedFrom?.trim() || undefined;
  if (transformedFrom) {
    const parent = all.find((r) => r.id === transformedFrom);
    if (!parent || parent.assetDnaId !== assetDnaId) {
      transformedFrom = undefined;
    }
  }

  const row: ProvenanceRecord = {
    id: `prov_${randomBytes(8).toString("hex")}`,
    assetDnaId,
    fieldKey,
    valueSummary: input.valueSummary.trim().slice(0, 400),
    originSystem: input.originSystem.trim().slice(0, 80),
    actor: input.actor?.trim().slice(0, 120) || undefined,
    version,
    transformedFrom,
    createdAt: new Date().toISOString(),
    attestationSourceId: input.attestationSourceId?.trim() || undefined,
  };
  all.push(row);
  save(all);
  return row;
}

export function listProvenanceForAsset(assetDnaId: string): ProvenanceRecord[] {
  const id = assetDnaId.trim();
  return load()
    .filter((r) => r.assetDnaId === id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * Chain for a field: latest → … → raw (via transformedFrom).
 * Signature keeps fieldKey primary; assetDnaId scopes the asset.
 */
export function getProvenanceChain(
  fieldKey: string,
  assetDnaId: string
): ProvenanceRecord[] {
  const key = fieldKey.trim();
  const asset = assetDnaId.trim();
  const rows = load().filter(
    (r) => r.assetDnaId === asset && r.fieldKey === key
  );
  if (rows.length === 0) return [];

  const byId = new Map(rows.map((r) => [r.id, r]));
  const latest = rows.reduce((a, b) => (a.version >= b.version ? a : b));

  const chain: ProvenanceRecord[] = [];
  const seen = new Set<string>();
  let cur: ProvenanceRecord | undefined = latest;
  while (cur && !seen.has(cur.id)) {
    chain.push(cur);
    seen.add(cur.id);
    cur = cur.transformedFrom ? byId.get(cur.transformedFrom) : undefined;
  }
  return chain;
}
