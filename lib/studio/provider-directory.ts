export type ProviderCategory =
  | "legal"
  | "valuation"
  | "audit"
  | "kyc"
  | "custody"
  | "insurance";

export type VerifiedProvider = {
  id: string;
  name: string;
  category: ProviderCategory;
  role: string;
  regions: string[];
  url?: string;
  integrationStatus: "partner" | "recommended" | "coming_soon";
};

/** Curated directory — extend via partners program. */
export const VERIFIED_PROVIDERS: VerifiedProvider[] = [
  {
    id: "stobox-legal",
    name: "Stobox",
    category: "legal",
    role: "Pre-qualification audit & tokenization suite",
    regions: ["EU", "US"],
    url: "https://stobox.io/",
    integrationStatus: "partner",
  },
  {
    id: "ix_swap",
    name: "IX Swap",
    category: "legal",
    role: "Principal issuer onboarding & SC deployment",
    regions: ["Global"],
    url: "https://www.ixswap.io/",
    integrationStatus: "recommended",
  },
  {
    id: "sumsub",
    name: "Sumsub",
    category: "kyc",
    role: "KYC/AML + sanctions screening",
    regions: ["Global"],
    url: "https://sumsub.com/",
    integrationStatus: "coming_soon",
  },
  {
    id: "onfido",
    name: "Onfido",
    category: "kyc",
    role: "Identity verification",
    regions: ["Global"],
    url: "https://onfido.com/",
    integrationStatus: "coming_soon",
  },
  {
    id: "chainalysis",
    name: "Chainalysis",
    category: "kyc",
    role: "Wallet screening & AML analytics",
    regions: ["Global"],
    url: "https://www.chainalysis.com/",
    integrationStatus: "coming_soon",
  },
  {
    id: "fireblocks",
    name: "Fireblocks",
    category: "custody",
    role: "Institutional custody & policy engine",
    regions: ["Global"],
    url: "https://www.fireblocks.com/",
    integrationStatus: "recommended",
  },
  {
    id: "taurus",
    name: "Taurus",
    category: "custody",
    role: "Digital asset custody (CH/EU)",
    regions: ["EU", "CH"],
    url: "https://www.taurushq.com/",
    integrationStatus: "recommended",
  },
  {
    id: "centrifuge",
    name: "Centrifuge",
    category: "audit",
    role: "RWA Launchpad & pool configuration",
    regions: ["Global"],
    url: "https://centrifuge.io/",
    integrationStatus: "partner",
  },
  {
    id: "trail_of_bits",
    name: "Trail of Bits / OpenZeppelin",
    category: "audit",
    role: "Smart contract audit (final)",
    regions: ["Global"],
    integrationStatus: "recommended",
  },
  {
    id: "local_counsel",
    name: "Cabinet local (réseau AUROS)",
    category: "legal",
    role: "Legal opinion & prospectus",
    regions: ["EU", "UK", "US"],
    integrationStatus: "partner",
  },
];

export function providersByCategory(
  category: ProviderCategory
): VerifiedProvider[] {
  return VERIFIED_PROVIDERS.filter((p) => p.category === category);
}
