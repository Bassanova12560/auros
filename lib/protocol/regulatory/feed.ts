/** Curated ESMA / AMF / BaFin regulatory feed — static seed data, no scraping (v1). */

export const REGULATORY_TAGS = ["mica", "esma", "amf", "bafin"] as const;
export type RegulatoryTag = (typeof REGULATORY_TAGS)[number];

export const REGULATORY_SOURCES = ["ESMA", "AMF", "BaFin", "EC", "EBA"] as const;
export type RegulatorySource = (typeof REGULATORY_SOURCES)[number];

export type RegulatoryEventType =
  | "regulation_update"
  | "new_requirement"
  | "deadline_approaching";

export type RegulatoryFeedItem = {
  id: string;
  title: string;
  source: RegulatorySource;
  jurisdiction: string;
  published_at: string;
  url: string;
  summary: string;
  tags: RegulatoryTag[];
  severity: "low" | "medium" | "high";
  event_type: RegulatoryEventType;
  /** Monitor matching — jurisdictions this update applies to */
  jurisdictions: string[];
  /** Monitor matching — asset types affected */
  asset_types: string[];
  impact_on_score: number;
  deadline?: string;
};

/** When the curated feed was last reviewed / seeded. */
export const REGULATORY_FEED_LAST_UPDATED = "2026-06-13";

