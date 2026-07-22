/**
 * AUROS Source Attestation Network v0 — enroll + reliability note (HITL).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

export type SourceAttestationKind =
  | "utility"
  | "erp"
  | "bank"
  | "notary"
  | "registry"
  | "sensor"
  | "auditor"
  | "other";

export type SourceAttestationRecord = {
  id: string;
  name: string;
  kind: SourceAttestationKind;
  contactEmail: string;
  reliability: number;
  status: "pending" | "active" | "revoked";
  createdAt: string;
  notes?: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "source-attestations.json");

function load(): SourceAttestationRecord[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(
      readFileSync(FILE, "utf8")
    ) as SourceAttestationRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(rows: SourceAttestationRecord[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-2_000), null, 2), "utf8");
  } catch {
    // ignore
  }
}

export function enrollSourceAttestation(input: {
  name: string;
  kind: SourceAttestationKind;
  contactEmail: string;
  notes?: string;
}): SourceAttestationRecord {
  const row: SourceAttestationRecord = {
    id: `src_${randomBytes(8).toString("hex")}`,
    name: input.name.trim().slice(0, 160),
    kind: input.kind,
    contactEmail: input.contactEmail.trim().toLowerCase(),
    reliability: 40,
    status: "pending",
    createdAt: new Date().toISOString(),
    notes: input.notes?.trim().slice(0, 400),
  };
  const all = load();
  all.push(row);
  save(all);
  return row;
}

export function listSourceAttestations(): SourceAttestationRecord[] {
  return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
