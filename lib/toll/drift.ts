/**
 * AUROS Drift Detection v0 — post-issuance protection signals.
 */

import { isValidAssetDnaId, resolveAssetDna } from "@/lib/asset-dna";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import {
  computePortfolioAlerts,
  type PortfolioAlert,
} from "@/lib/green/portfolio-alerts";
import type { PortfolioAssetRow } from "@/lib/green/portfolio-types";

export type TollDriftResult = {
  assetDnaId: string;
  alertCount: number;
  alerts: PortfolioAlert[];
  summary: string;
};

function rowFromDna(
  dna: NonNullable<Awaited<ReturnType<typeof resolveAssetDna>>>,
  events: Awaited<ReturnType<typeof listProofStreamEventsAsync>>
): PortfolioAssetRow {
  const now = Date.now();
  const expiredDocuments = (dna.documents ?? [])
    .filter((d) => d.expiresAt && new Date(d.expiresAt).getTime() < now)
    .map((d) => d.title);
  return {
    assetDnaId: dna.id,
    displayName: dna.displayName,
    assetClass: dna.assetClass,
    country: dna.jurisdiction.country || "",
    source: "dna_only",
    labelTier: dna.compliance?.labelTier,
    listingTier: dna.compliance?.listingTier,
    expiredDocuments,
    lastAction: events[0]?.action,
    lastEventAt: events[0]?.createdAt,
    eventCount: events.length,
    recentEvents: events.slice(0, 5).map((e) => ({
      id: e.id,
      assetDnaId: e.assetDnaId,
      action: e.action,
      contentHash: e.contentHash,
      meta: e.meta,
      createdAt: e.createdAt,
    })),
  };
}

export async function getAssetDrift(input: {
  assetDnaId: string;
  nowIso?: string;
}): Promise<TollDriftResult | { error: "invalid_id" | "not_found" }> {
  const id = input.assetDnaId?.trim() ?? "";
  if (!isValidAssetDnaId(id)) return { error: "invalid_id" };
  const dna = await resolveAssetDna(id);
  if (!dna) return { error: "not_found" };
  const events = await listProofStreamEventsAsync(id, 50);
  const alerts = computePortfolioAlerts({
    assets: [rowFromDna(dna, events)],
    nowIso: input.nowIso,
  });
  const critical = alerts.filter((a) => a.severity === "critical").length;
  const summary =
    alerts.length === 0
      ? "No drift signals on v0 rules."
      : `${alerts.length} signal(s), ${critical} critical — monitoring indicative.`;
  return {
    assetDnaId: id,
    alertCount: alerts.length,
    alerts,
    summary,
  };
}