export const REGULATORY_FEED: RegulatoryFeedItem[] = [
  {
    id: "esma-2025-mica-casp-deadline",
    title: "MiCA CASP authorisation — transition deadline reminder",
    source: "ESMA",
    jurisdiction: "eu",
    published_at: "2025-12-01",
    url: "https://www.esma.europa.eu/policy-activities/crypto-assets",
    summary:
      "Existing crypto-asset service providers must complete MiCA authorisation or cease EU operations by the transition deadline.",
    tags: ["mica", "esma"],
    severity: "high",
    event_type: "deadline_approaching",
    jurisdictions: ["eu", "france", "germany", "luxembourg", "netherlands"],
    asset_types: ["stablecoins", "other", "private_fund"],
    impact_on_score: -8,
    deadline: "2026-07-01",
  },
  {
    id: "esma-2025-art-whitepaper",
    title: "ESMA Q&A — ART whitepaper content requirements",
    source: "ESMA",
    jurisdiction: "eu",
    published_at: "2025-11-15",
    url: "https://www.esma.europa.eu/policy-activities/crypto-assets/asset-referenced-and-e-money-tokens",
    summary:
      "Updated guidance on reserve asset disclosure and redemption rights for asset-referenced tokens under MiCA Title III.",
    tags: ["mica", "esma"],
    severity: "medium",
    event_type: "regulation_update",
    jurisdictions: ["eu", "luxembourg", "ireland"],
    asset_types: ["stablecoins"],
    impact_on_score: -5,
  },
  {
    id: "esma-2025-emt-e-money",
    title: "EMT issuer authorisation — credit institution equivalence",
    source: "ESMA",
    jurisdiction: "eu",
    published_at: "2025-10-20",
    url: "https://www.esma.europa.eu/policy-activities/crypto-assets/asset-referenced-and-e-money-tokens",
    summary:
      "Clarification on e-money token issuers requiring credit institution or e-money institution licence under MiCA Title IV.",
    tags: ["mica", "esma"],
    severity: "high",
    event_type: "new_requirement",
    jurisdictions: ["eu", "france", "germany"],
    asset_types: ["stablecoins"],
    impact_on_score: -10,
  },
  {
    id: "esma-2025-tokenised-securities",
    title: "Tokenised financial instruments — MiFID II / Prospectus interplay",
    source: "ESMA",
    jurisdiction: "eu",
    published_at: "2025-09-05",
    url: "https://www.esma.europa.eu/policy-activities/crypto-assets/markets-in-crypto-assets-regulation-mica",
    summary:
      "ESMA highlights that tokenised bonds and fund units may fall under existing securities regulation rather than MiCA Title II.",
    tags: ["mica", "esma"],
    severity: "medium",
    event_type: "regulation_update",
    jurisdictions: ["eu", "luxembourg", "france", "germany"],
    asset_types: ["bonds", "private_fund", "real_estate", "private_credit"],
    impact_on_score: -3,
  },
  {
    id: "esma-2025-aml-travel-rule",
    title: "Travel Rule — CASP transfer of information obligations",
    source: "ESMA",
    jurisdiction: "eu",
    published_at: "2025-08-12",
    url: "https://www.esma.europa.eu/policy-activities/crypto-assets/anti-money-laundering",
    summary:
      "Reinforced AML/CFT information requirements for CASPs on crypto-asset transfers under MiCA and TFR.",
    tags: ["mica", "esma"],
    severity: "medium",
    event_type: "new_requirement",
    jurisdictions: ["eu"],
    asset_types: ["other", "stablecoins", "bonds", "private_fund"],
    impact_on_score: -4,
  },
  {
    id: "esma-2025-mica-register",
    title: "ESMA MiCA register — public CASP and whitepaper database",
    source: "ESMA",
    jurisdiction: "eu",
    published_at: "2025-07-18",
    url: "https://www.esma.europa.eu/publications-data/interactive-single-rulebook/mica",
    summary:
      "Central register for authorised CASPs and published crypto-asset whitepapers under MiCA — due diligence reference for issuers.",
    tags: ["mica", "esma"],
    severity: "low",
    event_type: "regulation_update",
    jurisdictions: ["eu"],
    asset_types: ["other", "stablecoins", "bonds", "private_fund", "real_estate"],
    impact_on_score: 0,
  },
  {
    id: "esma-2025-dlt-pilot",
    title: "DLT Pilot Regime — tokenised securities market infrastructure",
    source: "ESMA",
    jurisdiction: "eu",
    published_at: "2025-06-22",
    url: "https://www.esma.europa.eu/policy-activities/crypto-assets/dlt-pilot-regime",
    summary:
      "Guidance on DLT market infrastructures for tokenised bonds and fund units — sandbox path parallel to MiCA.",
    tags: ["esma", "mica"],
    severity: "medium",
    event_type: "regulation_update",
    jurisdictions: ["eu", "france", "germany", "luxembourg"],
    asset_types: ["bonds", "private_fund"],
    impact_on_score: 2,
  },
  {
    id: "amf-2025-psan-transition",
    title: "AMF — transition PSAN vers agrément MiCA CASP",
    source: "AMF",
    jurisdiction: "france",
    published_at: "2025-11-28",
    url: "https://www.amf-france.org/fr/actualites-publications/actualites/lamf-publie-son-calendrier-de-transition-vers-mica",
    summary:
      "Calendrier AMF pour les PSAN français : dossiers d'agrément CASP MiCA et continuité de service pendant la transition.",
    tags: ["amf", "mica"],
    severity: "high",
    event_type: "deadline_approaching",
    jurisdictions: ["france", "eu"],
    asset_types: ["stablecoins", "other", "private_fund"],
    impact_on_score: -7,
    deadline: "2026-07-01",
  },
  {
    id: "amf-2025-crypto-actifs-professionnels",
    title: "AMF — crypto-actifs et investisseurs professionnels",
    source: "AMF",
    jurisdiction: "france",
    published_at: "2025-10-08",
    url: "https://www.amf-france.org/fr/professionnels/fintech-et-innovation/actifs-numeriques-et-crypto-actifs",
    summary:
      "Cadre AMF pour l'offre de crypto-actifs aux investisseurs professionnels et qualification des tokens sous MiCA.",
    tags: ["amf", "mica"],
    severity: "medium",
    event_type: "regulation_update",
    jurisdictions: ["france"],
    asset_types: ["real_estate", "private_fund", "bonds", "private_credit", "other"],
    impact_on_score: -3,
  },
  {
    id: "amf-2025-ico-whitepaper",
    title: "AMF — publication de whitepapers crypto-actifs",
    source: "AMF",
    jurisdiction: "france",
    published_at: "2025-09-12",
    url: "https://www.amf-france.org/fr/professionnels/fintech-et-innovation/actifs-numeriques-et-crypto-actifs/publication-dun-whitepaper",
    summary:
      "Procédure de notification et contenu minimal des whitepapers pour émetteurs visant des investisseurs en France.",
    tags: ["amf", "mica"],
    severity: "medium",
    event_type: "new_requirement",
    jurisdictions: ["france"],
    asset_types: ["other", "stablecoins", "real_estate"],
    impact_on_score: -5,
  },
  {
    id: "amf-2025-sandbox-innovation",
    title: "AMF Innovation Hub — sandbox fintech et tokenisation",
    source: "AMF",
    jurisdiction: "france",
    published_at: "2025-05-30",
    url: "https://www.amf-france.org/fr/professionnels/fintech-et-innovation",
    summary:
      "Programme AMF Innovation Hub pour projets tokenisation RWA — dialogue régulateur avant agrément MiCA.",
    tags: ["amf"],
    severity: "low",
    event_type: "regulation_update",
    jurisdictions: ["france"],
    asset_types: ["real_estate", "private_fund", "bonds", "other"],
    impact_on_score: 1,
  },
  {
    id: "bafin-2025-krypto-verwahrung",
    title: "BaFin — crypto custody and CASP licensing under MiCA",
    source: "BaFin",
    jurisdiction: "germany",
    published_at: "2025-11-20",
    url: "https://www.bafin.de/EN/Aufgaben/Marktaufsicht/DLT_Blockchain/dlt_blockchain_node.html",
    summary:
      "BaFin guidance on crypto custody services and MiCA authorisation for German CASPs and token issuers.",
    tags: ["bafin", "mica"],
    severity: "high",
    event_type: "new_requirement",
    jurisdictions: ["germany", "eu"],
    asset_types: ["stablecoins", "other", "bonds"],
    impact_on_score: -6,
  },
  {
    id: "bafin-2025-tokenisierte-wertpapiere",
    title: "BaFin — tokenised securities (eWpG) and MiCA boundary",
    source: "BaFin",
    jurisdiction: "germany",
    published_at: "2025-08-30",
    url: "https://www.bafin.de/EN/Aufgaben/Marktaufsicht/DLT_Blockchain/eWpG/eWpG_node.html",
    summary:
      "Electronic securities act (eWpG) interplay with MiCA for tokenised bonds and fund units issued in Germany.",
    tags: ["bafin", "mica"],
    severity: "medium",
    event_type: "regulation_update",
    jurisdictions: ["germany"],
    asset_types: ["bonds", "private_fund", "real_estate"],
    impact_on_score: -2,
  },
  {
    id: "bafin-2025-stablecoin-euro",
    title: "BaFin — stablecoin issuers and e-money institution requirements",
    source: "BaFin",
    jurisdiction: "germany",
    published_at: "2025-07-14",
    url: "https://www.bafin.de/EN/Aufgaben/Marktaufsicht/DLT_Blockchain/dlt_blockchain_node.html",
    summary:
      "German stablecoin issuers must assess EMT classification and BaFin licensing paths under MiCA Title IV.",
    tags: ["bafin", "mica"],
    severity: "high",
    event_type: "new_requirement",
    jurisdictions: ["germany", "eu"],
    asset_types: ["stablecoins"],
    impact_on_score: -9,
  },
  {
    id: "ec-2025-mica-level2",
    title: "European Commission — MiCA Level 2 RTS on reserve assets",
    source: "EC",
    jurisdiction: "eu",
    published_at: "2025-06-01",
    url: "https://finance.ec.europa.eu/regulation-and-supervision/financial-services/markets-crypto-assets-mica_en",
    summary:
      "Delegated acts on reserve composition, custody and redemption procedures for asset-referenced tokens.",
    tags: ["mica", "esma"],
    severity: "medium",
    event_type: "regulation_update",
    jurisdictions: ["eu"],
    asset_types: ["stablecoins"],
    impact_on_score: -4,
  },
  {
    id: "esma-2025-casp-governance",
    title: "ESMA — CASP governance and conflict of interest rules",
    source: "ESMA",
    jurisdiction: "eu",
    published_at: "2025-04-18",
    url: "https://www.esma.europa.eu/policy-activities/crypto-assets/markets-in-crypto-assets-regulation-mica",
    summary:
      "Technical standards on CASP internal governance, complaints handling and outsourcing under MiCA.",
    tags: ["esma", "mica"],
    severity: "medium",
    event_type: "new_requirement",
    jurisdictions: ["eu", "luxembourg", "france", "germany", "netherlands"],
    asset_types: ["other", "stablecoins", "private_fund"],
    impact_on_score: -3,
  },
  {
    id: "amf-2026-rwa-tokenisation",
    title: "AMF — tokenisation d'actifs du monde réel (RWA) — points de vigilance",
    source: "AMF",
    jurisdiction: "france",
    published_at: "2026-01-15",
    url: "https://www.amf-france.org/fr/professionnels/fintech-et-innovation/actifs-numeriques-et-crypto-actifs",
    summary:
      "AMF rappelle les critères de qualification titres vs crypto-actifs pour les projets RWA immobilier et private credit.",
    tags: ["amf", "mica"],
    severity: "medium",
    event_type: "regulation_update",
    jurisdictions: ["france"],
    asset_types: ["real_estate", "private_credit", "bonds", "private_fund"],
    impact_on_score: -4,
  },
  {
    id: "bafin-2026-rwa-prospectus",
    title: "BaFin FAQ — prospectus requirements for tokenised real estate",
    source: "BaFin",
    jurisdiction: "germany",
    published_at: "2026-02-10",
    url: "https://www.bafin.de/EN/Aufgaben/Marktaufsicht/DLT_Blockchain/dlt_blockchain_node.html",
    summary:
      "FAQ on when tokenised real estate offerings trigger prospectus obligations vs MiCA whitepaper rules.",
    tags: ["bafin", "mica"],
    severity: "medium",
    event_type: "regulation_update",
    jurisdictions: ["germany"],
    asset_types: ["real_estate"],
    impact_on_score: -5,
  },
];

