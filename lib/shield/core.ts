import { createHash, createHmac, timingSafeEqual } from "node:crypto";

import {
  CRYPTO_PROFILES,
  SHIELD_DISCLAIMER,
  SHIELD_VERSION,
  type CryptoBillOfMaterials,
  type CryptoProfile,
  type ShieldSeal,
  type ShieldSealKind,
  type ShieldSealRequest,
  type ShieldVerifyRequest,
  type ShieldVerifyResult,
} from "./types";

const SHA256_HEX = /^[a-f0-9]{64}$/i;

const PREFIX: Record<ShieldSealKind, string> = {
  attest: "auros-attest:v1:",
  cfu_e: "auros-cfu-e:v1:",
  cfu_w: "auros-cfu-w:v1:",
  cfu_f: "auros-cfu-f:v1:",
  audit: "auros-shield-audit:v1:",
};

export function resolveShieldSigningKey(
  explicit?: string | null
): string | null {
  const fromArg = explicit?.trim();
  if (fromArg) return fromArg;
  const dedicated = process.env.AUROS_SHIELD_SIGNING_KEY?.trim();
  if (dedicated) return dedicated;
  const attest = process.env.ATTEST_SIGNING_KEY?.trim();
  if (attest) return attest;
  const green = process.env.GREEN_EXPORT_SIGNING_KEY?.trim();
  if (green) return green;
  const cron = process.env.CRON_SECRET?.trim();
  return cron || null;
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

/**
 * Seal a hash under the customer-held key. Keys stay on the machine that runs Shield.
 */
export function sealLocal(
  input: ShieldSealRequest,
  signingKey?: string | null
): ShieldSeal {
  const secret = resolveShieldSigningKey(signingKey);
  if (!secret) {
    throw new Error(
      "AUROS_SHIELD_SIGNING_KEY (or ATTEST_SIGNING_KEY) required for on-prem seal"
    );
  }
  const content_hash = (
    input.content_hash?.trim() || sha256Hex(input.payload)
  ).toLowerCase();
  if (!isContentHash(content_hash)) {
    throw new Error("content_hash must be 64-char sha256 hex");
  }
  const profile = normalizeProfile(input.profile);
  const prefix = PREFIX[input.kind];
  const signature = hmacSign(prefix, content_hash, secret);

  const pqcConfigured = Boolean(
    process.env.AUROS_SHIELD_PQC_MODE?.trim() === "ready"
  );

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
  input: ShieldVerifyRequest,
  signingKey?: string | null
): ShieldVerifyResult {
  const secret = resolveShieldSigningKey(signingKey);
  const profile = normalizeProfile(input.profile);
  const checked_at = new Date().toISOString();
  if (!secret || !isContentHash(input.content_hash)) {
    return {
      valid: false,
      profile,
      kind: input.kind,
      classical_ok: false,
      pqc_ok: null,
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
    pqc_ok: profile === "hybrid_pqc_ready_v1" ? null : null,
    checked_at,
    disclaimer: SHIELD_DISCLAIMER,
  };
}

/** Cryptographic Bill of Materials — inventory regulators will ask for during PQC migration. */
export function buildCbom(
  deployment: CryptoBillOfMaterials["deployment"] = "on_prem"
): CryptoBillOfMaterials {
  return {
    shield_version: SHIELD_VERSION,
    generated_at: new Date().toISOString(),
    deployment,
    algorithms: [
      {
        id: "HMAC-SHA256",
        purpose: "CFU / attest / Shield audit seals",
        quantum_risk: "classical",
        status: "active",
      },
      {
        id: "SHA-256",
        purpose: "content_hash canonicalization",
        quantum_risk: "classical",
        status: "active",
      },
      {
        id: "ML-DSA-65",
        purpose: "hybrid second signature (roadmap)",
        quantum_risk: "pqc",
        status: "planned",
      },
      {
        id: "ML-KEM-768",
        purpose: "key establishment for Shield sync channels (roadmap)",
        quantum_risk: "pqc",
        status: "planned",
      },
    ],
    prefixes: Object.values(PREFIX),
    migration: {
      harvest_now_decrypt_later:
        "Long-lived RWA / ESG evidence (7–30y retention) is harvest-now risk — migrate seals to hybrid before quantum cryptanalysis is practical.",
      next_profile: "hybrid_pqc_ready_v1",
      notes: [
        "Keep AUROS_SHIELD_SIGNING_KEY in customer HSM / KMS — never ship raw secrets to AUROS cloud.",
        "Use profile hybrid_pqc_ready_v1 to mark envelopes for dual-verify once PQC keys are issued.",
        "CBOM export supports crypto-inventory requests from risk / procurement teams.",
      ],
    },
    disclaimer: SHIELD_DISCLAIMER,
  };
}

export function listProfiles(): readonly CryptoProfile[] {
  return CRYPTO_PROFILES;
}
