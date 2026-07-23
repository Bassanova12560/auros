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
    rwaSubmissionForm: "https://forms.defillama.com/rwa-submission",
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
  rwaXyz: {
    partnersPortal: "https://partners.rwa.xyz/",
    partnersLogin: "https://partners.rwa.xyz/login",
    onboardingDocs: "https://docs.rwa.xyz/onboarding/platforms",
    directory: "https://app.rwa.xyz/directory",
    contactEmail: "team@rwa.xyz",
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
    "Green Fintech",
    "Climate Tech",
    "CSRD",
    "EU Taxonomy",
    "Energy RWA",
  ],
  defillamaCategory: "Services",
  coingeckoRequestType: "Others — RWA analytics / comparator platform (no native token)",
  languages: ["fr", "en", "es", "ar", "zh"],
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

/** RWA.xyz Partners portal — Protocol (platform) listing; no on-chain assets issued by AUROS. */
export const RWA_XYZ_FORM_FIELDS = {
  listingType: "Protocol",
  /** Directory V2 category closest to AUROS (analytics + issuer tooling, not custody). */
  directoryCategory: "Infrastructure & Service Providers",
  companyName: "AUROS",
  displayName: "AUROS",
  website: LISTING_SITE_URL,
  compareHubUrl: listingUrl(COMPARATOR_ROUTES.compare),
  developersUrl: listingUrl("/developers"),
  apiDocsUrl: listingUrl("/developers/docs"),
  openapiUrl: listingUrl("/auros-openapi.yaml"),
  aiCatalogUrl: listingUrl("/ai-first/index.json"),
  logoUrl: listingUrl("/auros-logo.svg"),
  contactName: "Adrien Balitrand",
  /** Partners portal rejects personal domains — use @getauros.com for login. */
  contactEmail: "adrien@getauros.com",
  contactEmailFallback: AUROS_LISTING.contactEmail,
  headquarters: "France / EU",
  foundedYear: "2024",
  languages: ["en", "fr", "es"],
  networksReferenced: "Multi-chain (aggregates Ethereum, Polygon, Arbitrum, Base, and others via indexed RWA protocols)",
  assetClassesCovered: [
    "Stablecoins & cash equivalents",
    "U.S. & non-U.S. government debt / tokenized bonds",
    "Private credit",
    "Real estate",
    "Commodities",
  ],
  shortDescription: AUROS_SHORT_EN,
  longDescription: `${AUROS_DESCRIPTIONS.longEn} Public API at ${listingUrl("/developers")}: MiCA readiness scoring (0–100), jurisdiction ranking across 8 regulatory hubs, compliance checklists, and a paginated RWA product catalog. Python SDK on PyPI (auros-protocol). AUROS does not custody funds, issue tokens, or report on-chain TVL — we are an independent comparator and B2B issuer onboarding platform.`,
  differentiators: [
    "Open RWA yield comparator at /compare — 120+ products, hourly DeFiLlama APY/TVL + curated catalog",
    "AUROS Green — RTMS, CQS, CSRD-oriented checks, impact report (/green)",
    "MiCA intelligence API — static rules, <200ms, no LLM (indicative only)",
    "Python SDK on PyPI: https://pypi.org/project/auros-protocol/",
    "Jurisdiction-first tokenization wizard for issuers (8 hubs compared)",
    "Machine-readable catalog for AI/agents: /ai-first/index.json",
  ],
  dataSources: AUROS_LISTING.dataSources,
  submissionNotes:
    "AUROS is not an asset issuer. We request a Directory listing as a Protocol/platform (B2B tokenization + analytics) or Infrastructure & Service Provider. No smart contracts or TVL to index — please link our compare hub and developer API. Happy to provide domain verification.",
} as const;

export const RWA_XYZ_EMAIL_OUTREACH = {
  to: LISTING_SUBMISSION_URLS.rwaXyz.contactEmail,
  subject: "Directory listing request — AUROS (RWA comparator & B2B tokenization platform)",
  body: `Hello RWA.xyz team,

We would like AUROS listed in the RWA.xyz Directory as a tokenization platform / infrastructure provider (not an asset issuer).

About AUROS
- Website: ${LISTING_SITE_URL}
- RWA yield comparator: ${listingUrl(COMPARATOR_ROUTES.compare)} (120+ tokenized products — bonds, stablecoins, real estate, private credit, commodities)
- Developer API: ${listingUrl("/developers")} — MiCA readiness scoring, jurisdiction ranking, compliance checklists, product catalog
- Logo: ${listingUrl("/auros-logo.svg")}

AUROS helps issuers structure RWA tokenization with a jurisdiction-first workflow (8 hubs compared) and operates an independent open comparator aggregating DeFiLlama yields hourly plus a curated catalog. We do not custody user funds, issue tokens, or have on-chain TVL.

Suggested listing type: Protocol (platform) or Infrastructure & Service Provider.

Contact: Adrien Balitrand — please reply to this thread; our Partners portal login requires a company email (@getauros.com) which we are finalizing.

Thank you,
Adrien Balitrand
AUROS — ${LISTING_SITE_URL}`,
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
    step: 3.5,
    action: "DeFiLlama RWA submission form",
    url: LISTING_SUBMISSION_URLS.defillama.rwaSubmissionForm,
    detail:
      "If form fits platform/reference (not issuer token): use AUROS_LISTING fields. Prefer support ticket if category mismatch.",
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
  {
    step: 7,
    action: "RWA.xyz Partners portal",
    url: LISTING_SUBMISSION_URLS.rwaXyz.partnersLogin,
    detail:
      "Sign in with @getauros.com (personal domains blocked). Add New Company → Listing Type: Protocol. Paste rwaXyz.formFields from submission-payload.json.",
  },
  {
    step: 8,
    action: "RWA.xyz email fallback",
    url: `mailto:${LISTING_SUBMISSION_URLS.rwaXyz.contactEmail}`,
    detail:
      "If no company email yet, send rwaXyz.emailOutreach (subject + body) to team@rwa.xyz from getauros.com address.",
  },
  {
    step: 9,
    action: "Green directories (ClimateTechList, KnowESG, Readi)",
    url: "https://getauros.com/presence",
    detail:
      "Open /presence board + data/listings/generated/green-markets.json outreach packs. Green-first — CSRD wave.",
  },
] as const;
