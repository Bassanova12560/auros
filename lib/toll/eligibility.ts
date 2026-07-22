/**
 * AUROS Eligibility Router v0 — transactional gate before mint/buy/transfer/redeem/list.
 * Indicative only — never auto-blocks markets; integrator enforces. HITL language throughout.
 */

import type { AssetDnaRecord } from "@/lib/asset-dna";
import type { ProofStreamEvent } from "@/lib/proof-stream";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import {
  evaluateTollPolicy,
  type TollPolicyRuleId,
} from "./policy";
import { resolveAurosAsset } from "./resolve";
import { computeAurosTrustScore } from "./trust-score";
import {
  assessWalletBehavioralRisk,
  type WalletRiskSnapshot,
} from "./wallet-risk";

export type TollEligibilityOperation =
  | "mint"
  | "buy"
  | "transfer"
  | "redeem"
  | "list";

/** Eligibility-specific rules (compose with Policy rule ids). */
export type TollEligibilityExtraRuleId =
  | "deny_us_restricted"
  | "require_wallet_attribution"
  | "review_pep"
  | "restrict_unaccredited";

export type TollEligibilityRuleId =
  | TollPolicyRuleId
  | TollEligibilityExtraRuleId;

export type TollEligibilityInvestor = {
  jurisdiction?: string;
  residency?: string;
  wallet?: string;
  pep?: boolean;
  accredited?: boolean;
};

export type TollEligibilityDecisionKind =
  | "allow"
  | "deny"
  | "review"
  | "allow_with_restrictions";

export type TollEligibilityResult = {
  decision: TollEligibilityDecisionKind;
  ruleIds: TollEligibilityRuleId[];
  reasons: string[];
  restrictions: string[];
  trustOverall: number;
  wallet?: WalletRiskSnapshot;
  disclaimer: string;
  operation: TollEligibilityOperation;
  resolved: boolean;
};

const POLICY_RULES: TollPolicyRuleId[] = [
  "deny_unknown",
  "deny_doc_stale_90d",
  "deny_unmapped_entity",
  "review_demo_tier",
  "review_low_trust",
  "require_jurisdiction",
];

const EXTRA_RULES: TollEligibilityExtraRuleId[] = [
  "deny_us_restricted",
  "require_wallet_attribution",
  "review_pep",
  "restrict_unaccredited",
];

const ALL_ELIGIBILITY_RULES: TollEligibilityRuleId[] = [
  ...POLICY_RULES,
  ...EXTRA_RULES,
];

const DISCLAIMER =
  "Indicative eligibility only — HITL / integrator enforces; AUROS does not auto-block markets or certify investors.";

function isPolicyRuleId(id: string): id is TollPolicyRuleId {
  return (POLICY_RULES as string[]).includes(id);
}

function isUsInvestor(investor?: TollEligibilityInvestor): boolean {
  const raw = (
    investor?.jurisdiction ??
    investor?.residency ??
    ""
  )
    .trim()
    .toUpperCase();
  if (!raw) return false;
  return raw === "US" || raw === "USA" || raw.startsWith("US-");
}

/** Restricted product: demo listing tier or jurisdiction.frame hint. */
export function isRestrictedProduct(dna: AssetDnaRecord): boolean {
  if (dna.compliance?.listingTier === "demo") return true;
  const frame = (dna.jurisdiction?.frame ?? "").toLowerCase();
  return (
    frame.includes("restricted") ||
    frame.includes("us-restricted") ||
    frame.includes("us_restricted")
  );
}

function pickDecision(
  ruleIds: TollEligibilityRuleId[],
  restrictions: string[]
): TollEligibilityDecisionKind {
  const hardDeny = ruleIds.some(
    (r) =>
      r.startsWith("deny_") ||
      r === "require_jurisdiction" ||
      r === "require_wallet_attribution"
  );
  if (hardDeny) return "deny";

  const needsReview = ruleIds.some((r) => r.startsWith("review_"));
  if (needsReview) return "review";

  if (restrictions.length > 0 || ruleIds.includes("restrict_unaccredited")) {
    return "allow_with_restrictions";
  }

  return "allow";
}

/**
 * Pure eligibility evaluation given a resolved (or null) DNA.
 * Unit-test friendly — no I/O.
 */