export type RegulatoryFeedQuery = {
  jurisdiction?: string;
  tag?: RegulatoryTag;
  since?: string;
  limit?: number;
};

export function toPublicFeedItem(item: RegulatoryFeedItem) {
  return {
    id: item.id,
    title: item.title,
    source: item.source,
    jurisdiction: item.jurisdiction,
    published_at: item.published_at,
    url: item.url,
    summary: item.summary,
    tags: item.tags,
    severity: item.severity,
    event_type: item.event_type,
    deadline: item.deadline ?? null,
  };
}

export function queryRegulatoryFeed(query: RegulatoryFeedQuery = {}): RegulatoryFeedItem[] {
  const limit = Math.min(Math.max(query.limit ?? 50, 1), 100);
  let items = [...REGULATORY_FEED];

  if (query.jurisdiction) {
    const j = query.jurisdiction.toLowerCase();
    items = items.filter(
      (item) =>
        item.jurisdiction === j ||
        item.jurisdictions.includes(j) ||
        item.jurisdictions.includes("eu")
    );
  }

  if (query.tag) {
    items = items.filter((item) => item.tags.includes(query.tag!));
  }

  if (query.since) {
    const sinceMs = Date.parse(query.since);
    if (!Number.isNaN(sinceMs)) {
      items = items.filter((item) => Date.parse(item.published_at) >= sinceMs);
    }
  }

  items.sort(
    (a, b) => Date.parse(b.published_at) - Date.parse(a.published_at)
  );

  return items.slice(0, limit);
}

