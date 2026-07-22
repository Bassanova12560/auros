/**
 * Air-gapped portfolio pack — hash-only snapshot for offline / Shield desks.
 * No emails, no API keys, no PII beyond public display names already on market.
 */

import { createHash } from "node:crypto";

import type { GreenPortfolioSnapshot } from "@/lib/green/portfolio-types";

export const AIRGAP_PACK_VERSION = "auros.portfolio.airgap.v1" as const;

export type PortfolioAirgapPack = {
  version: typeof AIRGAP_PACK_VERSION;
  generatedAt: string;
  contentHash: string;
  totals: {
    dna: number;
    withRecentEvents: number;
    alertCount: number;
  };
  assets: Array<{
    assetDnaId: string;
    displayName: string;
    assetClass: string;
    country: string;
    source: string;
    lastAction?: string;
    lastEventAt?: string;
    eventCount: number;
  }>;
  alerts: Array<{
    id: string;
    kind: string;
    severity: string;
    assetDnaId: string;
    displayName: string;
    message: string;
  }>;
  disclaimer: string;
};

function stableStringify(value: unknown): string {
  return JSON.stringify(value);
}

export function buildPortfolioAirgapPack(
  snapshot: GreenPortfolioSnapshot
): PortfolioAirgapPack {
  const assets = snapshot.assets.map((a) => ({
    assetDnaId: a.assetDnaId,
    displayName: a.displayName,
    assetClass: a.assetClass,
    country: a.country,
    source: a.source,
    lastAction: a.lastAction,
    lastEventAt: a.lastEventAt,
    eventCount: a.eventCount,
  }));
  const alerts = snapshot.alerts.map((a) => ({
    id: a.id,
    kind: a.kind,
    severity: a.severity,
    assetDnaId: a.assetDnaId,
    displayName: a.displayName,
    message: a.message,
  }));

  const body = {
    version: AIRGAP_PACK_VERSION,
    generatedAt: snapshot.generatedAt,
    totals: {
      dna: snapshot.totalDna,
      withRecentEvents: snapshot.withRecentEvents,
      alertCount: snapshot.alertCount,
    },
    assets,
    alerts,
  };

  const contentHash = createHash("sha256")
    .update(stableStringify(body))
    .digest("hex");

  return {
    ...body,
    contentHash,
    disclaimer:
      "Indicative AUROS portfolio airgap pack — not investment advice, not a regulated statement. Import offline via AUROS Shield or tenant desk.",
  };
}

export type AirgapVerifyResult =
  | {
      ok: true;
      version: string;
      contentHash: string;
      totals: PortfolioAirgapPack["totals"];
      assetCount: number;
      alertCount: number;
    }
  | { ok: false; error: string };

/** Recompute sha256 over canonical body (excludes contentHash + disclaimer). */
export function verifyPortfolioAirgapPack(
  raw: unknown
): AirgapVerifyResult {
  if (!raw || typeof raw !== "object") {
    return { ok: false, error: "invalid_json" };
  }
  const pack = raw as Record<string, unknown>;
  if (pack.version !== AIRGAP_PACK_VERSION) {
    return { ok: false, error: "unsupported_version" };
  }
  const contentHash = String(pack.contentHash ?? "");
  if (!/^[a-f0-9]{64}$/i.test(contentHash)) {
    return { ok: false, error: "invalid_hash" };
  }
  const totals = pack.totals as PortfolioAirgapPack["totals"] | undefined;
  const assets = pack.assets;
  const alerts = pack.alerts;
  if (!totals || !Array.isArray(assets) || !Array.isArray(alerts)) {
    return { ok: false, error: "invalid_shape" };
  }

  const body = {
    version: pack.version,
    generatedAt: pack.generatedAt,
    totals,
    assets,
    alerts,
  };
  const expected = createHash("sha256")
    .update(stableStringify(body))
    .digest("hex");
  if (expected.toLowerCase() !== contentHash.toLowerCase()) {
    return { ok: false, error: "hash_mismatch" };
  }

  return {
    ok: true,
    version: String(pack.version),
    contentHash: contentHash.toLowerCase(),
    totals,
    assetCount: assets.length,
    alertCount: alerts.length,
  };
}
