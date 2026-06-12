export {
  PROTOCOL_VERSION,
  PROTOCOL_DISCLAIMER,
  AUROS_LOGO_URL,
  DEMO_API_KEY,
  KEY_PREFIX_LIVE,
  KEY_PREFIX_TEST,
} from "./constants";
export { protocolJson, protocolError, getProtocolResponseHeaders } from "./response";
export { protocolRoute, withResponseTime, withRateLimitHeaders, responseTimeMs } from "./timing";
export { getProtocolStatus } from "./status";
export type { ProtocolStatusPayload, ServiceCheck, ServiceHealth } from "./status";
export { authenticateProtocolRequest } from "./auth/middleware";
export {
  createApiKey,
  validateApiKey,
  findKeyRecord,
  getKeyUsage,
  isSupabaseConfigured,
} from "./auth/keys";
export { checkPremiumAccess, premiumPricingMeta, PREMIUM_PRICING } from "./auth/premium";
export { computeProtocolScore, attachRecommendedPlatforms } from "./scoring/compute-score";
export { listProtocolProducts, topPlatformsForAsset, hubToProductItem } from "./products/adapter";
export { buildProtocolCompare } from "./compare/build";
export type { CompareBuildResult, CompareBuildPayload } from "./compare/build";
export {
  compareRequestSchema,
  compareResponseSchema,
  COMPARE_MIN_PRODUCTS,
  COMPARE_MAX_PRODUCTS,
} from "./schemas/compare";
export type { CompareRequest, CompareProduct, CompareResponse } from "./schemas/compare";
export { rankProtocolJurisdictions } from "./jurisdictions/rank";
export { generateChecklist } from "./checklist/generate";
export { parseDescription } from "./nlp/parse-description";
export { scoreRequestSchema, scoreResponseSchema } from "./schemas/score";
export type { ScoreRequest, ScoreResponse } from "./schemas/score";
export {
  scoreHistoryResponseSchema,
  scoreHistoryEntrySchema,
} from "./schemas/score-history";
export type { ScoreHistoryEntry, ScoreHistoryResponse } from "./schemas/score-history";
export {
  newScoreId,
  isValidScoreSessionId,
  scoreSessionOwnedByKey,
  resolveScoreSessionId,
  recordScoreHistory,
  listScoreHistory,
} from "./scoring/history";
export type { ScoreHistoryRecord, ScoreHistoryPayload } from "./scoring/history";
export { productsQuerySchema } from "./schemas/products";
export { jurisdictionsQuerySchema } from "./schemas/jurisdictions";
export { checklistRequestSchema } from "./schemas/checklist";
export { createKeyRequestSchema } from "./schemas/keys";
export { monitorRequestSchema, ALERT_TYPES } from "./schemas/monitor";
export { dossierRequestSchema, DOSSIER_SECTIONS } from "./schemas/dossier";
export { webhookRegisterSchema } from "./schemas/webhooks";
export { createMonitor, getMonitor, deleteMonitor, countActiveMonitors } from "./monitor/store";
export { checkRegulatoryUpdates } from "./monitor/check-regulatory-updates";
export { registerWebhook, listWebhooksForKey, deleteWebhook } from "./webhooks/store";
export {
  signWebhookPayload,
  webhookSignatureHeader,
  verifyWebhookSignature,
  dispatchWebhook,
} from "./webhooks/sign";
export { generateDossierPayload, getDossierPayload, dossierJsonExport } from "./dossier/generate";
export {
  createDossierDownloadToken,
  verifyDossierDownloadToken,
} from "./dossier/download-token";
export { logProtocolUsage, getUsageStats, findKeyHashByEmail } from "./usage/log";
export {
  PROTOCOL_CHANGELOG,
  PROTOCOL_CHANGELOG_ROUTE,
  getProtocolChangelogPayload,
  getReleasedChangelogEntries,
  getUpcomingChangelogEntries,
} from "./changelog";
export type {
  ProtocolChangelogEntry,
  ProtocolChangelogPayload,
  ChangelogEntryStatus,
} from "./changelog";
