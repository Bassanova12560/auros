import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { resolveAttestSigningKey } from "@/lib/protocol/attest/signing";

import { SHIELD_DISCLAIMER, SHIELD_VERSION } from "./types";
import type { CryptoProfile, ShieldSealKind } from "./types";

export const ANCHOR_PREFIX = "auros-shield-anchor:v1:";

export type ShieldReceipt = {
  id: string;
  shield_version: string;
  kind: ShieldSealKind | "tap";
  content_hash: string;
  /** Customer local seal if provided (never verified by AUROS cloud without their key). */
  local_signature: string | null;
  /** AUROS cloud co-seal of the hash only — publicly verifiable. */
  cloud_signature: string;
  profile: CryptoProfile;
  tenant_ref: string | null;
  label: string | null;
  created_at: string;
  plan: "free" | "premium";
  verify_url: string;
  /** Never stores payload — only metadata. */
  payload_retained: false;
  disclaimer: string;
};

export type ShieldTapInput = {
  /** Raw body to hash — discarded after hashing. */
  body?: string;
  content_hash?: string;
  kind?: ShieldSealKind | "tap";
  local_signature?: string;
  profile?: CryptoProfile;
  tenant_ref?: string;
  label?: string;
  plan?: "free" | "premium";
};

const memory = new Map<string, ShieldReceipt>();
const DATA_DIR = join(process.cwd(), ".data");
const FILE = join(DATA_DIR, "shield-receipts.json");
const USAGE_FILE = join(DATA_DIR, "shield-tap-usage.json");

type UsageMap = Record<string, { month: string; count: number }>;

function monthBucket(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
}

function loadReceipts(): ShieldReceipt[] {
  try {
    if (!existsSync(FILE)) return [];
    const parsed = JSON.parse(readFileSync(FILE, "utf8")) as ShieldReceipt[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReceipts(rows: ShieldReceipt[]): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(FILE, JSON.stringify(rows.slice(-5000), null, 2), "utf8");
  } catch {
    // dev fallback
  }
}

function syncMemory(): void {
  for (const r of loadReceipts()) memory.set(r.id, r);
}
syncMemory();

function loadUsage(): UsageMap {
  try {
    if (!existsSync(USAGE_FILE)) return {};
    return JSON.parse(readFileSync(USAGE_FILE, "utf8")) as UsageMap;
  } catch {
    return {};
  }
}

function saveUsage(map: UsageMap): void {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(USAGE_FILE, JSON.stringify(map, null, 2), "utf8");
  } catch {
    // ignore
  }
}

export function getTapUsage(keyHash: string): { month: string; count: number } {
  const map = loadUsage();
  const month = monthBucket();
  const row = map[keyHash];
  if (!row || row.month !== month) return { month, count: 0 };
  return row;
}

export function incrementTapUsage(keyHash: string): number {
  const map = loadUsage();
  const month = monthBucket();
  const prev = map[keyHash];
  const count = !prev || prev.month !== month ? 1 : prev.count + 1;
  map[keyHash] = { month, count };
  saveUsage(map);
  return count;
}

function sha256Hex(payload: string): string {
  return createHash("sha256").update(payload, "utf8").digest("hex");
}

function signAnchor(contentHash: string): string | null {
  const secret = resolveAttestSigningKey();
  if (!secret) return null;
  return createHmac("sha256", secret)
    .update(`${ANCHOR_PREFIX}${contentHash.trim().toLowerCase()}`)
    .digest("hex");
}

export function verifyCloudAnchor(
  contentHash: string,
  signature: string
): boolean {
  const expected = signAnchor(contentHash);
  if (!expected || !signature?.trim()) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.trim().toLowerCase(), "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Non-invasive proof tap: hash the body, discard it, dual-issue a public cloud receipt.
 * Payload never leaves the request — only content_hash is stored.
 */
export function createCloudTapReceipt(
  input: ShieldTapInput,
  siteUrl = "https://getauros.com"
):
  | { ok: true; receipt: ShieldReceipt }
  | { ok: false; error: string; status: number } {
  let content_hash = input.content_hash?.trim().toLowerCase();
  if (!content_hash && input.body != null) {
    content_hash = sha256Hex(input.body);
  }
  // Explicitly drop body reference — callers should not retain either.
  if (!content_hash || !/^[a-f0-9]{64}$/.test(content_hash)) {
    return {
      ok: false,
      error: "Provide body or content_hash (64-char sha256 hex)",
      status: 400,
    };
  }

  const cloud_signature = signAnchor(content_hash);
  if (!cloud_signature) {
    return {
      ok: false,
      error: "Cloud co-seal unavailable (ATTEST_SIGNING_KEY not configured)",
      status: 503,
    };
  }

  const id = `shr_${randomBytes(12).toString("hex")}`;
  const kind = input.kind ?? "tap";
  const profile =
    input.plan === "premium" && input.profile === "hybrid_pqc_ready_v1"
      ? "hybrid_pqc_ready_v1"
      : "classical_hmac_sha256_v1";

  const receipt: ShieldReceipt = {
    id,
    shield_version: SHIELD_VERSION,
    kind,
    content_hash,
    local_signature: input.local_signature?.trim().toLowerCase() || null,
    cloud_signature,
    profile,
    tenant_ref: input.tenant_ref?.trim() || null,
    label: input.label?.trim() || null,
    created_at: new Date().toISOString(),
    plan: input.plan ?? "free",
    verify_url: `${siteUrl.replace(/\/$/, "")}/api/v1/shield/receipts/${id}`,
    payload_retained: false,
    disclaimer: SHIELD_DISCLAIMER,
  };

  memory.set(id, receipt);
  const all = loadReceipts();
  all.push(receipt);
  saveReceipts(all);
  return { ok: true, receipt };
}

export function getReceipt(id: string): ShieldReceipt | null {
  if (memory.has(id)) return memory.get(id)!;
  syncMemory();
  return memory.get(id) ?? null;
}

export function listReceiptsForExport(
  limit = 100,
  tenantRef?: string
): Pick<
  ShieldReceipt,
  | "id"
  | "content_hash"
  | "cloud_signature"
  | "created_at"
  | "kind"
  | "plan"
  | "tenant_ref"
  | "label"
  | "verify_url"
>[] {
  syncMemory();
  let rows = [...memory.values()];
  if (tenantRef) {
    rows = rows.filter((r) => r.tenant_ref === tenantRef);
  }
  return rows
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, limit)
    .map((r) => ({
      id: r.id,
      content_hash: r.content_hash,
      cloud_signature: r.cloud_signature,
      created_at: r.created_at,
      kind: r.kind,
      plan: r.plan,
      tenant_ref: r.tenant_ref,
      label: r.label,
      verify_url: r.verify_url,
    }));
}

export type TapReceiptPublic = {
  id: string;
  content_hash: string;
  cloud_signature: string;
  kind: string;
  profile: string;
  valid: boolean;
  payload_retained: false;
  verify_url: string;
  created_at: string;
  disclaimer: string;
};

export function toPublicVerify(receipt: ShieldReceipt): TapReceiptPublic {
  return {
    id: receipt.id,
    content_hash: receipt.content_hash,
    cloud_signature: receipt.cloud_signature,
    kind: receipt.kind,
    profile: receipt.profile,
    valid: verifyCloudAnchor(receipt.content_hash, receipt.cloud_signature),
    payload_retained: false,
    verify_url: receipt.verify_url,
    created_at: receipt.created_at,
    disclaimer: receipt.disclaimer,
  };
}