/** Match feed items to a premium asset monitor profile (cron alerts). */
export function filterFeedForMonitor(monitor: {
  jurisdiction: string;
  asset_type: string;
  alert_on: string[];
}): RegulatoryFeedItem[] {
  const j = monitor.jurisdiction.toLowerCase();
  return REGULATORY_FEED.filter((item) => {
    if (!monitor.alert_on.includes(item.event_type)) return false;
    const jurisdictionMatch =
      item.jurisdictions.includes("eu") ||
      item.jurisdictions.some((uj) => j.includes(uj) || uj.includes(j));
    const assetMatch =
      item.asset_types.includes(monitor.asset_type) ||
      item.asset_types.includes("other");
    return jurisdictionMatch && assetMatch;
  }).sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
}

/** Match feed items to a regulatory feed subscription. */
export function filterFeedForSubscription(sub: {
  jurisdictions: string[];
  tags?: RegulatoryTag[];
}): RegulatoryFeedItem[] {
  const normalized = sub.jurisdictions.map((j) => j.toLowerCase());
  return REGULATORY_FEED.filter((item) => {
    const jurisdictionMatch =
      normalized.includes("eu") ||
      normalized.some(
        (j) =>
          item.jurisdiction === j ||
          item.jurisdictions.includes(j) ||
          (j !== "eu" && item.jurisdictions.includes("eu"))
      );
    if (!jurisdictionMatch) return false;
    if (sub.tags?.length) {
      return sub.tags.some((t) => item.tags.includes(t));
    }
    return true;
  }).sort((a, b) => Date.parse(b.published_at) - Date.parse(a.published_at));
}
