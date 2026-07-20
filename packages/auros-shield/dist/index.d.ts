/**
 * Standalone copy of AUROS Shield core for the npm package
 * (no Next.js path aliases — banks install this in their DMZ).
 */
declare const SHIELD_VERSION = "0.3.0";
declare const SHIELD_DISCLAIMER = "AUROS Shield is an indicative on-prem proof runtime \u2014 not a regulated HSM certification, not legal advice, not a quantum-safe warranty until a NIST PQC suite is configured.";
declare const CRYPTO_PROFILES: readonly ["classical_hmac_sha256_v1", "hybrid_pqc_ready_v1"];
type CryptoProfile = (typeof CRYPTO_PROFILES)[number];
type ShieldSealKind = "attest" | "cfu_e" | "cfu_w" | "cfu_f" | "audit";
declare function resolveShieldSigningKey(explicit?: string | null): string | null;
declare function sha256Hex(payload: string): string;
declare function isContentHash(value: string): boolean;
type ShieldSeal = {
    shield_version: string;
    profile: CryptoProfile;
    kind: ShieldSealKind;
    content_hash: string;
    signature: string;
    classical: {
        alg: "HMAC-SHA256";
        prefix: string;
    };
    pqc: {
        status: "not_configured" | "ready_pending_key" | "signed";
        alg: string | null;
        signature: string | null;
    };
    sealed_at: string;
    tenant_ref: string | null;
    disclaimer: string;
};
declare function sealLocal(input: {
    kind: ShieldSealKind;
    payload?: string;
    content_hash?: string;
    profile?: CryptoProfile;
    tenant_ref?: string;
}, signingKey?: string | null): ShieldSeal;
declare function verifyLocal(input: {
    kind: ShieldSealKind;
    content_hash: string;
    signature: string;
    profile?: CryptoProfile;
}, signingKey?: string | null): {
    valid: boolean;
    profile: "hybrid_pqc_ready_v1" | "classical_hmac_sha256_v1";
    kind: ShieldSealKind;
    classical_ok: boolean;
    pqc_ok: boolean | null;
    checked_at: string;
    disclaimer: string;
};
declare function buildCbom(deployment?: "on_prem" | "edge" | "cloud_gateway"): {
    shield_version: string;
    generated_at: string;
    deployment: "on_prem" | "edge" | "cloud_gateway";
    algorithms: ({
        id: string;
        purpose: string;
        quantum_risk: "classical";
        status: "active";
    } | {
        id: string;
        purpose: string;
        quantum_risk: "pqc";
        status: "planned";
    })[];
    prefixes: string[];
    migration: {
        harvest_now_decrypt_later: string;
        next_profile: CryptoProfile;
        notes: string[];
    };
    disclaimer: string;
};
/** Non-invasive local tap — hash body, discard, return receipt (no cloud). */
declare function tapLocal(input: {
    body?: string;
    content_hash?: string;
    kind?: ShieldSealKind | "tap";
    profile?: CryptoProfile;
    signingKey?: string | null;
}): {
    shield_version: string;
    mode: "local_tap";
    content_hash: string;
    signature: string;
    kind: ShieldSealKind | "tap";
    profile: "hybrid_pqc_ready_v1" | "classical_hmac_sha256_v1";
    sealed_at: string;
    payload_retained: false;
    next_step: string;
    disclaimer: string;
};

/** One-liner fetch wrapper — non-invasive cloud tap. */
declare function instrumentFetch(config: {
    apiKey: string;
    baseUrl?: string;
    label?: string;
    softFail?: boolean;
}, fetchImpl?: typeof fetch): typeof fetch;

export { CRYPTO_PROFILES, type CryptoProfile, SHIELD_DISCLAIMER, SHIELD_VERSION, type ShieldSeal, type ShieldSealKind, buildCbom, instrumentFetch, isContentHash, resolveShieldSigningKey, sealLocal, sha256Hex, tapLocal, verifyLocal };
