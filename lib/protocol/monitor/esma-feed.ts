/** Curated ESMA / MiCA regulatory update feed — static JSON, no scraping. */
export type EsmaUpdate = {
  id: string;
  published_at: string;
  title: string;
  summary: string;
  jurisdictions: string[];
  asset_types: string[];
  severity: "low" | "medium" | "high";
  impact_on_score: number;
  event_type: "regulation_update" | "new_requirement" | "deadline_approaching";
  source_url: string;
  deadline?: string;
};

export const ESMA_UPDATE_FEED: EsmaUpdate[] = [
  {
    id: "esma-2025-mica-casp-deadline",
    published_at: "2025-12-01",
    title: "MiCA CASP authorisation — transition deadline reminder",
    summary:
      "Existing crypto-asset service providers must complete MiCA authorisation or cease EU operations by the transition deadline.",
    jurisdictions: ["eu", "france", "germany", "luxembourg", "netherlands"],
    asset_types: ["stablecoins", "other", "private_fund"],
    severity: "high",
    impact_on_score: -8,
    event_type: "deadline_approaching",
    source_url: "https://www.esma.europa.eu/policy-activities/crypto-assets",
    deadline: "2026-07-01",
  },
  {
    id: "esma-2025-art-whitepaper",
    published_at: "2025-11-15",
    title: "ESMA Q&A — ART whitepaper content requirements",
    summary:
      "Updated guidance on reserve asset disclosure and redemption rights for asset-referenced tokens under MiCA Title III.",
    jurisdictions: ["eu", "luxembourg", "ireland"],
    asset_types: ["stablecoins"],
    severity: "medium",
    impact_on_score: -5,
    event_type: "regulation_update",
    source_url: "https://www.esma.europa.eu/policy-activities/crypto-assets",
  },
  {
    id: "esma-2025-emt-e-money",
    published_at: "2025-10-20",
    title: "EMT issuer authorisation — credit institution equivalence",
    summary:
      "Clarification on e-money token issuers requiring credit institution or e-money institution licence under MiCA Title IV.",
    jurisdictions: ["eu", "france", "germany"],
    asset_types: ["stablecoins"],
    severity: "high",
    impact_on_score: -10,
    event_type: "new_requirement",
    source_url: "https://www.esma.europa.eu/policy-activities/crypto-assets",
  },
  {
    id: "esma-2025-tokenised-securities",
    published_at: "2025-09-05",
    title: "Tokenised financial instruments — MiFID II / Prospectus interplay",
    summary:
      "ESMA highlights that tokenised bonds and fund units may fall under existing securities regulation rather than MiCA Title II.",
    jurisdictions: ["eu", "luxembourg", "france", "germany"],
    asset_types: ["bonds", "private_fund", "real_estate", "private_credit"],
    severity: "medium",
    impact_on_score: -3,
    event_type: "regulation_update",
    source_url: "https://www.esma.europa.eu/policy-activities/crypto-assets",
  },
  {
    id: "esma-2025-aml-travel-rule",
    published_at: "2025-08-12",
    title: "Travel Rule — CASP transfer of information obligations",
    summary:
      "Reinforced AML/CFT information requirements for CASPs on crypto-asset transfers under MiCA and TFR.",
    jurisdictions: ["eu"],
    asset_types: ["other", "stablecoins", "bonds", "private_fund"],
    severity: "medium",
    impact_on_score: -4,
    event_type: "new_requirement",
    source_url: "https://www.esma.europa.eu/policy-activities/crypto-assets",
  },
];

export function updatesForMonitor(monitor: {
  jurisdiction: string;
  asset_type: string;
  alert_on: string[];
}): EsmaUpdate[] {
  const j = monitor.jurisdiction.toLowerCase();
  return ESMA_UPDATE_FEED.filter((u) => {
    if (!monitor.alert_on.includes(u.event_type)) return false;
    const jurisdictionMatch =
      u.jurisdictions.includes("eu") ||
      u.jurisdictions.some((uj) => j.includes(uj) || uj.includes(j));
    const assetMatch =
      u.asset_types.includes(monitor.asset_type) || u.asset_types.includes("other");
    return jurisdictionMatch && assetMatch;
  });
}
