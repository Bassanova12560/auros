import { COMPARATOR_ROUTES } from "@/lib/comparators/constants";
import { AUROS_ORG } from "@/lib/ai-first/org";

const LISTING_SITE_URL = "https://getauros.com";
function listingUrl(path: string) {
  return `${LISTING_SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}


/** Submission URLs — manual steps require authenticated accounts. */
export const LISTING_SUBMISSION_URLS = {
  defillama: {
    supportTicket: "https://defillama.com/support",
    adaptersRepo: "https://github.com/DefiLlama/DefiLlama-Adapters",
    listingMetadataRepo:
      "https://github.com/DefiLlama/defillama-server/blob/master/defi/src/protocols/data2.ts",
    submitProjectDocs: "https://docs.llama.fi/list-your-project/submit-a-project",
    rwaDashboard: "https://defillama.com/rwa",
    rwaPlatforms: "https://defillama.com/rwa/platforms",
    discord: "https://discord.defillama.com/",
    yieldsApiUsed: "https://yields.llama.fi/pools",
  },
  coingecko: {
    partnerPortal: "https://partner.coingecko.com/",
    newRequest: "https://partner.coingecko.com/request-form/new",
    supportOthers: "https://support.coingecko.com/hc/en-us/requests/new",
    requestFormsDirectory:
      "https://support.coingecko.com/hc/en-us/articles/23960919544345-Support-Directory-CoinGecko-Request-Forms",
    listingTerms: "https://www.coingecko.com/en/listing_terms",
  },
} as const;

export const AUROS_LISTING = {
  slug: "auros",
  name: "AUROS",
  legalName: AUROS_ORG.legalName,
  tagline: "RWA tokenization platform & yield comparator",
  /** Primary listing angle: aggregator/comparator, not a DeFi protocol with TVL. */
  listingType: "rwa_comparator_aggregator" as const,
  website: LISTING_SITE_URL,
  compareHubUrl: listingUrl(COMPARATOR_ROUTES.compare),
  sitemapUrl: listingUrl("/sitemap.xml"),
  llmsUrl: listingUrl("/llms.txt"),
  aiCatalogUrl: listingUrl("/ai-first/index.json"),
  /** Public logo — SVG live; convert to 512×512 PNG for DeFiLlama icons bucket if requested. */
  logoUrl: listingUrl("/auros-logo.svg"),
  logoPngUrl: listingUrl("/auros-logo.png"),
  logoFallbackUrl: listingUrl("/favicon.ico"),
  contactEmail: AUROS_ORG.contactEmail,
  founder: "Adrien Balitrand",
  /** Fill before submission for stronger profile; empty blocks some form fields. */
  social: {
    twitter: "",
    linkedin: "",
    github: "",
    discord: "",
  },
  categories: [
    "RWA",
    "Real World Assets",
    "Tokenization",
    "Yield Aggregator",
    "Comparator",
    "B2B",
    "MiCA",
  ],
  defillamaCategory: "Services",
  coingeckoRequestType: "Others — RWA analytics / comparator platform (no native token)",
  languages: ["fr", "en", "es"],
  jurisdictionsCompared: 8,
  productCountClaim: "120+",
  dataSources: ["DeFiLlama Yields API", "AUROS manual catalog JSON"],
  updateCadence: "Hourly (compare hub revalidate 3600s)",
} as const;

const AUROS_SHORT_EN =
  "B2B RWA tokenization platform and open comparator aggregating 120+ tokenized products — bonds, stablecoins, real estate, private credit and commodities — with live APY/TVL from DeFiLlama plus curated issuer data.";

export const AUROS_DESCRIPTIONS = {
  shortEn: AUROS_SHORT_EN,
  shortFr:
    "Plateforme B2B de tokenisation RWA et comparateur ouvert agrégant 120+ produits tokenisés — obligations, stablecoins, immobilier, crédit privé et matières premières — avec APY/TVL live via DeFiLlama et catalogue émetteurs.",
  longEn: `AUROS helps issuers structure real-world asset tokenization with a jurisdiction-first workflow (8 hubs compared) and a free asset admission wizard. The /compare hub is an independent RWA yield comparator covering stablecoins & treasury, tokenized bonds, real estate, private credit and commodities — aggregating DeFiLlama yields hourly and manual catalog entries for products not yet indexed. Educational content only; not investment advice.`,
  defillamaSupportTicketSubject:
    "List AUROS as RWA comparator / data partner (aggregator reference)",
  defillamaSupportTicketBody: `Hello DeFiLlama team,

We operate AUROS (${LISTING_SITE_URL}), a B2B real-world asset tokenization platform with a public RWA yield comparator at ${listingUrl(COMPARATOR_ROUTES.compare)}.

We already consume the DeFiLlama Yields API (yields.llama.fi/pools) hourly to surface live APY/TVL for 40+ indexed RWA protocols across stablecoins, bonds, private credit and commodities, combined with our curated catalog (~48 manual entries, 120+ products deduplicated on the hub).

We would like to be listed as an RWA comparator / Services reference (similar to analytics/index tools), with a backlink to our compare hub. AUROS does not custody user funds and has no on-chain TVL to report — we are an aggregator and issuer onboarding tool, not a DeFi protocol.

Suggested listing:
- Name: AUROS
- URL: ${LISTING_SITE_URL}
- Compare hub: ${listingUrl(COMPARATOR_ROUTES.compare)}
- Category: Services (RWA comparator)
- Description: ${AUROS_SHORT_EN}
- Logo: ${listingUrl("/auros-logo.svg")}
- GitHub: (open-source repo if applicable)
- Contact: ${AUROS_ORG.contactEmail}

Happy to provide additional proof of domain ownership or adjust copy. Thank you for powering our live yield data.`,
} as const;

export const COINGECKO_FORM_FIELDS = {
  requestCategory: "Others",
  projectName: "AUROS",
  website: LISTING_SITE_URL,
  comparePage: listingUrl(COMPARATOR_ROUTES.compare),
  description: AUROS_DESCRIPTIONS.shortEn,
  logoUrl: listingUrl("/auros-logo.svg"),
  contactEmail: AUROS_ORG.contactEmail,
  contactName: "Adrien Balitrand",
  /** No ERC-20/native token — leave contract fields empty. */
  tokenContract: "",
  tokenSymbol: "",
  requestedTags: ["RWA", "Real World Assets", "Tokenization", "Yield", "Comparator"],
  additionalInfo: `AUROS is not a tradable token. We request a project/platform reference listing or ecosystem tag pointing to our RWA comparator (${listingUrl(COMPARATOR_ROUTES.compare)}) and B2B tokenization tools. We aggregate public yield data including CoinGecko-listed RWA protocols. Machine-readable catalog: ${listingUrl("/ai-first/index.json")}.`,
} as const;

/** Draft entry for defillama-server data2.ts — metadata-only; requires DeFiLlama team approval (no TVL adapter). */
export const DEFILLAMA_DATA2_DRAFT = {
  note: "AUROS has no on-chain TVL. Prefer support ticket before adapter PR. If team accepts Services listing without module, append object below to data2.ts.",
  entry: {
    name: "AUROS",
    address: null,
    symbol: "-",
    url: LISTING_SITE_URL,
    description: AUROS_DESCRIPTIONS.shortEn,
    chain: "Multi-Chain",
    logo: "auros.png",
    audits: "0",
    gecko_id: null,
    cmcId: null,
    category: "Services",
    chains: ["Ethereum"],
    twitter: "",
    github: [],
    referralUrl: listingUrl(COMPARATOR_ROUTES.compare),
  },
  prChecklist: [
    "Upload 512×512 logo to DefiLlama icons bucket (icons.llamao.fi) as auros.png",
    "Open PR against DefiLlama/defillama-server defi/src/protocols/data2.ts",
    "Enable Allow edits by maintainers",
    "Explain in PR body: comparator/aggregator, no TVL — reference listing only",
    "If rejected, use defillama.com/support ticket with DEFILLAMA_SUPPORT_TICKET body",
  ],
} as const;

export const DEFILLAMA_PR_FORM = {
  name: "AUROS",
  twitterLink: "(add @handle when available)",
  auditLinks: "N/A — analytics/comparator, no smart contracts",
  websiteLink: LISTING_SITE_URL,
  logo: listingUrl("/auros-logo.svg"),
  currentTvl: "$0 — comparator platform; aggregates third-party RWA yields, no custody",
  treasuryAddresses: "N/A",
  chain: "Multi-Chain (reference only)",
  coingeckoId: "",
  coinmarketcapId: "",
  shortDescription: AUROS_DESCRIPTIONS.shortEn,
  tokenAddressAndTicker: "None",
  category: "Services",
  oracleProvider: "DeFiLlama Yields API (third-party)",
  implementationDetails:
    "Hourly fetch of yields.llama.fi/pools; filtered RWA project slugs in lib/comparators/*.config.ts",
  documentationProof: listingUrl(COMPARATOR_ROUTES.compare),
  forkedFrom: "None",
  methodology:
    "Not applicable — AUROS does not report its own TVL. Compare hub surfaces aggregated third-party pool APY/TVL.",
  githubOrg: "(repo URL if public)",
  referralProgram: "No",
} as const;

export const MANUAL_SUBMISSION_CHECKLIST = [
  {
    step: 1,
    action: "Add public logo",
    detail: "SVG at public/auros-logo.svg (live). Export 512×512 PNG to public/auros-logo.png for DeFiLlama icons bucket.",
  },
  {
    step: 2,
    action: "Fill social handles",
    detail: "Update data/listings/auros-listing.ts social.twitter / linkedin / github, then re-run npm run listings:generate.",
  },
  {
    step: 3,
    action: "DeFiLlama support ticket",
    url: LISTING_SUBMISSION_URLS.defillama.supportTicket,
    detail: "Paste subject + body from generated submission-payload.json → defillama.supportTicket",
  },
  {
    step: 4,
    action: "DeFiLlama metadata PR (optional)",
    url: LISTING_SUBMISSION_URLS.defillama.listingMetadataRepo,
    detail: "If support directs you to PR, use defillama-data2-entry.json draft.",
  },
  {
    step: 5,
    action: "CoinGecko partner request",
    url: LISTING_SUBMISSION_URLS.coingecko.newRequest,
    detail: "Log in → Request & Listing → Others; paste coingecko.formFields from payload.",
  },
  {
    step: 6,
    action: "CoinGecko fallback ticket",
    url: LISTING_SUBMISSION_URLS.coingecko.supportOthers,
    detail: "If partner form lacks comparator category, use support ticket with same copy.",
  },
] as const;
