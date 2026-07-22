/**
 * AUROS AI Trust Score — confidence layer for agents (indicative).
 */

import type { AssetDnaRecord } from "@/lib/asset-dna";
import type { ProofStreamEvent } from "@/lib/proof-stream";

export type AurosTrustScore = {
  overall: number;
  band: "low" | "medium" | "high";
  dimensions: {
    docCompleteness: number;
    recency: number;
    legalClarity: number;
    auditDepth: number;
    operationalFreshness: number;
  };
  flags: string[];
  summary: string;
};

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function daysSince(iso: string | undefined, now: number): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  return (now - t) / (1000 * 60 * 60 * 24);
}

export function computeAurosTrustScore(input: {
  dna: AssetDnaRecord | null;
  events?: ProofStreamEvent[];
  nowIso?: string;
}): AurosTrustScore {
  const now = new Date(input.nowIso ?? new Date().toISOString()).getTime();
  const flags: string[] = [];

  if (!input.dna) {
    return {
      overall: 5,
      band: "low",
      dimensions: {
        docCompleteness: 0,
        recency: 0,
        legalClarity: 0,
        auditDepth: 0,
        operationalFreshness: 0,
      },
      flags: ["unknown_asset", "not_auros_resolved"],
      summary:
        "Asset not AUROS-resolved — treat as incomplete / elevated risk for agents.",
    };
  }

  const dna = input.dna;
  const docs = dna.documents ?? [];
  const docCompleteness = clamp(
    docs.length === 0 ? 15 : Math.min(100, 25 + docs.length * 15)
  );
  if (docs.length === 0) flags.push("no_documents");

  const expired = docs.filter((d) => {
    if (!d.expiresAt) return false;
    return new Date(d.expiresAt).getTime() < now;
  });
  if (expired.length) flags.push("expired_documents");

  const events = input.events ?? [];
  const lastEvent = events[0]?.createdAt ?? dna.updatedAt ?? dna.createdAt;
  const age = daysSince(lastEvent, now);
  let recency = 80;
  let operationalFreshness = 80;
  if (age == null) {
    recency = 20;
    operationalFreshness = 15;
    flags.push("no_timestamps");
  } else if (age > 90) {
    recency = 25;
    operationalFreshness = 20;
    flags.push("stale_gt_90d");
  } else if (age > 30) {
    recency = 50;
    operationalFreshness = 45;
    flags.push("stale_gt_30d");
  }

  const legalClarity = clamp(
    dna.jurisdiction?.country ? 70 : 30
  );
  if (!dna.jurisdiction?.country) flags.push("missing_jurisdiction");

  const auditDepth = clamp(
    20 + events.length * 12 + (dna.compliance?.labelTier === "verified" ? 25 : 0)
  );
  if (events.length === 0) flags.push("empty_proof_stream");
  if (dna.compliance?.listingTier === "demo") flags.push("demo_tier");
  if (dna.compliance?.labelTier === "none" || !dna.compliance?.labelTier) {
    flags.push("no_label_tier");
  }

  const dims = {
    docCompleteness,
    recency,
    legalClarity,
    auditDepth,
    operationalFreshness,
  };
  const overall = clamp(
    dims.docCompleteness * 0.2 +
      dims.recency * 0.2 +
      dims.legalClarity * 0.15 +
      dims.auditDepth * 0.25 +
      dims.operationalFreshness * 0.2
  );
  const band: AurosTrustScore["band"] =
    overall >= 70 ? "high" : overall >= 40 ? "medium" : "low";

  const summary =
    band === "high"
      ? "Indicative trust strong — still not a certification."
      : band === "medium"
        ? "Pertinent but incomplete — verify trail before institutional use."
        : "Low confidence — do not treat as AUROS-canonical institutional grade.";

  return { overall, band, dimensions: dims, flags, summary };
}
