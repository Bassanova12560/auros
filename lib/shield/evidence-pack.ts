import { createHash, createHmac, randomBytes } from "node:crypto";

import { listChargeflowForKey } from "@/lib/chargeflow/store";
import { resolveAttestSigningKey } from "@/lib/protocol/attest/signing";
import { SITE_URL } from "@/lib/comparators/site";

import { ANCHOR_PREFIX, listReceiptsForExport } from "./tap";
import { SHIELD_DISCLAIMER, SHIELD_VERSION } from "./types";

const PACK_PREFIX = "auros-shield-pack:v1:";

export type EvidencePack = {
  pack_id: string;
  shield_version: string;
  generated_at: string;
  /** Why banks pay: long-lived evidence for a world where every firm has RWAs. */
  purpose: string;
  retention: {
    horizon_years_min: number;
    horizon_years_max: number;
    harvest_now_note: string;
  };
  summary: {
    cfu_total: number;
    cfu_active: number;
    cfu_retired: number;
    tap_receipts_included: number;
    tenant_refs: string[];
  };
  /** Hash-only CFU snapshot — no session PII. */
  units: {
    id: string;
    kind: string;
    status: string;
    content_hash: string;
    created_at: string;
  }[];
  taps: {
    id: string;
    content_hash: string;
    cloud_signature: string;
    created_at: string;
    kind: string;
  }[];
  pack_hash: string;
  pack_signature: string;
  verify_hint: string;
  bank_actions: string[];
  reseal: {
    recommended_profile: "hybrid_pqc_ready_v1";
    reason: string;
  };
  payload_retained: false;
  disclaimer: string;
};

function signPack(packHash: string): string | null {
  const secret = resolveAttestSigningKey();
  if (!secret) return null;
  return createHmac("sha256", secret)
    .update(`${PACK_PREFIX}${packHash}`)
    .digest("hex");
}

/**
 * Premium Evidence Pack — the heavy deliverable when RWAs are everywhere:
 * one sealed dossier for credit / ESG / auditor without opening data rooms.
 */
export async function buildEvidencePack(input: {
  keyHash: string;
  label?: string;
  cfu_limit?: number;
  tap_limit?: number;
}): Promise<
  { ok: true; pack: EvidencePack } | { ok: false; error: string; status: number }
> {
  const cfuLimit = Math.min(input.cfu_limit ?? 200, 500);
  const tapLimit = Math.min(input.tap_limit ?? 100, 500);

  const { items } = await listChargeflowForKey(input.keyHash, {
    limit: cfuLimit,
    offset: 0,
  });

  const taps = listReceiptsForExport(tapLimit);
  const tenant_refs = [
    ...new Set(taps.map((t) => t.tenant_ref).filter(Boolean) as string[]),
  ];
  const units = items.map((u) => ({
    id: u.id,
    kind: u.unit_kind,
    status: u.status,
    content_hash: u.content_hash,
    created_at: u.created_at,
  }));

  const active = units.filter((u) => u.status === "active").length;
  const retired = units.filter((u) => u.status === "retired").length;

  const canonical = JSON.stringify({
    v: SHIELD_VERSION,
    units: units.map((u) => [u.id, u.content_hash, u.status]),
    taps: taps.map((t) => [t.id, t.content_hash, t.cloud_signature]),
    label: input.label ?? null,
  });
  const pack_hash = createHash("sha256").update(canonical, "utf8").digest("hex");
  const pack_signature = signPack(pack_hash);
  if (!pack_signature) {
    return {
      ok: false,
      error: "Pack signing unavailable (ATTEST_SIGNING_KEY)",
      status: 503,
    };
  }

  const pack_id = `shp_${randomBytes(12).toString("hex")}`;
  const pack: EvidencePack = {
    pack_id,
    shield_version: SHIELD_VERSION,
    generated_at: new Date().toISOString(),
    purpose:
      input.label?.trim() ||
      "Institutional evidence pack — CFU + Shield taps, hash-only, counterparty-verifiable",
    retention: {
      horizon_years_min: 7,
      horizon_years_max: 30,
      harvest_now_note:
        "RWA/ESG evidence often outlives classical crypto assumptions — reseal on hybrid_pqc_ready before quantum cryptanalysis is practical.",
    },
    summary: {
      cfu_total: units.length,
      cfu_active: active,
      cfu_retired: retired,
      tap_receipts_included: taps.length,
      tenant_refs,
    },
    units,
    taps: taps.map((t) => ({
      id: t.id,
      content_hash: t.content_hash,
      cloud_signature: t.cloud_signature,
      created_at: t.created_at,
      kind: t.kind,
    })),
    pack_hash,
    pack_signature,
    verify_hint: `${SITE_URL}/api/v1/shield/verify — verify individual taps; pack_signature uses ${PACK_PREFIX}`,
    bank_actions: [
      "Attach pack to credit / ESG file without requesting raw data room",
      "Re-verify any tap via public POST /api/v1/shield/verify",
      "Schedule reseal when hybrid_pqc_ready keys are issued",
      "Diff next pack against pack_hash for continuous monitoring",
    ],
    reseal: {
      recommended_profile: "hybrid_pqc_ready_v1",
      reason:
        "Long retention + harvest-now risk — Premium keeps pack envelopes crypto-agile.",
    },
    payload_retained: false,
    disclaimer: SHIELD_DISCLAIMER,
  };

  return { ok: true, pack };
}

export function verifyPackSignature(
  packHash: string,
  signature: string
): boolean {
  const expected = signPack(packHash);
  if (!expected || !signature?.trim()) return false;
  return expected === signature.trim().toLowerCase();
}

/** @internal used by ingest path */
export { ANCHOR_PREFIX };
