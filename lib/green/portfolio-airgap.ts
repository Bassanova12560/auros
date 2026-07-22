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