export function evaluateEligibility(input: {
  dna: AssetDnaRecord | null;
  events?: ProofStreamEvent[];
  investor?: TollEligibilityInvestor;
  operation: TollEligibilityOperation;
  rules?: TollEligibilityRuleId[];
  nowIso?: string;
}): TollEligibilityResult {
  const active = new Set<TollEligibilityRuleId>(
    input.rules?.length ? input.rules : ALL_ELIGIBILITY_RULES
  );

  const policyRules = [...active].filter(isPolicyRuleId);
  const policy = evaluateTollPolicy({
    dna: input.dna,
    events: input.events,
    // Empty selection = skip policy rules when DNA is present; unknown DNA still denied below.
    rules: policyRules.length
      ? policyRules
      : input.dna
        ? []
        : ["deny_unknown"],
    nowIso: input.nowIso,
  });

  const op = input.operation;
  const investor = input.investor;

  // Unresolved assets never clear the gate (indicative deny — integrator enforces).
  if (!input.dna) {
    const ruleIds: TollEligibilityRuleId[] = policy.ruleIds.length
      ? [...policy.ruleIds]
      : active.has("deny_unknown")
        ? ["deny_unknown"]
        : [];
    const reasons =
      policy.reasons.length > 0
        ? [...policy.reasons]
        : ["Asset not AUROS-resolved."];
    return {
      decision: "deny",
      ruleIds,
      reasons,
      restrictions: [],
      trustOverall: policy.trustOverall,
      disclaimer: DISCLAIMER,
      operation: op,
      resolved: false,
    };
  }

  const ruleIds: TollEligibilityRuleId[] = [...policy.ruleIds];
  const reasons: string[] = [...policy.reasons];
  const restrictions: string[] = [];
  let wallet: WalletRiskSnapshot | undefined;

  const dna = input.dna;

  if (active.has("deny_us_restricted") && isUsInvestor(investor)) {
    if (isRestrictedProduct(dna)) {
      ruleIds.push("deny_us_restricted");
      reasons.push(
        "US investor on restricted / demo product (indicative — integrator enforces)."
      );
    }
  }

  if (active.has("require_wallet_attribution") && op === "transfer") {
    const walletRaw = investor?.wallet?.trim() ?? "";
    if (!walletRaw || walletRaw.length < 8) {
      ruleIds.push("require_wallet_attribution");
      reasons.push("Transfer requires wallet attribution.");
    } else {
      wallet = assessWalletBehavioralRisk({
        wallet: walletRaw,
        entityLabel: investor?.jurisdiction
          ? `investor:${investor.jurisdiction}`
          : undefined,
      });
      if (wallet.flags.includes("unattributed_wallet")) {
        restrictions.push("wallet_attribution_pending");
        reasons.push(
          "Wallet present but attribution incomplete — HITL confirm before transfer."
        );
      } else if (wallet.band === "high") {
        restrictions.push("wallet_elevated_risk_hitl");
        reasons.push(wallet.summary);
      } else if (wallet.band === "medium") {
        restrictions.push("wallet_attribution_confirm");
        reasons.push(
          "Wallet attribution confidence medium — confirm before transfer."
        );
      }
    }
  } else if (investor?.wallet?.trim()) {
    wallet = assessWalletBehavioralRisk({ wallet: investor.wallet.trim() });
    if (wallet.band === "high") {
      restrictions.push("wallet_elevated_risk_hitl");
      reasons.push(wallet.summary);
    }
  }

  if (active.has("review_pep") && investor?.pep === true) {
    ruleIds.push("review_pep");
    reasons.push("PEP flag — escalate to HITL compliance review.");
  }

  if (
    active.has("restrict_unaccredited") &&
    (op === "buy" || op === "mint" || op === "list") &&
    investor?.accredited === false
  ) {
    ruleIds.push("restrict_unaccredited");
    restrictions.push("accreditation_not_attested");
    reasons.push(
      "Accreditation not attested — allow with restrictions only (indicative)."
    );
  }

  // Drop the generic "no rules" allow reason if we added eligibility signals
  const cleanedReasons =
    ruleIds.length > policy.ruleIds.length || restrictions.length > 0
      ? reasons.filter((r) => !/No v0 deny\/review rules triggered/i.test(r))
      : reasons;

  const decision = pickDecision(ruleIds, restrictions);

  if (decision === "allow" && cleanedReasons.length === 0) {
    cleanedReasons.push("No v0 eligibility deny/review/restrict rules triggered.");
  }

  return {
    decision,
    ruleIds,
    reasons: cleanedReasons,
    restrictions,
    trustOverall: policy.trustOverall,
    wallet,
    disclaimer: DISCLAIMER,
    operation: op,
    resolved: Boolean(dna),
  };
}

/**
 * Transactional eligibility router: resolve asset → policy → optional wallet-risk.
 */
export async function routeEligibility(input: {
  assetQuery?: string;
  assetDnaId?: string;
  investor?: TollEligibilityInvestor;
  operation: TollEligibilityOperation;
  rules?: TollEligibilityRuleId[];
  nowIso?: string;
}): Promise<TollEligibilityResult & { query: string }> {
  const q = String(input.assetDnaId ?? input.assetQuery ?? "").trim();
  if (!q) {
    const empty = evaluateEligibility({
      dna: null,
      investor: input.investor,
      operation: input.operation,
      rules: input.rules,
      nowIso: input.nowIso,
    });
    return { ...empty, query: "", trustOverall: computeAurosTrustScore({ dna: null }).overall };
  }

  const resolved = await resolveAurosAsset({ q });
  const dna = resolved.resolved ? resolved.dna : null;
  const events = dna
    ? await listProofStreamEventsAsync(dna.id, 50)
    : undefined;

  const result = evaluateEligibility({
    dna,
    events,
    investor: input.investor,
    operation: input.operation,
    rules: input.rules,
    nowIso: input.nowIso,
  });

  return { ...result, query: q };
}

export { ALL_ELIGIBILITY_RULES, EXTRA_RULES, POLICY_RULES };
