import { createHmac, timingSafeEqual } from "node:crypto";

/** Server-side signing key — dedicated env or CRON_SECRET fallback. */
export function resolveRegistryExportSigningKey(): string | null {
  const dedicated = process.env.GREEN_EXPORT_SIGNING_KEY?.trim();
  if (dedicated) return dedicated;
  const cron = process.env.CRON_SECRET?.trim();
  return cron || null;
}

const SHA256_HEX = /^[a-f0-9]{64}$/i;

export function isRegistryExportContentHash(value: string): boolean {
  return SHA256_HEX.test(value.trim());
}

/** HMAC-SHA256 of content hash — hex digest for PDF footer `sig=` field. */
export function signRegistryExportHash(contentHash: string): string | null {
  const secret = resolveRegistryExportSigningKey();
  if (!secret || !isRegistryExportContentHash(contentHash)) return null;
  return createHmac("sha256", secret)
    .update(contentHash.trim().toLowerCase())
    .digest("hex");
}

export function verifyRegistryExportSignature(
  contentHash: string,
  signature: string
): boolean {
  const expected = signRegistryExportHash(contentHash);
  if (!expected || !signature?.trim()) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.trim(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
