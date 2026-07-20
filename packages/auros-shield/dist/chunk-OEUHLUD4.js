// src/core.ts
import { createHash, createHmac, timingSafeEqual } from "crypto";
var SHIELD_VERSION = "0.1.0";
var SHIELD_DISCLAIMER = "AUROS Shield is an indicative on-prem proof runtime \u2014 not a regulated HSM certification, not legal advice, not a quantum-safe warranty until a NIST PQC suite is configured.";
var CRYPTO_PROFILES = [
  "classical_hmac_sha256_v1",
  "hybrid_pqc_ready_v1"
];
var PREFIX = {
  attest: "auros-attest:v1:",
  cfu_e: "auros-cfu-e:v1:",
  cfu_w: "auros-cfu-w:v1:",
  cfu_f: "auros-cfu-f:v1:",
  audit: "auros-shield-audit:v1:"
};
var SHA256_HEX = /^[a-f0-9]{64}$/i;
function resolveShieldSigningKey(explicit) {
  const fromArg = explicit?.trim();
  if (fromArg) return fromArg;
  return process.env.AUROS_SHIELD_SIGNING_KEY?.trim() || process.env.ATTEST_SIGNING_KEY?.trim() || process.env.GREEN_EXPORT_SIGNING_KEY?.trim() || process.env.CRON_SECRET?.trim() || null;
}
function sha256Hex(payload) {
  return createHash("sha256").update(payload, "utf8").digest("hex");
}
function isContentHash(value) {
  return SHA256_HEX.test(value.trim());
}
function hmacSign(prefix, contentHash, secret) {
  return createHmac("sha256", secret).update(`${prefix}${contentHash.trim().toLowerCase()}`).digest("hex");
}
function safeEqualHex(a, b) {
  const x = Buffer.from(a.trim().toLowerCase(), "utf8");
  const y = Buffer.from(b.trim().toLowerCase(), "utf8");
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}
function normalizeProfile(profile) {
  if (profile && CRYPTO_PROFILES.includes(profile)) {
    return profile;
  }
  return "classical_hmac_sha256_v1";
}
function sealLocal(input, signingKey) {
  const secret = resolveShieldSigningKey(signingKey);
  if (!secret) {
    throw new Error("AUROS_SHIELD_SIGNING_KEY required for on-prem seal");
  }
  const content_hash = (input.content_hash?.trim() || sha256Hex(input.payload ?? "")).toLowerCase();
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
      signature: null
    },
    sealed_at: (/* @__PURE__ */ new Date()).toISOString(),
    tenant_ref: input.tenant_ref?.trim() || null,
    disclaimer: SHIELD_DISCLAIMER
  };
}
function verifyLocal(input, signingKey) {
  const secret = resolveShieldSigningKey(signingKey);
  const profile = normalizeProfile(input.profile);
  const checked_at = (/* @__PURE__ */ new Date()).toISOString();
  if (!secret || !isContentHash(input.content_hash)) {
    return {
      valid: false,
      profile,
      kind: input.kind,
      classical_ok: false,
      pqc_ok: null,
      checked_at,
      disclaimer: SHIELD_DISCLAIMER
    };
  }
  const expected = hmacSign(PREFIX[input.kind], input.content_hash, secret);
  const classical_ok = safeEqualHex(expected, input.signature);
  return {
    valid: classical_ok,
    profile,
    kind: input.kind,
    classical_ok,
    pqc_ok: null,
    checked_at,
    disclaimer: SHIELD_DISCLAIMER
  };
}
function buildCbom(deployment = "on_prem") {
  return {
    shield_version: SHIELD_VERSION,
    generated_at: (/* @__PURE__ */ new Date()).toISOString(),
    deployment,
    algorithms: [
      {
        id: "HMAC-SHA256",
        purpose: "CFU / attest / Shield audit seals",
        quantum_risk: "classical",
        status: "active"
      },
      {
        id: "SHA-256",
        purpose: "content_hash canonicalization",
        quantum_risk: "classical",
        status: "active"
      },
      {
        id: "ML-DSA-65",
        purpose: "hybrid second signature (roadmap)",
        quantum_risk: "pqc",
        status: "planned"
      },
      {
        id: "ML-KEM-768",
        purpose: "key establishment for Shield sync (roadmap)",
        quantum_risk: "pqc",
        status: "planned"
      }
    ],
    prefixes: Object.values(PREFIX),
    migration: {
      harvest_now_decrypt_later: "Long-lived RWA / ESG evidence (7\u201330y retention) is harvest-now risk \u2014 migrate seals to hybrid before quantum cryptanalysis is practical.",
      next_profile: "hybrid_pqc_ready_v1",
      notes: [
        "Keep AUROS_SHIELD_SIGNING_KEY in customer HSM / KMS \u2014 never ship raw secrets to AUROS cloud.",
        "Use profile hybrid_pqc_ready_v1 to mark envelopes for dual-verify once PQC keys are issued.",
        "CBOM export supports crypto-inventory requests from risk / procurement teams."
      ]
    },
    disclaimer: SHIELD_DISCLAIMER
  };
}

export {
  SHIELD_VERSION,
  SHIELD_DISCLAIMER,
  CRYPTO_PROFILES,
  resolveShieldSigningKey,
  sha256Hex,
  isContentHash,
  sealLocal,
  verifyLocal,
  buildCbom
};
