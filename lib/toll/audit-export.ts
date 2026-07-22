/**
 * AUROS Audit Export v0 — evidence pack JSON for risk / auditors (indicative).
 */

import { isValidAssetDnaId, resolveAssetDna } from "@/lib/asset-dna";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import { computeAurosTrustScore } from "@/lib/toll/trust-score";
import { evaluateTollPolicy } from "@/lib/toll/policy";
import { getAssetDrift } from "@/lib/toll/drift";

export type AurosAuditExport = {
  exportedAt: string;
  mode: "json_audit";
  assetDnaId: string;
  dna: unknown;
  trust: ReturnType<typeof computeAurosTrustScore>;
  policy: ReturnType<typeof evaluateTollPolicy>;
  trail: unknown[];
  drift: unknown;
  disclaimer: string;
};

export async function buildAurosAuditExport(input: {
  assetDnaId: string;
}): Promise<
  | { ok: true; pack: AurosAuditExport }
  | { ok: false; error: "invalid_id" | "not_found" }
> {
  const id = input.assetDnaId.trim();
  if (!isValidAssetDnaId(id)) return { ok: false, error: "invalid_id" };
  const dna = await resolveAssetDna(id);
  if (!dna) return { ok: false, error: "not_found" };
  const events = await listProofStreamEventsAsync(id, 100);
  const trust = computeAurosTrustScore({ dna, events });
  const policy = evaluateTollPolicy({ dna, events });
  const drift = await getAssetDrift({ assetDnaId: id });

  return {
    ok: true,
    pack: {
      exportedAt: new Date().toISOString(),
      mode: "json_audit",
      assetDnaId: id,
      dna,
      trust,
      policy,
      trail: events,
      drift: "error" in drift ? { error: drift.error } : drift,
      disclaimer:
        "Indicative audit export — not a certified attestation. HITL for regulator packs.",
    },
  };
}
