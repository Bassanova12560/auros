/**
 * Premium reseal — crypto-agility path toward hybrid_pqc_ready envelopes.
 * v0: re-issue cloud anchor metadata with recommended profile (classical still signs).
 * Honest: full ML-KEM/Dilithium keys land when customer HSM issues hybrid material.
 */

import { createHash, createHmac, randomBytes } from "node:crypto";

import { resolveAttestSigningKey } from "@/lib/protocol/attest/signing";

import { SHIELD_DISCLAIMER, SHIELD_VERSION } from "./types";
import { getReceipt, verifyCloudAnchor } from "./tap";

const RESEAL_PREFIX = "auros-shield-reseal:v1:";

export type ResealResult = {
  reseal_id: string;
  source_receipt_id: string;
  content_hash: string;
  previous_profile: string;
  recommended_profile: "hybrid_pqc_ready_v1";
  reseal_signature: string;
  status: "scheduled_hybrid" | "classical_refreshed";
  note: string;
  created_at: string;
  disclaimer: string;
};

function signReseal(contentHash: string, receiptId: string): string | null {
  const secret = resolveAttestSigningKey();
  if (!secret) return null;
  return createHmac("sha256", secret)
    .update(`${RESEAL_PREFIX}${contentHash}:${receiptId}`)
    .digest("hex");
}

export function resealReceipt(input: {
  receipt_id: string;
  content_hash?: string;
}):
  | { ok: true; reseal: ResealResult }
  | { ok: false; error: string; status: number } {
  const receipt = getReceipt(input.receipt_id);
  if (!receipt) {
    return { ok: false, error: "Receipt not found", status: 404 };
  }
  if (
    input.content_hash &&
    input.content_hash.trim().toLowerCase() !== receipt.content_hash
  ) {
    return { ok: false, error: "content_hash mismatch", status: 400 };
  }
  if (!verifyCloudAnchor(receipt.content_hash, receipt.cloud_signature)) {
    return { ok: false, error: "Source receipt failed verify", status: 400 };
  }

  const reseal_signature = signReseal(receipt.content_hash, receipt.id);
  if (!reseal_signature) {
    return {
      ok: false,
      error: "Reseal signing unavailable (ATTEST_SIGNING_KEY)",
      status: 503,
    };
  }

  const reseal: ResealResult = {
    reseal_id: `srs_${randomBytes(12).toString("hex")}`,
    source_receipt_id: receipt.id,
    content_hash: receipt.content_hash,
    previous_profile: receipt.profile,
    recommended_profile: "hybrid_pqc_ready_v1",
    reseal_signature,
    status: "scheduled_hybrid",
    note:
      "Envelope marked for hybrid_pqc_ready. Classical HMAC co-seal remains valid; attach customer PQC material via on-prem auros-shield when issued.",
    created_at: new Date().toISOString(),
    disclaimer: SHIELD_DISCLAIMER,
  };

  return { ok: true, reseal };
}

export function packResealHint(packHash: string): string {
  return createHash("sha256")
    .update(`${RESEAL_PREFIX}${packHash}:${SHIELD_VERSION}`)
    .digest("hex");
}

export { RESEAL_PREFIX };
