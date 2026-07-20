import { createHash, createHmac, timingSafeEqual } from "node:crypto";

import {
  SHIELD_DISCLAIMER,
  SHIELD_VERSION,
  type CryptoProfile,
  type ShieldSealKind,
} from "./types";

/**
 * On-prem non-invasive tap — hash body, discard, return local receipt.
 * Does not phone home; pair with cloud /api/v1/shield/tap for public verify.
 */
export type LocalTapResult = {
  shield_version: string;
  mode: "local_tap";
  content_hash: string;
  signature: string;
  kind: ShieldSealKind | "tap";
  profile: CryptoProfile;
  sealed_at: string;
  payload_retained: false;
  next_step: string;
  disclaimer: string;
};

const TAP_PREFIX = "auros-shield-tap:v1:";

export function tapLocal(input: {
  body?: string;
  content_hash?: string;
  kind?: ShieldSealKind | "tap";
  profile?: CryptoProfile;
  signingKey: string;
}): LocalTapResult {
  let content_hash = input.content_hash?.trim().toLowerCase();
  if (!content_hash && input.body != null) {
    content_hash = createHash("sha256").update(input.body, "utf8").digest("hex");
  }
  if (!content_hash || !/^[a-f0-9]{64}$/.test(content_hash)) {
    throw new Error("body or content_hash required");
  }
  const kind = input.kind ?? "tap";
  const profile = input.profile ?? "classical_hmac_sha256_v1";
  const signature = createHmac("sha256", input.signingKey)
    .update(`${TAP_PREFIX}${content_hash}`)
    .digest("hex");

  return {
    shield_version: SHIELD_VERSION,
    mode: "local_tap",
    content_hash,
    signature,
    kind,
    profile,
    sealed_at: new Date().toISOString(),
    payload_retained: false,
    next_step:
      "Optional: POST content_hash + local_signature to https://getauros.com/api/v1/shield/tap for public counterparty verify",
    disclaimer: SHIELD_DISCLAIMER,
  };
}

export function verifyLocalTap(
  contentHash: string,
  signature: string,
  signingKey: string
): boolean {
  const expected = createHmac("sha256", signingKey)
    .update(`${TAP_PREFIX}${contentHash.trim().toLowerCase()}`)
    .digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.trim().toLowerCase(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
