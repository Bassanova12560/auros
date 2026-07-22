/**
 * AUROS Reality Reputation System v0 — operational reputation (indicative).
 * Not a credit rating / marketing score. HITL.
 */

import type { AssetDnaRecord } from "@/lib/asset-dna";
import type { ProofStreamEvent } from "@/lib/proof-stream";
import { computeAurosTrustScore } from "./trust-score";

export type RealityReputationBand = "low" | "medium" | "high";

export type RealityReputationDimensions = {
  dataReliability: number;
  proofQuality: number;
  incidentDiscipline: number;
  documentHygiene: number;
  correctionStability: number;
};

export type RealityReputation = {
  overall: number;
  dimensions: RealityReputationDimensions;
  band: RealityReputationBand;
  drivers: string[];
  disclaimer: string;
};

export const REALITY_REPUTATION_DISCLAIMER =
  "Indicative operational reputation — not a credit rating, certification, or investment advice. HITL review required.";

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function daysSince(iso: string | undefined, now: number): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  return (now - t) / (1000 * 60 * 60 * 24);
}

function bandFor(overall: number): RealityReputationBand {
  if (overall >= 70) return "high";
  if (overall >= 40) return "medium";
  return "low";
}

/**
 * Compute Reality Reputation from DNA + optional proof/provenance/source signals.
 * Cash-flow stability is folded into dataReliability / incidentDiscipline drivers.
 */
