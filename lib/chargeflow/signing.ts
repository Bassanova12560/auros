import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { resolveAttestSigningKey } from "@/lib/protocol/attest/signing";

import { CHARGEFLOW_HMAC_PREFIX } from "./constants";

const SHA256_HEX = /^[a-f0-9]{64}$/i;

export function isChargeflowContentHash(value: string): boolean {
  return SHA256_HEX.test(value.trim());
}

export function sha256Hex(payload: string): string {
  return createHash("sha256").update(payload, "utf8").digest("hex");
}

export function newChargeflowUnitId(): string {
  return `cfu_e_${randomBytes(12).toString("hex")}`;
}

export function signChargeflowHash(contentHash: string): string | null {
  const secret = resolveAttestSigningKey();
  if (!secret || !isChargeflowContentHash(contentHash)) return null;
  return createHmac("sha256", secret)
    .update(`${CHARGEFLOW_HMAC_PREFIX}${contentHash.trim().toLowerCase()}`)
    .digest("hex");
}

export function verifyChargeflowSignature(
  contentHash: string,
  signature: string
): boolean {
  const expected = signChargeflowHash(contentHash);
  if (!expected || !signature?.trim()) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.trim().toLowerCase(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function requireChargeflowSignature(contentHash: string): string {
  const sig = signChargeflowHash(contentHash);
  if (!sig) {
    throw new Error(
      "ATTEST_SIGNING_KEY (or GREEN_EXPORT_SIGNING_KEY / CRON_SECRET) required"
    );
  }
  return sig;
}
