export const SCORE_DIMENSION_WEIGHTS = {
  legal_structure: 0.25,
  kyc_aml: 0.2,
  mica_compliance: 0.3,
  data_room: 0.15,
  investor_protection: 0.1,
} as const;

export type ScoreDimension = keyof typeof SCORE_DIMENSION_WEIGHTS;

export const MICA_CLASSIFICATIONS = [
  "utility_token",
  "asset_referenced_token",
  "e_money_token",
  "other_crypto_asset",
  "financial_instrument",
  "out_of_scope",
  "uncertain",
] as const;

export type MicaClassification = (typeof MICA_CLASSIFICATIONS)[number];

export const DIMENSION_RECOMMENDATIONS: Record<ScoreDimension, string[]> = {
  legal_structure: [
    "Incorporate an EU SPV or regulated fund vehicle before retail distribution.",
    "Document ownership chain and beneficial owners for the issuing entity.",
    "Align governance with CSSF/FINMA expectations if targeting institutional LPs.",
  ],
  kyc_aml: [
    "Implement tiered KYC aligned with investor type (retail vs professional).",
    "Appoint AML officer and document CDD procedures before onboarding.",
    "Screen sanctions lists and source-of-funds for each investor ticket.",
  ],
  mica_compliance: [
    "Draft or finalize MiCA whitepaper / prospectus per asset classification.",
    "Map EU nexus (issuer, asset, investors) and CASP obligations.",
    "Engage EU counsel for ART/EMT vs financial instrument boundary.",
  ],
  data_room: [
    "Prepare title deeds, valuations, and legal opinions in a structured data room.",
    "Index custody, oracle, and smart-contract audit artifacts.",
    "Version-control investor disclosures and regulatory filings.",
  ],
  investor_protection: [
    "Define minimum ticket, lock-up, and redemption policy in plain language.",
    "Separate marketing claims from verified performance data.",
    "Add dispute resolution and complaint handling for retail channels.",
  ],
};
