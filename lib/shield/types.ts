/**
 * AUROS Shield — on-prem cryptographic underlayer for RWA proofs.
 *
 * Why it exists: banks and energy operators will need a local root of trust
 * (keys never leave the perimeter) before cloud Protocol APIs are enough —
 * same adoption pattern as quantum-safe appliances: install early, become table stakes.
 *
 * Honest scope today: HMAC-SHA256 seals compatible with CFU / attest prefixes,
 * crypto-agility profiles (classical + pqc_ready envelope metadata), CBOM export.
 * Not a GO/REC, not a bank license, not a NIST-certified PQC implementation yet.
 */

export const SHIELD_VERSION = "0.1.0";

export const SHIELD_DISCLAIMER =
  "AUROS Shield is an indicative on-prem proof runtime — not a regulated HSM certification, not legal advice, not a quantum-safe warranty until a NIST PQC suite is configured.";

/** Algorithm profiles — agility first; PQC material lands later behind the same envelope. */
export const CRYPTO_PROFILES = [
  "classical_hmac_sha256_v1",
  "hybrid_pqc_ready_v1",
] as const;

export type CryptoProfile = (typeof CRYPTO_PROFILES)[number];

export type ShieldSealKind = "attest" | "cfu_e" | "cfu_w" | "cfu_f" | "audit";

export type ShieldSealRequest = {
  kind: ShieldSealKind;
  /** Canonical payload string (already normalized by caller). */
  payload: string;
  /** Optional precomputed sha256 hex of payload. */
  content_hash?: string;
  profile?: CryptoProfile;
  /** Opaque tenant / operator label for CBOM. */
  tenant_ref?: string;
};

export type ShieldSeal = {
  shield_version: string;
  profile: CryptoProfile;
  kind: ShieldSealKind;
  content_hash: string;
  signature: string;
  /** Classical HMAC always present. */
  classical: {
    alg: "HMAC-SHA256";
    prefix: string;
  };
  /** Placeholder for future hybrid PQC second signature. */
  pqc: {
    status: "not_configured" | "ready_pending_key" | "signed";
    alg: string | null;
    signature: string | null;
  };
  sealed_at: string;
  tenant_ref: string | null;
  disclaimer: string;
};

export type ShieldVerifyRequest = {
  kind: ShieldSealKind;
  content_hash: string;
  signature: string;
  profile?: CryptoProfile;
};

export type ShieldVerifyResult = {
  valid: boolean;
  profile: CryptoProfile;
  kind: ShieldSealKind;
  classical_ok: boolean;
  pqc_ok: boolean | null;
  checked_at: string;
  disclaimer: string;
};

export type CryptoBillOfMaterials = {
  shield_version: string;
  generated_at: string;
  deployment: "on_prem" | "edge" | "cloud_gateway";
  algorithms: {
    id: string;
    purpose: string;
    quantum_risk: "classical" | "hybrid_planned" | "pqc";
    status: "active" | "planned" | "deprecated";
  }[];
  prefixes: string[];
  migration: {
    harvest_now_decrypt_later: string;
    next_profile: CryptoProfile;
    notes: string[];
  };
  disclaimer: string;
};
