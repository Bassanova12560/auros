/**
 * AUROS Red-Team Asset Layer v0 — adversarial review of tokenized assets.
 * Indicative findings only — not a penetration test, not Verified, not a cert.
 * HITL product for insurers / funds (security / bug-bounty angle).
 */

import type { AssetDnaRecord } from "@/lib/asset-dna";
import type { ProofStreamEvent } from "@/lib/proof-stream";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import { buildIndicativeRightsModel } from "./rights-engine";
import { evaluateTollPolicy } from "./policy";
import { resolveAurosAsset } from "./resolve";

export type TollRedTeamSeverity = "low" | "medium" | "high" | "critical";

export type TollRedTeamCategory =
  | "documentary_gap"
  | "rights_ambiguity"
  | "stale_trail"
  | "unmapped_entity"
  | "operational_dependency"
  | "policy_fail";

export type TollRedTeamFinding = {
  id: string;
  severity: TollRedTeamSeverity;
  category: TollRedTeamCategory;
  title: string;
  detail: string;
  evidence?: Record<string, unknown>;
};

export type TollRedTeamResult = {
  findings: TollRedTeamFinding[];
  /** 0–100 resilience score (higher = fewer / milder findings). Indicative. */
  score: number;
  summary: string;
  disclaimer: string;
  assetDnaId?: string;
  resolved: boolean;
};

const DISCLAIMER =
  "Indicative red-team findings only — not a penetration test, not a security certification, not AUROS Verified. HITL review required before any investment or issuance decision.";

const SEVERITY_WEIGHT: Record<TollRedTeamSeverity, number> = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
};

const SEVERITY_ORDER: Record<TollRedTeamSeverity, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function daysSince(iso: string | undefined, now: number): number | null {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return null;
  return (now - t) / (1000 * 60 * 60 * 24);
}

function scoreFromFindings(findings: TollRedTeamFinding[]): number {
  const deduct = findings.reduce(
    (sum, f) => sum + (SEVERITY_WEIGHT[f.severity] ?? 0),
    0
  );
  return Math.max(0, Math.min(100, 100 - deduct));
}

function summarize(findings: TollRedTeamFinding[], score: number): string {
  if (findings.length === 0) {
    return `No v0 red-team signals (${score}/100) — still indicative; HITL before reliance.`;
  }
  const crit = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;
  return `${findings.length} indicative finding(s) · score ${score}/100 · ${crit} critical · ${high} high — HITL triage required.`;
}

function sortFindings(findings: TollRedTeamFinding[]): TollRedTeamFinding[] {
  return [...findings].sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      a.category.localeCompare(b.category) ||
      a.id.localeCompare(b.id)
  );
}

/**
 * Pure adversarial evaluation given a resolved (or null) DNA.
 * Unit-test friendly — no I/O.
 */
