/**
 * Standalone copy of AUROS Shield core for the npm package
 * (no Next.js path aliases — banks install this in their DMZ).
 */

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SHIELD_VERSION = "0.1.0";

export const SHIELD_DISCLAIMER =
  "AUROS Shield is an indicative on-prem proof runtime — not a regulated HSM certification, not legal advice, not a quantum-safe warranty until a NIST PQC suite is configured.";

export const CRYPTO_PROFILES = [
  "classical_hmac_sha256_v1",
  "hybrid_pqc_ready_v1",
] as const;

export type CryptoProfile = (typeof CRYPTO_PROFILES)[number];
export type ShieldSealKind = "attest" | "cfu_e" | "cfu_w" | "cfu_f" | "audit";

const PREFIX: Record<ShieldSealKind, string> = {
  attest: "auros-attest:v1:",
  cfu_e: "auros-cfu-e:v1:",
  cfu_w: "auros-cfu-w:v1:",
  cfu_f: "auros-cfu-f:v1:",
  audit: "auros-shield-audit:v1:",
};

const SHA256_HEX = /^[a-f0-9]{64}$/i;

export function resolveShieldSigningKey(explicit?: string | null): string | null {
  const fromArg = explicit?.trim();
  if (fromArg) return fromArg;
  return (
    process.env.AUROS_SHIELD_SIGNING_KEY?.trim() ||
    process.env.ATTEST_SIGNING_KEY?.trim() ||
    process.env.GREEN_EXPORT_SIGNING_KEY?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    null
  );
}

export function sha256Hex(payload: string): string {
  return createHash("sha256").update(payload, "utf8").digest("hex");
}

export function isContentHash(value: string): boolean {
  return SHA256_HEX.test(value.trim());
}

function hmacSign(prefix: string, contentHash: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(`${prefix}${contentHash.trim().toLowerCase()}`)
    .digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  const x = Buffer.from(a.trim().toLowerCase(), "utf8");
  const y = Buffer.from(b.trim().toLowerCase(), "utf8");
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

function normalizeProfile(profile?: CryptoProfile): CryptoProfile {
  if (profile && (CRYPTO_PROFILES as readonly string[]).includes(profile)) {
    return profile;
  }
  return "classical_hmac_sha256_v1";
}

export type ShieldSeal = {
  shield_version: string;
  profile: CryptoProfile;
  kind: ShieldSealKind;
  content_hash: string;
  signature: string;
  classical: { alg: "HMAC-SHA256"; prefix: string };
  pqc: {
    status: "not_configured" | "ready_pending_key" | "signed";
    alg: string | null;
    signature: string | null;
  };
  sealed_at: string;
  tenant_ref: string | null;
  disclaimer: string;
};

export function sealLocal(input: {
  kind: ShieldSealKind;
  payload?: string;
  content_hash?: string;
  profile?: CryptoProfile;
  tenant_ref?: string;
}, signingKey?: string | null): ShieldSeal {
  const secret = resolveShieldSigningKey(signingKey);
  if (!secret) {
    throw new Error("AUROS_SHIELD_SIGNING_KEY required for on-prem seal");
  }
  const content_hash = (
    input.content_hash?.trim() ||
    sha256Hex(input.payload ?? "")
  ).toLowerCase();
  if (!isContentHash(content_hash)) {
    throw new Error("content_hash must be 64-char sha256 hex");
  }
  const profile = normalizeProfile(input.profile);
  const prefix = PREFIX[input.kind];
  const signature = hmacSign(prefix, content_hash, secret);
  const pqcConfigured = process.env.AUROS_SHIELD_PQC_MODE?.trim() === "ready";

  return {
    shield_version: SHIELD_VERSION,
    profile,
    kind: input.kind,
    content_hash,
    signature,
    classical: { alg: "HMAC-SHA256", prefix },
    pqc: {
      status: pqcConfigured ? "ready_pending_key" : "not_configured",
      alg: pqcConfigured ? "ML-DSA-65 (planned)" : null,
      signature: null,
    },
    sealed_at: new Date().toISOString(),
    tenant_ref: input.tenant_ref?.trim() || null,
    disclaimer: SHIELD_DISCLAIMER,
  };
}

export function verifyLocal(
  input: {
    kind: ShieldSealKind;
    content_hash: string;
    signature: string;
    profile?: CryptoProfile;
  },
  signingKey?: string | null
) {
  const secret = resolveShieldSigningKey(signingKey);
  const profile = normalizeProfile(input.profile);
  const checked_at = new Date().toISOString();
  if (!secret || !isContentHash(input.content_hash)) {
    return {
      valid: false,
      profile,
      kind: input.kind,
      classical_ok: false,
      pqc_ok: null as boolean | null,
      checked_at,
      disclaimer: SHIELD_DISCLAIMER,
    };
  }
  const expected = hmacSign(PREFIX[input.kind], input.content_hash, secret);
  const classical_ok = safeEqualHex(expected, input.signature);
  return {
    valid: classical_ok,
    profile,
    kind: input.kind,
    classical_ok,
    pqc_ok: null as boolean | null,
    checked_at,
    disclaimer: SHIELD_DISCLAIMER,
  };
}

export function buildCbom(
  deployment: "on_prem" | "edge" | "cloud_gateway" = "on_prem"
) {
  return {
    shield_version: SHIELD_VERSION,
    generated_at: new Date().toISOString(),
    deployment,
    algorithms: [
      {
        id: "HMAC-SHA256",
        purpose: "CFU / attest / Shield audit seals",
        quantum_risk: "classical" as const,
        status: "active" as const,
      },
      {
        id: "SHA-256",
        purpose: "content_hash canonicalization",
        quantum_risk: "classical" as const,
        status: "active" as const,
      },
      {
        id: "ML-DSA-65",
        purpose: "hybrid second signature (roadmap)",
        quantum_risk: "pqc" as const,
        status: "planned" as const,
      },
      {
        id: "ML-KEM-768",
        purpose: "key establishment for Shield sync (roadmap)",
        quantum_risk: "pqc" as const,
        status: "planned" as const,
      },
    ],
    prefixes: Object.values(PREFIX),
    migration: {
      harvest_now_decrypt_later:
        "Long-lived RWA / ESG evidence (7–30y retention) is harvest-now risk — migrate seals to hybrid before quantum cryptanalysis is practical.",
      next_profile: "hybrid_pqc_ready_v1" as CryptoProfile,
      notes: [
        "Keep AUROS_SHIELD_SIGNING_KEY in customer HSM / KMS — never ship raw secrets to AUROS cloud.",
        "Use profile hybrid_pqc_ready_v1 to mark envelopes for dual-verify once PQC keys are issued.",
        "CBOM export supports crypto-inventory requests from risk / procurement teams.",
      ],
    },
    disclaimer: SHIELD_DISCLAIMER,
  };
}
