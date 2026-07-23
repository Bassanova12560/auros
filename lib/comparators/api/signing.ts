import { createHash, createHmac, timingSafeEqual } from "node:crypto";

import { resolveAttestSigningKey, listAttestSigningKeyCandidates } from "@/lib/protocol/attest/signing";

export const COMPARE_SNAPSHOT_HMAC_PREFIX = "auros-compare:v1:";

/** Prefer ATTEST_SIGNING_KEY (same family as protocol attestations). */
export function resolveCompareSigningKey(): string | null {
  return resolveAttestSigningKey();
}

export function sha256CanonicalJson(value: unknown): string {
  return createHash("sha256")
    .update(stableStringify(value), "utf8")
    .digest("hex");
}

/** Deterministic JSON for HMAC (sorted object keys, no undefined). */
export function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sortKeys);
  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    const v = obj[key];
    if (v === undefined) continue;
    out[key] = sortKeys(v);
  }
  return out;
}

function hmacCompare(secret: string, contentHash: string): string {
  return createHmac("sha256", secret)
    .update(`${COMPARE_SNAPSHOT_HMAC_PREFIX}${contentHash.trim().toLowerCase()}`)
    .digest("hex");
}

export function signCompareContentHash(contentHash: string): string | null {
  const secret = resolveCompareSigningKey();
  if (!secret || !/^[a-f0-9]{64}$/i.test(contentHash.trim())) return null;
  return hmacCompare(secret, contentHash);
}

export function verifyCompareSignature(
  contentHash: string,
  signature: string
): boolean {
  if (!signature?.trim() || !/^[a-f0-9]{64}$/i.test(contentHash.trim())) {
    return false;
  }
  const sig = signature.trim().toLowerCase();
  const b = Buffer.from(sig, "utf8");
  for (const secret of listAttestSigningKeyCandidates()) {
    const expected = hmacCompare(secret, contentHash);
    const a = Buffer.from(expected, "utf8");
    if (a.length === b.length && timingSafeEqual(a, b)) return true;
  }
  return false;
}

export type CompareProof = {
  alg: "HMAC-SHA256";
  prefix: typeof COMPARE_SNAPSHOT_HMAC_PREFIX;
  content_hash: string;
  signature: string | null;
  signed: boolean;
  note: string;
};

export function buildCompareProof(payloadForHash: unknown): CompareProof {
  const content_hash = sha256CanonicalJson(payloadForHash);
  const signature = signCompareContentHash(content_hash);
  return {
    alg: "HMAC-SHA256",
    prefix: COMPARE_SNAPSHOT_HMAC_PREFIX,
    content_hash,
    signature,
    signed: Boolean(signature),
    note: signature
      ? "Proof-at-time-T — verify with POST /api/compare/verify"
      : "Signing key unset — hash only (set ATTEST_SIGNING_KEY for HMAC)",
  };
}
