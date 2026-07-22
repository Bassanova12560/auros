export {
  GREEN_ROUTE,
  GREEN_HUB_ROUTE,
  GREEN_ABOUT_ROUTE,
  GREEN_TRUST_ROUTE,
  GREEN_PORTFOLIO_ROUTE,
  GREEN_PORTFOLIO_DESK_ROUTE,
  GREEN_PORTFOLIO_SSO_ROUTE,
  GREEN_PORTFOLIO_BRANDING_ROUTE,
  GREEN_FAST_TRACK_ROUTE,
  GREEN_INVESTORS_ROUTE,
  GREEN_READINESS_ROUTE,
  GREEN_CSRD_CHECK_ROUTE,
  GREEN_IMPACT_REPORT_ROUTE,
  GREEN_IMPACT_REPORT_READY_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_MARKET_OFFER_ROUTE,
  GREEN_MARKET_ACTOR_ROUTE,
  GREEN_PRODUCERS_ROUTE,
  GREEN_REGISTER_ROUTE,
  GREEN_STORERS_ROUTE,
  GREEN_CHARGERS_ROUTE,
  GREEN_CONSUMERS_ROUTE,
  GREEN_COMPARE_ROUTE,
  GREEN_STANDARDS_ROUTE,
  GREEN_LABEL_ROUTE,
  GREEN_CERTIFICATION_ROUTE,
  GREEN_REGISTRY_ROUTE,
  GREEN_REGISTRY_PROJECT_ROUTE,
  GREEN_GUIDE_ROUTE,
  GREEN_PRATICIEN_ROUTE,
  GREEN_PRATICIEN_EXAM_ROUTE,
  GREEN_RTMS_ASSISTANT_ROUTE,
  GREEN_ASSISTANT_ROUTE,
  GREEN_FAQ_ROUTE,
  GREEN_HOW_IT_WORKS_ROUTE,
  GREEN_BLOG_ROUTE,
  GREEN_PRESS_ROUTE,
  GREEN_REGISTRY_CONNECT_ROUTE,
  GREEN_DPP_ROUTE,
  AUROS_FAQ_ROUTE,
  AUROS_RESOURCES_ROUTE,
  GREEN_VERIFY_ROUTE,
  AUROS_COMPARE_ROUTE,
  AUROS_ACADEMY_ROUTE,
  AUROS_WIZARD_ROUTE,
  GREEN_RTMS_PILLARS,
  GREEN_PRATICIEN_PASS_SCORE,
  GREEN_PRATICIEN_QUIZ_LENGTH,
  GREEN_WIZARD_ASSET_TYPE,
  GREEN_MIN_REFERENCED_TO_HIDE_DEMO,
} from "./constants";

