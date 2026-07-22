/**
 * AUROS Source Attestation Network v1 — enroll + HMAC-signed packets (HITL).
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createHash, randomBytes } from "node:crypto";

import {
  resolveAttestSigningKey,
  signAttestHash,
  verifyAttestSignature,
} from "@/lib/protocol/attest/signing";

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
  /** SHA-256 of canonical enrollment payload */
  contentHash?: string;
  /** HMAC over contentHash (ATTEST_SIGNING_KEY) */
  signature?: string;
  signedAt?: string;
  lastVerifiedAt?: string;
};

export type SourceSignedPacket = {
  sourceId: string;
  occurredAt: string;
  eventType: string;
  payload: Record<string, unknown>;
  contentHash: string;
  signature: string | null;
  verified: boolean;
  disclaimer: string;
};

const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "source-attestations.json");
const DISCLAIMER =
  "Indicative source attestation — HITL. Signature uses AUROS attest key when configured; not a notarial seal.";

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

function canonicalEnrollment(row: {
  id: string;
  name: string;
  kind: string;
  contactEmail: string;
}): string {
  return JSON.stringify({
    id: row.id,
    name: row.name,
    kind: row.kind,
    contactEmail: row.contactEmail,
  });
}

export function enrollSourceAttestation(input: {
  name: string;
  kind: SourceAttestationKind;
  contactEmail: string;
  notes?: string;
}): SourceAttestationRecord {
  const id = `src_${randomBytes(8).toString("hex")}`;
  const name = input.name.trim().slice(0, 160);
  const kind = input.kind;
  const contactEmail = input.contactEmail.trim().toLowerCase();
  const contentHash = createHash("sha256")
    .update(canonicalEnrollment({ id, name, kind, contactEmail }), "utf8")
    .digest("hex");
  const signature = signAttestHash(contentHash) ?? undefined;

  const row: SourceAttestationRecord = {
    id,
    name,
    kind,
    contactEmail,
    reliability: signature ? 55 : 40,
    status: "pending",
    createdAt: new Date().toISOString(),
    notes: input.notes?.trim().slice(0, 400),
    contentHash,
    signature,
    signedAt: signature ? new Date().toISOString() : undefined,
  };
  const all = load();
  all.push(row);
  save(all);
  return row;
}

export function listSourceAttestations(): SourceAttestationRecord[] {
  return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getSourceAttestation(
  id: string
): SourceAttestationRecord | null {
  return load().find((r) => r.id === id) ?? null;
}

/** HITL activate — requires valid signature when signing key present. */
export function activateSourceAttestation(
  id: string
): SourceAttestationRecord | { error: string } {
  const all = load();
  const row = all.find((r) => r.id === id);
  if (!row) return { error: "not_found" };
  if (row.status === "revoked") return { error: "revoked" };

  const keyPresent = Boolean(resolveAttestSigningKey());
  if (keyPresent) {
    if (!row.contentHash || !row.signature) {
      return { error: "unsigned" };
    }
    if (!verifyAttestSignature(row.contentHash, row.signature)) {
      return { error: "bad_signature" };
    }
  }

  row.status = "active";
  row.reliability = Math.max(row.reliability, keyPresent ? 75 : 60);
  row.lastVerifiedAt = new Date().toISOString();
  save(all);
  return row;
}

/** Sign an event packet for an active (or pending) source. */
export function signSourceDataPacket(input: {
  sourceId: string;
  eventType: string;
  payload: Record<string, unknown>;
  occurredAt?: string;
}): SourceSignedPacket | { error: string } {
  const source = getSourceAttestation(input.sourceId);
  if (!source) return { error: "not_found" };
  if (source.status === "revoked") return { error: "revoked" };

  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const eventType = input.eventType.trim().slice(0, 80) || "data_point";
  const body = JSON.stringify({
    sourceId: source.id,
    eventType,
    occurredAt,
    payload: input.payload,
  });
  const contentHash = createHash("sha256").update(body, "utf8").digest("hex");
  const signature = signAttestHash(contentHash);
  return {
    sourceId: source.id,
    occurredAt,
    eventType,
    payload: input.payload,
    contentHash,
    signature,
    verified: Boolean(
      signature && verifyAttestSignature(contentHash, signature)
    ),
    disclaimer: DISCLAIMER,
  };
}

export function verifySourcePacket(input: {
  contentHash: string;
  signature: string;
}): boolean {
  return verifyAttestSignature(input.contentHash, input.signature);
}
