export {
  SHIELD_VERSION,
  SHIELD_DISCLAIMER,
  CRYPTO_PROFILES,
} from "./types";
export type {
  CryptoProfile,
  ShieldSealKind,
  ShieldSealRequest,
  ShieldSeal,
  ShieldVerifyRequest,
  ShieldVerifyResult,
  CryptoBillOfMaterials,
} from "./types";
export {
  resolveShieldSigningKey,
  sha256Hex,
  isContentHash,
  sealLocal,
  verifyLocal,
  buildCbom,
  listProfiles,
} from "./core";
export {
  SHIELD_FREE_TAP_MONTHLY,
  SHIELD_PREMIUM_TAP_MONTHLY,
  SHIELD_FREE_FEATURES,
  SHIELD_PREMIUM_FEATURES,
  shieldTapLimit,
  shieldPlanFromPremium,
} from "./freemium";
export type { ShieldPlan } from "./freemium";
export {
  createCloudTapReceipt,
  getReceipt,
  listReceiptsForExport,
  verifyCloudAnchor,
  toPublicVerify,
  getTapUsage,
  incrementTapUsage,
  ANCHOR_PREFIX,
} from "./tap";
export type { ShieldReceipt, ShieldTapInput, TapReceiptPublic } from "./tap";
export { tapLocal, verifyLocalTap } from "./local-tap";
export type { LocalTapResult } from "./local-tap";
export { instrumentFetch, EASY_INGEST_CURL } from "./easy";
export type { EasyTapConfig } from "./easy";
export {
  withShieldTap,
  expressShieldTap,
  MIDDLEWARE_SNIPPETS,
} from "./middleware";
export type { ShieldMiddlewareConfig } from "./middleware";
export { buildEvidencePack, verifyPackSignature } from "./evidence-pack";
export type { EvidencePack } from "./evidence-pack";
export {
  notifyShieldTapWebhooks,
  SHIELD_WEBHOOK_TAP_CREATED,
} from "./webhooks";
export {
  appendShieldAudit,
  listShieldAudit,
  SHIELD_SLA,
} from "./audit";
export type { ShieldAuditEvent } from "./audit";
export { resealReceipt, packResealHint, RESEAL_PREFIX } from "./reseal";
export type { ResealResult } from "./reseal";