export type { GreenLabelStatus, GreenLabelTier, GreenProjectType, GreenRtmsPillar } from "./constants";
export { getGreenMessages, GREEN_DISCLAIMER } from "./i18n";
export { getGreenMarketMessages } from "./market-i18n";
export type { GreenMarketMessages } from "./market-i18n";
export {
  GREEN_MARKET_ACTORS,
  GREEN_MARKET_OFFERS,
  getGreenMarketActorsByType,
} from "./market/data";
export type {
  GreenMarketActor,
  GreenMarketOffer,
  GreenMarketActorType,
  GreenMarketEnergyType,
  GreenMarketOfferSide,
  GreenMarketStatus,
  GreenMarketListingTier,
  GreenMarketRadiusKm,
} from "./market/types";
export { GREEN_MARKET_CENTER, GREEN_MARKET_OFFERS_STORAGE_KEY } from "./market/types";
export { computeGreenHubImpact, formatImpactNumber } from "./hub-impact";
export type { GreenHubImpact } from "./hub-impact";
export { withinRadiusKm, haversineKm } from "./market/geo";
export { getGreenMarketSnapshot } from "./market/green-market-db";
export type { GreenMarketSnapshot, GreenMarketMode } from "./market/green-market-db";
export {
  getGreenMarketOfferById,
  getGreenMarketActorById,
  listGreenMarketOfferSitemapIds,
  listGreenMarketActorSitemapIds,
} from "./market/green-market-db";
export type { GreenMarketOfferDetail } from "./market/offer-detail";
export type { GreenMarketActorDetail } from "./market/actor-detail";
export {
  greenMarketOfferPath,
  buildGreenMarketOfferShareUrl,
  buildGreenMarketActorFocusUrl,
  findDemoGreenMarketOfferById,
  normalizeGreenMarketOfferId,
  isGreenMarketOfferUuid,
} from "./market/offer-routes";
export {
  greenMarketActorPath,
  buildGreenMarketActorShareUrl,
  findDemoGreenMarketActorById,
  greenMarketActorSheetHref,
  greenMarketActorMailtoHref,
  normalizeGreenMarketActorId,
  isGreenMarketActorUuid,
} from "./market/actor-routes";
export { formatGreenMarketOfferTitle } from "./market/offer-detail";
export { formatGreenMarketActorTitle } from "./market/actor-detail";
export {
  buildGreenMarketOfferJsonLd,
  buildGreenMarketActorJsonLd,
} from "./market/json-ld";
export { submitGreenOfferInterestAction } from "../actions/green-offer-interest";
export { saveGreenMarketOfferAction } from "../actions/green-market-offer";
export { saveGreenMarketActorAction } from "../actions/green-market-actor";
export type { GreenMessages } from "./i18n";
export {
  GREEN_COMPARE_ROWS,
} from "./compare-data";
export type { GreenCompareRow, GreenRegistryProject } from "./compare-data";
export {
  compareGreenTaxonomyScore,
  formatGreenTaxonomyScoreDisplay,
  formatGreenTaxonomyScorePdf,
  sortGreenCompareRowsByTaxonomy,
} from "./compare-taxonomy";
export {
  getGreenRegistrySnapshot,
  getGreenRegistryProjectByToken,
  getGreenRegistryProjectById,
  getGreenRegistryExpertByToken,
  greenVerifyPath,
  greenProjectSummary,
  registerGreenExpert,
  listGreenRegistryProjectSitemapIds,
} from "./green-registry";
export {
  greenRegistryProjectPath,
  normalizeGreenRegistryProjectId,
} from "./registry-routes";
export {
  GREEN_COMPARE_OFFERS_KEY,
  GREEN_COMPARE_OFFERS_MAX,
  GREEN_COMPARE_OFFERS_URL_PARAM,
  addCompareOfferId,
  buildGreenCompareUrl,
  buildGreenCompareShareUrl,
  GREEN_COMPARE_COUNTRIES_URL_PARAM,
  mergeCompareOfferIds,
  normalizeCompareCountries,
  normalizeCompareOfferIds,
  parseCompareCountriesParam,
  parseCompareOfferIdsParam,
  readCompareOfferIds,
  removeCompareOfferId,
  writeCompareOfferIds,
} from "./market/compare-selection";
export { updateGreenLabelApplicationStatus } from "./update-label-status";
export { publishGreenLabelApplication, listPendingGreenLabelApplications } from "./publish-label";
export type { PendingGreenLabelApplication } from "./publish-label";
// Note: Asset DNA hooks live in attach-asset-dna.ts — never re-export here (client barrel).
export {
  computeGreenRtmsScore,
  isGreenWizardAsset,
  type GreenRtmsScore,
  type GreenRtmsTier,
} from "./rtms-scoring";
export {
  computeGreenComplianceScore,
  detectGreenAssetClass,
  isGreenWizardContext,
  type GreenComplianceScore,
  type GreenAssetClass,
  type GreenCompliancePriorityKey,
  type SfdrArticle,
  type EuGbsEligibility,
} from "./scoring/green-compliance";
export { getCsrdCheckerCopy } from "./csrd-check/i18n";
export type { CsrdCheckerCopy } from "./csrd-check/i18n";
export { getGreenComplianceCopy } from "./compliance-i18n";
export type { GreenComplianceCopy } from "./compliance-i18n";
export { getGreenImpactReportCopy } from "./impact-report-i18n";
export type { GreenImpactReportCopy } from "./impact-report-i18n";
export { computeCsrdScope } from "./csrd-check/scoring";
export type { CsrdAnswers, CsrdResult, CsrdQuestionId, CsrdScopeKey, CsrdPriorityKey } from "./csrd-check/types";
export { CSRD_CHECKER_FAQ } from "./csrd-check/faq";
export { generateGreenDossierPDF, suggestedGreenFilename } from "./green-pdf";
export {
  generateGreenImpactReportPDF,
  suggestedGreenImpactReportFilename,
} from "./impact-report-pdf";
export type { GreenImpactReportInput } from "./impact-report-pdf";
export {
  GREEN_IMPACT_REPORT_AMOUNTS,
  greenImpactReportProduct,
  isGreenImpactReportTier,
} from "./impact-report-pricing";
export type { GreenImpactReportTier } from "./impact-report-pricing";
export {
  startGreenPraticienExam,
  submitGreenPraticienExam,
} from "./praticien-exam";
export {
  pickGreenPraticienQuestions,
  scoreGreenPraticienQuiz,
} from "./quiz-praticien";
export type {
  GreenRegistrySnapshot,
  GreenRegistryProjectRow,
  GreenRegistryExpertRow,
} from "./green-registry";
