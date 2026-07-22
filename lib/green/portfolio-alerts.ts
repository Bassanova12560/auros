/**
 * Portfolio alerts v0 — pure rules (client-safe).
 */

import type {
  PortfolioAlert,
  PortfolioAssetRow,
} from "./portfolio-types";

export type { PortfolioAlert } from "./portfolio-types";

const STALE_DAYS = 30;

export function computePortfolioAlerts(input: {
  assets: PortfolioAssetRow[];
  /** ISO now — injectable for tests */
  nowIso?: string;
}): PortfolioAlert[] {
  const now = new Date(input.nowIso ?? new Date().toISOString()).getTime();
  const alerts: PortfolioAlert[] = [];

  for (const row of input.assets) {
    if (!row.lastEventAt) {
      alerts.push({
        id: `${row.assetDnaId}:silent`,
        kind: "proof_stream_silent",
        severity: "warn",
        assetDnaId: row.assetDnaId,
        displayName: row.displayName,
        message: "No Proof Stream events yet",
      });
    } else {
      const ageMs = now - new Date(row.lastEventAt).getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);
      if (ageDays > STALE_DAYS) {
        alerts.push({
          id: `${row.assetDnaId}:stale`,
          kind: "proof_stream_stale",
          severity: "warn",
          assetDnaId: row.assetDnaId,
          displayName: row.displayName,
          message: `Proof Stream stale (>${STALE_DAYS}d)`,
          evidence: row.lastEventAt,
        });
      }
    }

    if (row.marketStatus === "pending") {
      alerts.push({
        id: `${row.assetDnaId}:pending`,
        kind: "listing_pending",
        severity: "info",
        assetDnaId: row.assetDnaId,
        displayName: row.displayName,
        message: "Market listing still pending review",
      });
    }

    if (row.listingTier === "demo") {
      alerts.push({
        id: `${row.assetDnaId}:demo`,
        kind: "demo_tier",
        severity: "info",
        assetDnaId: row.assetDnaId,
        displayName: row.displayName,
        message: "Illustration / demo tier — not Verified",
      });
    }

    for (const doc of row.expiredDocuments ?? []) {
      alerts.push({
        id: `${row.assetDnaId}:doc:${doc}`,
        kind: "document_expired",
        severity: "critical",
        assetDnaId: row.assetDnaId,
        displayName: row.displayName,
        message: `Document expired: ${doc}`,
      });
    }
  }

  const order = { critical: 0, warn: 1, info: 2 } as const;
  return alerts.sort(
    (a, b) =>
      order[a.severity] - order[b.severity] ||
      a.displayName.localeCompare(b.displayName)
  );
}
