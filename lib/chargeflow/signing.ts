import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";

import { resolveAttestSigningKey } from "@/lib/protocol/attest/signing";

import {
  hmacPrefixForKind,
  kindFromUnitId,
  type ChargeflowUnitKind,
} from "./constants";

const SHA256_HEX = /^[a-f0-9]{64}$/i;

export function isChargeflowContentHash(value: string): boolean {
  return SHA256_HEX.test(value.trim());
}

export function sha256Hex(payload: string): string {
  return createHash("sha256").update(payload, "utf8").digest("hex");
}

export function newChargeflowUnitId(kind: ChargeflowUnitKind = "e"): string {
  const prefix = kind === "w" ? "cfu_w_" : "cfu_e_";
  return `${prefix}${randomBytes(12).toString("hex")}`;
}

export function signChargeflowHash(
  contentHash: string,
  kind: ChargeflowUnitKind = "e"
): string | null {
  const secret = resolveAttestSigningKey();
  if (!secret || !isChargeflowContentHash(contentHash)) return null;
  return createHmac("sha256", secret)
    .update(`${hmacPrefixForKind(kind)}${contentHash.trim().toLowerCase()}`)
    .digest("hex");
}

export function verifyChargeflowSignature(
  contentHash: string,
  signature: string,
  kind?: ChargeflowUnitKind
): boolean {
  const kinds: ChargeflowUnitKind[] = kind ? [kind] : ["e", "w"];
  for (const k of kinds) {
    const expected = signChargeflowHash(contentHash, k);
    if (!expected || !signature?.trim()) continue;
    const a = Buffer.from(expected, "utf8");
    const b = Buffer.from(signature.trim().toLowerCase(), "utf8");
    if (a.length !== b.length) continue;
    if (timingSafeEqual(a, b)) return true;
  }
  return false;
}

export function verifyChargeflowSignatureForId(
  unitId: string,
  contentHash: string,
  signature: string
): boolean {
  return verifyChargeflowSignature(
    contentHash,
    signature,
    kindFromUnitId(unitId)
  );
}

export function requireChargeflowSignature(
  contentHash: string,
  kind: ChargeflowUnitKind = "e"
): string {
  const sig = signChargeflowHash(contentHash, kind);
  if (!sig) {
    throw new Error(
      "ATTEST_SIGNING_KEY (or GREEN_EXPORT_SIGNING_KEY / CRON_SECRET) required"
    );
  }
  return sig;
}
