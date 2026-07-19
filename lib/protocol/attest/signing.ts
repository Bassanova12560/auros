import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

/** Dedicated key preferred; falls back to green export key then CRON_SECRET. */
export function resolveAttestSigningKey(): string | null {
  const dedicated = process.env.ATTEST_SIGNING_KEY?.trim();
  if (dedicated) return dedicated;
  const green = process.env.GREEN_EXPORT_SIGNING_KEY?.trim();
  if (green) return green;
  const cron = process.env.CRON_SECRET?.trim();
  return cron || null;
}

const SHA256_HEX = /^[a-f0-9]{64}$/i;

export function isAttestContentHash(value: string): boolean {
  return SHA256_HEX.test(value.trim());
}

export function signAttestHash(contentHash: string): string | null {
  const secret = resolveAttestSigningKey();
  if (!secret || !isAttestContentHash(contentHash)) return null;
  return createHmac("sha256", secret)
    .update(`auros-attest:v1:${contentHash.trim().toLowerCase()}`)
    .digest("hex");
}

export function verifyAttestSignature(contentHash: string, signature: string): boolean {
  const expected = signAttestHash(contentHash);
  if (!expected || !signature?.trim()) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.trim().toLowerCase(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function newAttestationId(): string {
  return `att_${randomBytes(12).toString("hex")}`;
}

export function sha256Hex(payload: string): string {
  return createHash("sha256").update(payload, "utf8").digest("hex");
}
