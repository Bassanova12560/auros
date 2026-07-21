import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** Prefer dedicated attest key for *new* signatures. */
export function resolveAttestSigningKey(): string | null {
  const dedicated = process.env.ATTEST_SIGNING_KEY?.trim();
  if (dedicated) return dedicated;
  const green = process.env.GREEN_EXPORT_SIGNING_KEY?.trim();
  if (green) return green;
  const cron = process.env.CRON_SECRET?.trim();
  return cron || null;
}

/** All keys that may have signed historical attestations (rotation-safe verify). */
export function listAttestSigningKeyCandidates(): string[] {
  const keys = [
    process.env.ATTEST_SIGNING_KEY?.trim(),
    process.env.GREEN_EXPORT_SIGNING_KEY?.trim(),
    process.env.CRON_SECRET?.trim(),
  ].filter((k): k is string => Boolean(k));
  return [...new Set(keys)];
}

const SHA256_HEX = /^[a-f0-9]{64}$/i;

export function isAttestContentHash(value: string): boolean {
  return SHA256_HEX.test(value.trim());
}

function hmacAttest(secret: string, contentHash: string): string {
  return createHmac("sha256", secret)
    .update(`auros-attest:v1:${contentHash.trim().toLowerCase()}`)
    .digest("hex");
}

export function signAttestHash(contentHash: string): string | null {
  const secret = resolveAttestSigningKey();
  if (!secret || !isAttestContentHash(contentHash)) return null;
  return hmacAttest(secret, contentHash);
}

export function verifyAttestSignature(contentHash: string, signature: string): boolean {
  if (!signature?.trim() || !isAttestContentHash(contentHash)) return false;
  const sig = signature.trim().toLowerCase();
  const b = Buffer.from(sig, "utf8");
  for (const secret of listAttestSigningKeyCandidates()) {
    const expected = hmacAttest(secret, contentHash);
    const a = Buffer.from(expected, "utf8");
    if (a.length === b.length && timingSafeEqual(a, b)) return true;
  }
  return false;
}

export function newAttestationId(): string {
  return `att_${randomBytes(12).toString("hex")}`;
}

export function sha256Hex(payload: string): string {
  return createHash("sha256").update(payload, "utf8").digest("hex");
}
