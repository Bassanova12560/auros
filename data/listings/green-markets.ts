/**
 * Green / climate / sustainable-finance presence targets.
 * Status is honest: ready_to_submit ≠ listed. Never claim live badges until confirmed.
 */
import { AUROS_ORG } from "@/lib/ai-first/org";

const SITE = "https://getauros.com";

export type PresenceStatus =
  | "live_consumer"
  | "ready_to_submit"
  | "outreach_ready"
  | "watch";

export type GreenMarketTarget = {
  id: string;
  name: string;
  category: "rwa" | "green_fintech" | "climate_tech" | "esg_directory" | "data";
  why: string;
  status: PresenceStatus;
  url: string;
  submitUrl?: string;
  contactEmail?: string;
  notes: string;
  priority: 1 | 2 | 3;
};

export const GREEN_MARKET_TARGETS: GreenMarketTarget[] = [
  {
    id: "defillama-yields",
    name: "DeFiLlama Yields",
    category: "data",
    why: "Already powers /compare live APY — credibility as a real data consumer.",
    status: "live_consumer",
    url: "https://defillama.com/yields",
    notes: "Hourly pull of yields.llama.fi/pools. Not a TVL listing of AUROS.",
    priority: 1,
  },
  {
    id: "defillama-rwa-form",
    name: "DeFiLlama RWA token / platform",
    category: "rwa",
    why: "Primary RWA dashboard visibility for serious allocators.",
    status: "ready_to_submit",
    url: "https://defillama.com/rwa",
    submitUrl: "https://forms.defillama.com/rwa-submission",
    notes:
      "AUROS is a comparator/platform, not an issuer — use Services / support path + RWA form where applicable. See submission-payload.json.",
    priority: 1,
  },
  {
    id: "rwa-xyz",
    name: "RWA.xyz Directory",
    category: "rwa",
    why: "Default analytics map for tokenized assets — platforms + infrastructure.",
    status: "ready_to_submit",
    url: "https://app.rwa.xyz/directory",
    submitUrl: "https://partners.rwa.xyz/login",
    contactEmail: "team@rwa.xyz",
    notes: "Protocol / Infrastructure listing. Company email @getauros.com required for portal.",
    priority: 1,
  },
  {
    id: "readi",
    name: "Readi.fi",
    category: "rwa",
    why: "EU-facing RWA DB with sustainable + carbon asset filters — green angle.",
    status: "outreach_ready",
    url: "https://readi.fi/dashboard/",
    contactEmail: "hello@readi.fi",
    notes: "Request platform/issuer-tooling profile; highlight Green RTMS + comparator.",
    priority: 1,
  },
  {
    id: "climatetechlist",
    name: "ClimateTechList",
    category: "climate_tech",
    why: "High-intent climate talent + founders directory — green direction signal.",
    status: "ready_to_submit",
    url: "https://www.climatetechlist.com/",
    submitUrl: "https://www.climatetechlist.com/submit-form",
    notes: "Position as climate data / green RWA infrastructure (energy + water), not a token issuer.",
    priority: 1,
  },
  {
    id: "knowesg",
    name: "KnowESG Solutions Directory",
    category: "esg_directory",
    why: "CSRD / EU Taxonomy buyers search ESG software here — mandatory reporting wave.",
    status: "outreach_ready",
    url: "https://knowesg.com/solutions",
    notes: "Pitch Green CSRD check, impact report, RTMS, CQS — software category sustainable finance.",
    priority: 1,
  },
  {
    id: "coingecko",
    name: "CoinGecko (Others / platform)",
    category: "rwa",
    why: "Retail + research discovery; no native token — Others request only.",
    status: "ready_to_submit",
    url: "https://www.coingecko.com/",
    submitUrl: "https://partner.coingecko.com/request-form/new",
    notes: "Honest: no ERC-20. Platform/comparator reference only.",
    priority: 2,
  },
  {
    id: "green-fintech-network",
    name: "Green Fintech Network (CH)",
    category: "green_fintech",
    why: "Swiss SIF-backed map — prestige if eligible; CH-org requirement.",
    status: "watch",
    url: "https://greenfintechnetwork.org/",
    contactEmail: "info@greenfintechnetwork.org",
    notes: "Membership for Swiss-based orgs. Watch / partner via EU entity if they open EU track.",
    priority: 2,
  },
  {
    id: "solar-impulse",
    name: "Solar Impulse Efficient Solutions",
    category: "climate_tech",
    why: "Labelled solutions map — strong green seriousness if product qualifies.",
    status: "watch",
    url: "https://solarimpulse.com/",
    notes: "Long expert review. Only after a crisp Green product dossier (RTMS / Watts / CSRD tool).",
    priority: 3,
  },
  {
    id: "rapidapi",
    name: "RapidAPI Hub",
    category: "data",
    why: "Developer discovery for MiCA / Green / compare APIs.",
    status: "ready_to_submit",
    url: "https://rapidapi.com/hub",
    notes: "Use data/listings/rapidapi-listing.ts payload.",
    priority: 2,
  },
];

export const GREEN_DIRECTION_BLURB = {
  en: {
    title: "Green direction — soon mandatory, already our north star",
    body: "EU CSRD, EU Taxonomy, and energy/water disclosure are moving from voluntary to table stakes. AUROS Green (RTMS, CQS, CSRD check, impact report) + the open RWA comparator are how we show up: measurable climate-linked assets, not greenwashing theater.",
  },
  fr: {
    title: "Direction green — bientôt obligatoire, déjà notre nord",
    body: "CSRD, taxonomie UE et reporting énergie/eau passent du volontariat au standard. AUROS Green (RTMS, CQS, CSRD check, rapport d’impact) + le comparateur RWA ouvert : actifs climat mesurables, pas de théâtre greenwash.",
  },
} as const;

export function greenOutreachEmail(targetId: string): {
  to: string;
  subject: string;
  body: string;
} | null {
  const t = GREEN_MARKET_TARGETS.find((x) => x.id === targetId);
  if (!t?.contactEmail) return null;

  const subject = `AUROS listing / directory — green RWA & climate data (${t.name})`;
  const body = `Hello ${t.name} team,

AUROS (getauros.com) is an EU-facing B2B platform for real-world asset tokenization with a strong green stack:

- AUROS Green — RTMS, carbon quality (CQS), CSRD-oriented checks, impact report
- Open RWA comparator — ${SITE}/compare (120+ products, live DeFiLlama yields)
- Energy / water resource layer (lab + pilots, HITL settlement)

We are not an asset issuer and do not custody funds. We request a directory / platform listing as infrastructure & analytics for green / sustainable RWA.

Key links
- Site: ${SITE}
- Green hub: ${SITE}/green
- Comparator: ${SITE}/compare
- CSRD check: ${SITE}/green/csrd-check
- Developers: ${SITE}/developers
- Logo: ${SITE}/auros-logo.svg

Contact: ${AUROS_ORG.contactEmail}
Founder: Adrien Balitrand

Happy to provide any verification pack.

Thank you,
Adrien Balitrand
AUROS — ${SITE}`;

  return { to: t.contactEmail, subject, body };
}

export const GREEN_OUTREACH_PACK = [
  "readi",
  "knowesg",
  "green-fintech-network",
].map((id) => greenOutreachEmail(id)).filter(Boolean);