export function computeRealityReputation(input: {
  dna: AssetDnaRecord | null;
  events?: ProofStreamEvent[];
  provenanceCount?: number;
  sourceCount?: number;
  nowIso?: string;
}): RealityReputation {
  const now = new Date(input.nowIso ?? new Date().toISOString()).getTime();
  const drivers: string[] = [];

  if (!input.dna) {
    return {
      overall: 8,
      dimensions: {
        dataReliability: 5,
        proofQuality: 5,
        incidentDiscipline: 10,
        documentHygiene: 5,
        correctionStability: 15,
      },
      band: "low",
      drivers: ["unknown_asset", "not_auros_resolved"],
      disclaimer: REALITY_REPUTATION_DISCLAIMER,
    };
  }

  const dna = input.dna;
  const events = input.events ?? [];
  const provenanceCount = Math.max(0, input.provenanceCount ?? 0);
  const sourceCount = Math.max(0, input.sourceCount ?? 0);
  const trust = computeAurosTrustScore({ dna, events, nowIso: input.nowIso });

  // --- dataReliability: trust core + attestation / provenance density ---
  let dataReliability = trust.overall * 0.55;
  dataReliability += Math.min(25, provenanceCount * 5);
  dataReliability += Math.min(20, sourceCount * 8);
  if (!dna.jurisdiction?.country) {
    dataReliability -= 15;
    drivers.push("missing_jurisdiction");
  }
  if (dna.compliance?.listingTier === "demo") {
    dataReliability -= 12;
    drivers.push("demo_listing_tier");
  }
  if (dna.links?.marketActorId || dna.links?.registryProjectId) {
    dataReliability += 8;
    drivers.push("linked_market_or_registry");
  } else {
    drivers.push("thin_cashflow_linkage");
  }
  if (provenanceCount === 0) drivers.push("no_provenance_rows");
  if (sourceCount === 0) drivers.push("no_attested_sources");
  dataReliability = clamp(dataReliability);

  // --- proofQuality: stream depth, hashes, certified events ---
  const hashed = events.filter((e) => Boolean(e.contentHash)).length;
  const certified = events.filter((e) => e.action === "event.certified").length;
  const actionKinds = new Set(events.map((e) => e.action)).size;
  let proofQuality = 15;
  proofQuality += Math.min(40, events.length * 6);
  proofQuality += Math.min(20, hashed * 5);
  proofQuality += Math.min(15, certified * 8);
  proofQuality += Math.min(10, actionKinds * 2);
  if (events.length === 0) {
    proofQuality = 12;
    drivers.push("empty_proof_stream");
  } else if (hashed === 0) {
    drivers.push("unhashed_proof_events");
  } else {
    drivers.push("proof_stream_active");
  }
  proofQuality = clamp(proofQuality);

  // --- incidentDiscipline: freshness + response-like actions ---
  const lastEventAt = events[0]?.createdAt ?? dna.updatedAt ?? dna.createdAt;
  const age = daysSince(lastEventAt, now);
  const reviewedAge = daysSince(dna.compliance?.lastReviewedAt, now);
  const responseActions = events.filter((e) =>
    ["compliance.updated", "doc.attached", "event.certified", "market.approved"].includes(
      e.action
    )
  ).length;
  const rejects = events.filter((e) => e.action === "market.rejected").length;
  let incidentDiscipline = 55;
  if (age == null) {
    incidentDiscipline = 20;
    drivers.push("no_operational_timestamps");
  } else if (age > 90) {
    incidentDiscipline = 22;
    drivers.push("stale_ops_gt_90d");
  } else if (age > 30) {
    incidentDiscipline = 45;
    drivers.push("stale_ops_gt_30d");
  } else {
    incidentDiscipline = 70;
    drivers.push("fresh_ops_trail");
  }
  incidentDiscipline += Math.min(20, responseActions * 4);
  if (reviewedAge != null && reviewedAge <= 60) {
    incidentDiscipline += 10;
  } else if (reviewedAge == null) {
    drivers.push("no_compliance_review_date");
  }
  if (rejects > 0) {
    incidentDiscipline -= Math.min(15, rejects * 5);
    drivers.push("market_reject_history");
  }
  incidentDiscipline = clamp(incidentDiscipline);

  // --- documentHygiene ---
  const docs = dna.documents ?? [];
  const expired = docs.filter(
    (d) => d.expiresAt && new Date(d.expiresAt).getTime() < now
  );
  const sealed = docs.filter((d) => Boolean(d.hash)).length;
  let documentHygiene =
    docs.length === 0 ? 12 : Math.min(70, 20 + docs.length * 12);
  documentHygiene += Math.min(20, sealed * 6);
  documentHygiene -= Math.min(40, expired.length * 18);
  if (docs.length === 0) drivers.push("no_documents");
  if (expired.length) drivers.push("expired_documents");
  if (sealed > 0) drivers.push("hashed_documents");
  documentHygiene = clamp(documentHygiene);

  // --- correctionStability: moderate updates good; burst churn bad ---
  const correctionLike = events.filter((e) =>
    ["compliance.updated", "doc.attached", "label.submitted"].includes(e.action)
  );
  const windowMs = 30 * 24 * 60 * 60 * 1000;
  const recentCorrections = correctionLike.filter((e) => {
    const t = new Date(e.createdAt).getTime();
    return Number.isFinite(t) && now - t <= windowMs;
  }).length;
  let correctionStability = 72;
  if (correctionLike.length === 0 && events.length > 0) {
    correctionStability = 68;
    drivers.push("stable_no_recent_corrections");
  } else if (recentCorrections === 0) {
    correctionStability = 75;
  } else if (recentCorrections <= 2) {
    correctionStability = 80;
    drivers.push("healthy_correction_cadence");
  } else if (recentCorrections <= 5) {
    correctionStability = 55;
    drivers.push("elevated_correction_frequency");
  } else {
    correctionStability = 28;
    drivers.push("correction_churn_high");
  }
  // Provenance version density as proxy for field churn
  if (provenanceCount > 12) {
    correctionStability = clamp(correctionStability - 12);
    drivers.push("dense_provenance_versions");
  }
  correctionStability = clamp(correctionStability);

  const dimensions: RealityReputationDimensions = {
    dataReliability,
    proofQuality,
    incidentDiscipline,
    documentHygiene,
    correctionStability,
  };

  const overall = clamp(
    dimensions.dataReliability * 0.25 +
      dimensions.proofQuality * 0.2 +
      dimensions.incidentDiscipline * 0.2 +
      dimensions.documentHygiene * 0.2 +
      dimensions.correctionStability * 0.15
  );

  const band = bandFor(overall);
  if (band === "high") drivers.unshift("reputation_band_high");
  else if (band === "medium") drivers.unshift("reputation_band_medium");
  else drivers.unshift("reputation_band_low");

  // Dedupe drivers, keep order, cap length
  const seen = new Set<string>();
  const uniqueDrivers = drivers.filter((d) => {
    if (seen.has(d)) return false;
    seen.add(d);
    return true;
  }).slice(0, 12);

  return {
    overall,
    dimensions,
    band,
    drivers: uniqueDrivers,
    disclaimer: REALITY_REPUTATION_DISCLAIMER,
  };
}
