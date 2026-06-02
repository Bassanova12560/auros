/**
 * RWA platform eligibility matrix — requirements used for match & admission scoring.
 */

import type { RwaDocumentId } from "@/lib/rwa-document-phases";

export type RwaPlatformId =
  | "tokenfi"
  | "rwa_xyz"
  | "ix_swap"
  | "stobox"
  | "centrifuge"
  | "ondo"
  | "polymesh"
  | "defillama";

export type RwaPlatformDef = {
  id: RwaPlatformId;
  name: string;
  description: string;
  url: string;
  processTimeline: string;
  keyRequirements: string;
  requiredDocuments: RwaDocumentId[];
  /** Asset category slugs (see platform-match ASSET_TYPE_SLUG) */
  preferredAssets: string[];
  minValueEur?: number;
  maxValueEur?: number;
  requiresEu?: boolean;
  requiresAccredited?: boolean;
  requiresCashflow?: boolean;
  requiresOnChainTruth?: boolean;
};

export const RWA_PLATFORMS: RwaPlatformDef[] = [
  {
    id: "tokenfi",
    name: "TokenFi",
    description:
      "Legal ownership, AML/KYC baseline, and asset documentation for token issuance.",
    url: "https://tokenfi.com/",
    processTimeline: "1–4 weeks (setup & compliance)",
    keyRequirements: "Legal ownership · AML/KYC · Asset details",
    requiredDocuments: [
      "proof_of_ownership",
      "kyc_aml_policy",
      "legal_opinion",
      "valuation_report",
    ],
    preferredAssets: [
      "real_estate",
      "precious_metals",
      "fine_art",
      "private_credit",
      "other",
    ],
    minValueEur: 25_000,
  },
  {
    id: "rwa_xyz",
    name: "RWA.xyz",
    description:
      "On-chain source of truth, verifiable structure, and public asset classification.",
    url: "https://rwa.xyz/",
    processTimeline: "Due diligence per asset",
    keyRequirements: "On-chain truth · Legal structure · Token deployed",
    requiredDocuments: [
      "proof_of_ownership",
      "spv_documents",
      "legal_opinion",
      "smart_contract_audit",
      "whitepaper",
    ],
    preferredAssets: [
      "real_estate",
      "private_credit",
      "precious_metals",
      "solar_energy",
    ],
    requiresOnChainTruth: true,
    minValueEur: 50_000,
  },
  {
    id: "ix_swap",
    name: "IX Swap",
    description:
      "Principal issuer KYC/AML, corporate and financial disclosures, audited contracts.",
    url: "https://www.ixswap.io/",
    processTimeline: "Multi-step: submission → contract deployment",
    keyRequirements: "Corporate docs · Audited financials · SC audit · KYC/AML",
    requiredDocuments: [
      "spv_documents",
      "valuation_report",
      "smart_contract_audit",
      "kyc_aml_policy",
      "prospectus",
      "due_diligence_report",
    ],
    preferredAssets: ["private_credit", "real_estate", "precious_metals"],
    minValueEur: 100_000,
    requiresAccredited: true,
  },
  {
    id: "stobox",
    name: "Stobox",
    description:
      "Verifiable ownership, cashflow or equity participation; pre-qualification audit first.",
    url: "https://stobox.io/",
    processTimeline: "5–7 days pre-qualification audit",
    keyRequirements: "Ownership proof · Cashflow · Regulatory mapping",
    requiredDocuments: [
      "proof_of_ownership",
      "valuation_report",
      "due_diligence_report",
      "legal_opinion",
      "kyc_aml_policy",
    ],
    preferredAssets: [
      "real_estate",
      "private_credit",
      "fine_art",
      "wine_spirits",
    ],
    requiresCashflow: true,
    minValueEur: 75_000,
  },
  {
    id: "centrifuge",
    name: "Centrifuge",
    description:
      "Stable-value assets (invoices, mortgages, royalties); pools need track record.",
    url: "https://centrifuge.io/",
    processTimeline: "Few days via RWA Launchpad",
    keyRequirements: "Stable cashflows · Pool rules · Compliance config",
    requiredDocuments: [
      "proof_of_ownership",
      "valuation_report",
      "due_diligence_report",
      "tokenomics",
      "kyc_aml_policy",
    ],
    preferredAssets: [
      "private_credit",
      "real_estate",
      "solar_energy",
      "forest",
      "music_royalties",
    ],
    minValueEur: 50_000,
    requiresCashflow: true,
  },
  {
    id: "ondo",
    name: "Ondo Finance",
    description:
      "High-quality underlying assets and qualified investor criteria.",
    url: "https://ondo.finance/",
    processTimeline: "Qualified investor onboarding",
    keyRequirements: "Qualified investors · Institutional-grade assets",
    requiredDocuments: [
      "prospectus",
      "legal_opinion",
      "kyc_aml_policy",
      "valuation_report",
      "risk_disclosure",
    ],
    preferredAssets: ["precious_metals", "private_credit", "real_estate"],
    minValueEur: 500_000,
    requiresAccredited: true,
  },
  {
    id: "polymesh",
    name: "Polymesh",
    description:
      "Regulated-asset blockchain; verified accounts and legal prep recommended.",
    url: "https://polymesh.network/",
    processTimeline: "Token + secondary market setup",
    keyRequirements: "Regulated asset · Verified account · Legal counsel",
    requiredDocuments: [
      "legal_opinion",
      "spv_documents",
      "smart_contract_audit",
      "kyc_aml_policy",
      "prospectus",
    ],
    preferredAssets: [
      "private_credit",
      "real_estate",
      "precious_metals",
      "fine_art",
    ],
    requiresEu: true,
    minValueEur: 100_000,
  },
  {
    id: "defillama",
    name: "DeFiLlama RWA",
    description:
      "Public proof linking on-chain token to off-chain asset and responsible entity.",
    url: "https://defillama.com/",
    processTimeline: "Public inclusion review",
    keyRequirements: "Off-chain proof · Public docs · Identifiable issuer",
    requiredDocuments: [
      "proof_of_ownership",
      "whitepaper",
      "legal_opinion",
      "valuation_report",
    ],
    preferredAssets: [
      "real_estate",
      "precious_metals",
      "private_credit",
      "fine_art",
      "other",
    ],
    minValueEur: 20_000,
    requiresOnChainTruth: true,
  },
];

export const RWA_PLATFORM_BY_ID = Object.fromEntries(
  RWA_PLATFORMS.map((p) => [p.id, p])
) as Record<RwaPlatformId, RwaPlatformDef>;