export function evaluateAssetRedTeam(input: {
  dna: AssetDnaRecord | null;
  events?: ProofStreamEvent[];
  nowIso?: string;
}): TollRedTeamResult {
  const now = new Date(input.nowIso ?? new Date().toISOString()).getTime();
  const findings: TollRedTeamFinding[] = [];

  if (!input.dna) {
    findings.push({
      id: "rt_unresolved",
      severity: "critical",
      category: "unmapped_entity",
      title: "Asset not AUROS-resolved",
      detail:
        "Query did not resolve to a canonical Asset DNA — adversarial surface unknown. Do not treat as mapped RWA.",
      evidence: { resolved: false },
    });
    const score = scoreFromFindings(findings);
    return {
      findings: sortFindings(findings),
      score,
      summary: summarize(findings, score),
      disclaimer: DISCLAIMER,
      resolved: false,
    };
  }

  const dna = input.dna;
  const events = input.events ?? [];
  const docs = dna.documents ?? [];

  // —— Documentary gaps ——
  if (docs.length === 0) {
    findings.push({
      id: "rt_docs_empty",
      severity: "critical",
      category: "documentary_gap",
      title: "No documents attached to DNA",
      detail:
        "Empty document set — title / permits / offtake cannot be adversarially reviewed. Treat as documentary void until HITL pack lands.",
      evidence: { documentCount: 0 },
    });
  } else {
    const roles = new Set(docs.map((d) => d.role.toLowerCase()));
    const titleRoles = ["deed", "title", "ownership", "land_title"];
    if (![...roles].some((r) => titleRoles.some((t) => r.includes(t)))) {
      findings.push({
        id: "rt_docs_no_title",
        severity: "high",
        category: "documentary_gap",
        title: "Missing title / deed reference",
        detail:
          "No document role resembling title or deed — rights to the underlying may be unproven in the DNA trail.",
        evidence: { roles: [...roles] },
      });
    }
    const unsealed = docs.filter((d) => !d.hash).length;
    if (unsealed > 0) {
      findings.push({
        id: "rt_docs_unsealed",
        severity: unsealed === docs.length ? "high" : "medium",
        category: "documentary_gap",
        title: "Documents without content hash",
        detail: `${unsealed}/${docs.length} document(s) lack a sealed hash — integrity cannot be cross-checked adversarially.`,
        evidence: { unsealed, total: docs.length },
      });
    }
    const expired = docs.filter(
      (d) => d.expiresAt && new Date(d.expiresAt).getTime() < now
    );
    if (expired.length > 0) {
      findings.push({
        id: "rt_docs_expired",
        severity: "high",
        category: "documentary_gap",
        title: "Expired document(s) in pack",
        detail: `${expired.length} document(s) past expiresAt — stale legal / permit cover.`,
        evidence: {
          titles: expired.map((d) => d.title).slice(0, 5),
        },
      });
    }
  }

  // —— Entity / mapping ——
  const mapped =
    Boolean(dna.links?.marketActorId) ||
    Boolean(dna.links?.registryProjectId) ||
    Boolean(dna.origin?.spvName?.trim()) ||
    Boolean(dna.origin?.siteName?.trim());
  if (!mapped) {
    findings.push({
      id: "rt_unmapped",
      severity: "critical",
      category: "unmapped_entity",
      title: "No canonical entity mapping",
      detail:
        "Missing SPV, site, registry project, and market actor — smart-contract ↔ real-world mapping is unverifiable.",
      evidence: {
        links: dna.links ?? {},
        origin: {
          spvName: dna.origin?.spvName ?? null,
          siteName: dna.origin?.siteName ?? null,
        },
      },
    });
  } else if (
    !dna.links?.registryProjectId &&
    !dna.links?.marketActorId
  ) {
    findings.push({
      id: "rt_mapping_weak",
      severity: "medium",
      category: "unmapped_entity",
      title: "Weak on-chain / registry mapping",
      detail:
        "Site/SPV present but no registryProjectId or marketActorId — contract↔asset binding may be soft.",
      evidence: { links: dna.links ?? {} },
    });
  }

  if (!dna.jurisdiction?.country?.trim()) {
    findings.push({
      id: "rt_jurisdiction",
      severity: "high",
      category: "unmapped_entity",
      title: "Missing jurisdiction country",
      detail:
        "No ISO country on DNA — governing law / enforcement path for tokenized rights is ambiguous.",
      evidence: { jurisdiction: dna.jurisdiction },
    });
  }

  // —— Rights ambiguity (indicative Rights Engine) ——
  const rights = buildIndicativeRightsModel({
    assetDnaId: dna.id,
    displayName: dna.displayName,
  });
  const ownershipVague = rights.slices.some(
    (s) =>
      s.kind === "ownership" &&
      /unspecified|TBD|does not invent title/i.test(
        `${s.label} ${s.limits ?? ""}`
      )
  );
  if (ownershipVague) {
    findings.push({
      id: "rt_rights_ownership",
      severity: "high",
      category: "rights_ambiguity",
      title: "Underlying ownership unspecified",
      detail:
        "Rights Engine v0 marks ownership as unspecified — token may not convey title; counsel HITL before issuance.",
      evidence: {
        sliceIds: rights.slices.map((s) => s.id),
        notes: rights.notes.slice(0, 2),
      },
    });
  }
  const rev = rights.slices.find((s) => s.kind === "revenue_share");
  if (rev && rev.share == null) {
    findings.push({
      id: "rt_rights_rev_share",
      severity: "medium",
      category: "rights_ambiguity",
      title: "Revenue share not quantified",
      detail:
        "Indicative revenue participation has no share % — cashflow mapping to token is incomplete.",
      evidence: { sliceId: rev.id },
    });
  }

  // —— Stale trail ——
  const lastTrail =
    events[0]?.createdAt ?? dna.updatedAt ?? dna.createdAt;
  const trailAge = daysSince(lastTrail, now);
  if (events.length === 0) {
    findings.push({
      id: "rt_trail_empty",
      severity: "medium",
      category: "stale_trail",
      title: "Empty proof trail",
      detail:
        "No Proof Stream events — post-issuance activity cannot be adversarially monitored.",
      evidence: { eventCount: 0, dnaUpdatedAt: dna.updatedAt },
    });
  } else if (trailAge != null && trailAge > 90) {
    findings.push({
      id: "rt_trail_stale",
      severity: "high",
      category: "stale_trail",
      title: "Proof trail older than 90 days",
      detail: `Last trail signal ~${Math.floor(trailAge)}d ago — silent asset risk for ops / insurers.`,
      evidence: { lastTrail, ageDays: Math.floor(trailAge) },
    });
  } else if (trailAge != null && trailAge > 45) {
    findings.push({
      id: "rt_trail_aging",
      severity: "low",
      category: "stale_trail",
      title: "Proof trail aging (>45d)",
      detail: `Last trail ~${Math.floor(trailAge)}d — watch for silent drift before 90d threshold.`,
      evidence: { lastTrail, ageDays: Math.floor(trailAge) },
    });
  }

  // —— Operational dependencies ——
  if (!dna.origin?.operatorName?.trim()) {
    findings.push({
      id: "rt_ops_operator",
      severity: "medium",
      category: "operational_dependency",
      title: "Operator not named",
      detail:
        "No operatorName — continuity / O&M dependency is opaque to red-team review.",
      evidence: { origin: dna.origin },
    });
  }
  if (!dna.origin?.coordinates) {
    findings.push({
      id: "rt_ops_geo",
      severity: "low",
      category: "operational_dependency",
      title: "Site coordinates absent",
      detail:
        "No lat/lon — physical dependency and geo-risk cannot be cross-checked.",
      evidence: { siteName: dna.origin?.siteName ?? null },
    });
  }
  if (dna.compliance?.listingTier === "demo") {
    findings.push({
      id: "rt_ops_demo",
      severity: "high",
      category: "operational_dependency",
      title: "Demo listing tier",
      detail:
        "Asset is demo / illustration tier — operational and legal dependencies are not production-grade.",
      evidence: { listingTier: dna.compliance.listingTier },
    });
  }
  if (
    !dna.links?.dossierId &&
    dna.compliance?.labelTier !== "verified"
  ) {
    findings.push({
      id: "rt_ops_dossier",
      severity: "low",
      category: "operational_dependency",
      title: "No dossier link / non-verified label",
      detail:
        "Missing dossierId and label not verified — institutional ops pack may be incomplete.",
      evidence: {
        dossierId: dna.links?.dossierId ?? null,
        labelTier: dna.compliance?.labelTier ?? null,
      },
    });
  }

  // —— Policy composition ——
  const policy = evaluateTollPolicy({
    dna,
    events,
    nowIso: input.nowIso,
  });
  if (policy.decision === "deny") {
    findings.push({
      id: "rt_policy_deny",
      severity: "critical",
      category: "policy_fail",
      title: "Policy Engine deny",
      detail: `Policy v0 returned deny: ${policy.reasons.slice(0, 2).join("; ") || "see ruleIds"}.`,
      evidence: { ruleIds: policy.ruleIds, decision: policy.decision },
    });
  } else if (policy.decision === "review") {
    findings.push({
      id: "rt_policy_review",
      severity: "medium",
      category: "policy_fail",
      title: "Policy Engine review",
      detail: `Policy v0 returned review: ${policy.reasons.slice(0, 2).join("; ") || "HITL"}.`,
      evidence: { ruleIds: policy.ruleIds, decision: policy.decision },
    });
  }

  const sorted = sortFindings(findings);
  const score = scoreFromFindings(sorted);
  return {
    findings: sorted,
    score,
    summary: summarize(sorted, score),
    disclaimer: DISCLAIMER,
    assetDnaId: dna.id,
    resolved: true,
  };
}

/**
 * Red-team entry: pass `dna` for pure eval, or `assetDnaId` / query to resolve.
 */
export async function runAssetRedTeam(input: {
  assetDnaId?: string;
  /** Free-text query when id unknown (same as Resolve). */
  assetQuery?: string;
  dna?: AssetDnaRecord | null;
  events?: ProofStreamEvent[];
  nowIso?: string;
}): Promise<TollRedTeamResult> {
  if (input.dna !== undefined) {
    return evaluateAssetRedTeam({
      dna: input.dna,
      events: input.events,
      nowIso: input.nowIso,
    });
  }

  const q = String(input.assetDnaId ?? input.assetQuery ?? "").trim();
  if (!q) {
    return evaluateAssetRedTeam({
      dna: null,
      events: input.events,
      nowIso: input.nowIso,
    });
  }

  const resolved = await resolveAurosAsset({ q });
  const dna = resolved.resolved ? resolved.dna : null;
  const events =
    input.events ??
    (dna ? await listProofStreamEventsAsync(dna.id, 50) : undefined);

  return evaluateAssetRedTeam({
    dna,
    events,
    nowIso: input.nowIso,
  });
}

export { DISCLAIMER as RED_TEAM_DISCLAIMER };
