/**
 * AUROS Shield freemium — make the underlayer indispensable without invasive SI change.
 *
 * FREE: proof tap (hash-only), public counterparty verify, CBOM, limited cloud anchors.
 * PREMIUM: unlimited anchors, batch tap, hybrid_pqc_ready, receipt export.
 */

export const SHIELD_FREE_TAP_MONTHLY = 100;
export const SHIELD_PREMIUM_TAP_MONTHLY = 50_000;

export const SHIELD_FREE_FEATURES = [
  "proof_tap_hash_only",
  "local_seal_verify",
  "public_counterparty_verify",
  "cbom_export",
  "cloud_anchor_limited",
] as const;

export const SHIELD_PREMIUM_FEATURES = [
  "unlimited_cloud_anchors",
  "batch_tap",
  "hybrid_pqc_ready_profile",
  "receipt_export",
  "evidence_pack",
  "raw_ingest",
  "instrument_fetch",
  "middleware_next_express",
  "shield_tap_webhook",
  "audit_log",
  "reseal_pqc",
  "export_autotap",
  "priority_support",
] as const;

export type ShieldPlan = "free" | "premium";

export function shieldTapLimit(plan: ShieldPlan): number {
  return plan === "premium"
    ? SHIELD_PREMIUM_TAP_MONTHLY
    : SHIELD_FREE_TAP_MONTHLY;
}

export function shieldPlanFromPremium(isPremium: boolean): ShieldPlan {
  return isPremium ? "premium" : "free";
}
