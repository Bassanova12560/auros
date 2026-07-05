export const GREEN_CSRD_CHECK_ROUTE = "/green/csrd-check";
export const GREEN_IMPACT_REPORT_ROUTE = "/green/impact-report";
export const GREEN_IMPACT_REPORT_READY_ROUTE = "/green/impact-report/ready";
export const GREEN_REGISTER_ROUTE = "/green/register";
export const GREEN_ROUTE = "/green";
export const GREEN_ABOUT_ROUTE = "/green/about";
export const GREEN_MARKET_ROUTE = "/green/market";
export const GREEN_MARKET_OFFER_ROUTE = "/green/market/offer";
export const GREEN_MARKET_ACTOR_ROUTE = "/green/market/actor";
export const GREEN_PRODUCERS_ROUTE = "/green/producers";
export const GREEN_STORERS_ROUTE = "/green/storers";
export const GREEN_CHARGERS_ROUTE = "/green/chargers";
export const GREEN_CONSUMERS_ROUTE = "/green/consumers";
export const GREEN_COMPARE_ROUTE = "/green/compare";
export const GREEN_STANDARDS_ROUTE = "/green/standards";
export const GREEN_LABEL_ROUTE = "/green/label";
export const GREEN_CERTIFICATION_ROUTE = "/green/certification";
export const GREEN_REGISTRY_ROUTE = "/green/registry";
export const GREEN_REGISTRY_PROJECT_ROUTE = "/green/registry/project";
export const GREEN_GUIDE_ROUTE = "/green/tokenize-surplus";
export const GREEN_PRATICIEN_ROUTE = "/green/praticien";
export const GREEN_PRATICIEN_EXAM_ROUTE = "/green/praticien/exam";
export const GREEN_RTMS_ASSISTANT_ROUTE = "/green/rtms-assistant";
export const GREEN_FAQ_ROUTE = "/green/faq";
export const GREEN_HOW_IT_WORKS_ROUTE = "/green/comment-ca-marche";
export const GREEN_BLOG_ROUTE = "/green/blog";
export const GREEN_VERIFY_ROUTE = "/green/verify";
export const GREEN_MY_ROUTE = "/green/my";

export const AUROS_FAQ_ROUTE = "/faq";
export const AUROS_RESOURCES_ROUTE = "/ressources";

/** Legacy audit URLs → canonical Green routes */
export const GREEN_LEGACY_REDIRECTS = [
  { source: "/green/map", destination: GREEN_MARKET_ROUTE, permanent: true },
  { source: "/green/dashboard", destination: GREEN_MY_ROUTE, permanent: true },
] as const;

export const GREEN_PRATICIEN_PASS_SCORE = 7;
export const GREEN_PRATICIEN_QUIZ_LENGTH = 8;
export const GREEN_EXPERT_VALIDITY_DAYS = 365;
export const GREEN_WIZARD_ASSET_TYPE = "Renewable energy";

/** Hide seeded demo listings in live mode once this many referenced/verified actors exist. */
export const GREEN_MIN_REFERENCED_TO_HIDE_DEMO = 5;

export const AUROS_COMPARE_ROUTE = "/compare";
export const AUROS_ACADEMY_ROUTE = "/academy";
export const AUROS_WIZARD_ROUTE = "/wizard";

/** RTMS — Réel · Transparent · Mesurable · Sain */
export const GREEN_RTMS_PILLARS = ["real", "transparent", "measurable", "sound"] as const;

export type GreenRtmsPillar = (typeof GREEN_RTMS_PILLARS)[number];

export type GreenLabelStatus = "certified" | "in_review" | "reference" | "not_labeled";

export type GreenLabelTier = "verified" | "pilot";

export type GreenProjectType = "solar" | "wind" | "rec" | "carbon" | "ppa" | "water" | "other";
