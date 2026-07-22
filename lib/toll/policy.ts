/**
 * AUROS Policy Engine v0 — declarative institutional rules (indicative).
 * Never auto-blocks markets; returns allow/deny/review for integrators.
 */

import type { AssetDnaRecord } from "@/lib/asset-dna";
import type { ProofStreamEvent } from "@/lib/proof-stream";
import { computeAurosTrustScore } from "./trust-score";

export type TollPolicyRuleId =
  | "deny_unknown"
  | "deny_doc_stale_90d"
  | "deny_unmapped_entity"
  | "review_demo_tier"
  | "review_low_trust"
  | "require_jurisdiction";

export type TollPolicyDecision = {
  decision: "allow" | "deny" | "review";
  ruleIds: TollPolicyRuleId[];
  reasons: string[];
  trustOverall: number;
  disclaimer: string;
};

function daysSince(iso: string | undefined, now: number): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  return (now - t) / (1000 * 60 * 60 * 24);
}

export function evaluateTollPolicy(input: {
  dna: AssetDnaRecord | null;
  events?: ProofStreamEvent[];
  /** Rule ids to evaluate; default = all v0 rules */
  rules?: TollPolicyRuleId[];
  nowIso?: string;
}): TollPolicyDecision {
  const now = new Date(input.nowIso ?? new Date().toISOString()).getTime();
  const active = new Set<TollPolicyRuleId>(
    input.rules ?? [
      "deny_unknown",
      "deny_doc_stale_90d",
      "deny_unmapped_entity",
      "review_demo_tier",
      "review_low_trust",
      "require_jurisdiction",
    ]
  );
  const ruleIds: TollPolicyRuleId[] = [];
  const reasons: string[] = [];
  const trust = computeAurosTrustScore({
    dna: input.dna,
    events: input.events,
    nowIso: input.nowIso,
  });

  if (!input.dna) {
    if (active.has("deny_unknown")) {
      ruleIds.push("deny_unknown");
      reasons.push("Asset not AUROS-resolved.");
    }
    return {
      decision: "deny",
      ruleIds,
      reasons,
      trustOverall: trust.overall,
      disclaimer:
        "Indicative policy only — integrator enforces; AUROS does not auto-block trades.",
    };
  }

  const dna = input.dna;

  if (active.has("deny_unmapped_entity")) {
    const mapped =
      Boolean(dna.links?.marketActorId) ||
      Boolean(dna.links?.registryProjectId) ||
      Boolean(dna.origin?.spvName) ||
      Boolean(dna.origin?.siteName);
    if (!mapped) {
      ruleIds.push("deny_unmapped_entity");
      reasons.push("No canonical entity mapping (SPV/site/registry/market).");
    }
  }

  if (active.has("require_jurisdiction") && !dna.jurisdiction?.country) {
    ruleIds.push("require_jurisdiction");
    reasons.push("Missing jurisdiction country.");
  }

  if (active.has("deny_doc_stale_90d")) {
    const last =
      input.events?.[0]?.createdAt ?? dna.updatedAt ?? dna.createdAt;
    const age = daysSince(last, now);
    const staleDocs = (dna.documents ?? []).some((d) => {
      if (!d.expiresAt) return false;
      return new Date(d.expiresAt).getTime() < now;
    });
    if (staleDocs || (age != null && age > 90)) {
      ruleIds.push("deny_doc_stale_90d");
      reasons.push("Documents expired or proof trail older than 90 days.");
    }
  }

  if (active.has("review_demo_tier") && dna.compliance?.listingTier === "demo") {
    ruleIds.push("review_demo_tier");
    reasons.push("Demo / illustration listing tier.");
  }

  if (active.has("review_low_trust") && trust.overall < 40) {
    ruleIds.push("review_low_trust");
    reasons.push(`Trust score low (${trust.overall}/100).`);
  }

  const hardDeny = ruleIds.some((r) =>
    r.startsWith("deny_") || r === "require_jurisdiction"
  );
  const needsReview = ruleIds.some((r) => r.startsWith("review_"));

  const decision: TollPolicyDecision["decision"] = hardDeny
    ? "deny"
    : needsReview
      ? "review"
      : "allow";

  if (decision === "allow") {
    reasons.push("No v0 deny/review rules triggered.");
  }

  return {
    decision,
    ruleIds,
    reasons,
    trustOverall: trust.overall,
    disclaimer:
      "Indicative policy only — integrator enforces; AUROS does not auto-block trades.",
  };
}
