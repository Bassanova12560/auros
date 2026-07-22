/**
 * AUROS Confidential Compute / ZK Layer — selective-disclosure stub v0.
 * Product shape for Horizon 3; NOT cryptographic proof production. HITL demo only.
 */

import { createHash, randomBytes } from "node:crypto";

export type ZkClaimType = "eligibility" | "ratio" | "policy_match";

export const ZK_CLAIM_TYPES: readonly ZkClaimType[] = [
  "eligibility",
  "ratio",
  "policy_match",
] as const;

export const ZK_DISCLOSURE_DISCLAIMER =
  "STUB / DEMO only — not a zero-knowledge proof, not confidential compute production. Commitment is SHA-256 over public inputs + salt. HITL required; do not use for regulatory attestation.";

export type SelectiveDisclosureInput = {
  claimType: ZkClaimType;
  /** Fields intentionally revealed in the claim. */
  publicInputs: Record<string, unknown>;
  /** Opaque hints counted but never returned in the claim body. */
  privateHints?: Record<string, unknown>;
  /** Optional salt; random hex generated when omitted. */
  salt?: string;
};

export type SelectiveDisclosureRecipe = {
  version: "v0-stub";
  mode: "selective_disclosure_demo";
  hash: "sha256";
  commitmentPayload: "{ publicInputs, salt }";
  steps: string[];
};

export type SelectiveDisclosureResult = {
  claimId: string;
  claimType: ZkClaimType;
  /** Hex SHA-256 of canonical { publicInputs, salt }. */
  commitment: string;
  revealedFields: string[];
  hiddenFieldCount: number;
  /** Always false in stub — no cryptographic verification layer. */
  verified: false;
  salt: string;
  recipe: SelectiveDisclosureRecipe;
  disclaimer: string;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/** Stable JSON for commitment (sorted object keys, recursive). */
export function canonicalizeForCommitment(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((v) => canonicalizeForCommitment(v)).join(",")}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${canonicalizeForCommitment(obj[k])}`)
    .join(",")}}`;
}

export function isZkClaimType(raw: string): raw is ZkClaimType {
  return (ZK_CLAIM_TYPES as readonly string[]).includes(raw);
}

export function computeDisclosureCommitment(
  publicInputs: Record<string, unknown>,
  salt: string
): string {
  const payload = canonicalizeForCommitment({ publicInputs, salt });
  return createHash("sha256").update(payload).digest("hex");
}

function buildRecipe(claimType: ZkClaimType): SelectiveDisclosureRecipe {
  return {
    version: "v0-stub",
    mode: "selective_disclosure_demo",
    hash: "sha256",
    commitmentPayload: "{ publicInputs, salt }",
    steps: [
      `Confirm claimType=${claimType} matches the business check (eligibility / ratio / policy_match).`,
      "Canonicalize { publicInputs, salt } with sorted keys (see canonicalizeForCommitment).",
      "Recompute SHA-256 hex and compare to claim.commitment via verifyDisclosureStub.",
      "Review revealedFields only; privateHints are never returned — only hiddenFieldCount.",
      "HITL: treat verified=false as intentional; this is not a production ZK / TEE proof.",
    ],
  };
}

/**
 * Build a selective-disclosure claim stub.
 * Reveals publicInputs keys; counts privateHints without emitting their values.
 */
export function buildSelectiveDisclosure(
  input: SelectiveDisclosureInput
): SelectiveDisclosureResult {
  if (!isZkClaimType(input.claimType)) {
    throw new Error("invalid_claim_type");
  }
  if (!isPlainObject(input.publicInputs)) {
    throw new Error("invalid_public_inputs");
  }

  const publicInputs = { ...input.publicInputs };
  const privateHints = isPlainObject(input.privateHints)
    ? input.privateHints
    : {};
  const salt =
    typeof input.salt === "string" && input.salt.trim()
      ? input.salt.trim().slice(0, 128)
      : randomBytes(16).toString("hex");

  const revealedFields = Object.keys(publicInputs).sort();
  const hiddenFieldCount = Object.keys(privateHints).length;
  const commitment = computeDisclosureCommitment(publicInputs, salt);

  return {
    claimId: `zkclaim_${randomBytes(8).toString("hex")}`,
    claimType: input.claimType,
    commitment,
    revealedFields,
    hiddenFieldCount,
    verified: false,
    salt,
    recipe: buildRecipe(input.claimType),
    disclaimer: ZK_DISCLOSURE_DISCLAIMER,
  };
}

/**
 * Pure stub check: recomputes commitment from publicInputs + salt.
 * Does not set verified=true on claims — cryptographic proof remains out of scope.
 */
export function verifyDisclosureStub(
  commitment: string,
  publicInputs: Record<string, unknown>,
  salt: string
): boolean {
  if (typeof commitment !== "string" || !commitment.trim()) return false;
  if (!isPlainObject(publicInputs)) return false;
  if (typeof salt !== "string") return false;
  const expected = computeDisclosureCommitment(publicInputs, salt);
  return expected === commitment.trim().toLowerCase();
}
