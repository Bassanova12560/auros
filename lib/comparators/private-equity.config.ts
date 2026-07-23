import type { PrivateEquityCategory } from "./types";

export type PrivateEquityProjectMeta = {
  name: string;
  link: string;
  category: PrivateEquityCategory;
  affiliate_link?: string;
  logo?: string;
  symbols?: string[];
};

/**
 * Equity / PE / infrastructure — live DeFiLlama coverage is thin;
 * most rows come from the curated manual catalog (APY 0 when unknown).
 */
export const PRIVATE_EQUITY_PROJECTS: Record<string, PrivateEquityProjectMeta> = {
  "ondo-global-markets": {
    name: "Ondo Finance",
    link: "https://ondo.finance/global-markets",
    category: "public_equity",
    logo: "/logos/ondo.png",
  },
  "backed-finance": {
    name: "Backed Finance",
    link: "https://backed.fi",
    category: "public_equity",
    logo: "/logos/backed.png",
  },
  "swarm-markets": {
    name: "Swarm Markets",
    link: "https://swarm.com",
    category: "public_equity",
  },
  "mt-pelerin": {
    name: "Mt Pelerin",
    link: "https://www.mtpelerin.com",
    category: "public_equity",
  },
  "kkr-securitize": {
    name: "KKR",
    link: "https://www.securitize.io",
    category: "funds",
  },
  "blackstone-securitize": {
    name: "Blackstone",
    link: "https://www.securitize.io",
    category: "funds",
  },
  dinari: {
    name: "Dinari",
    link: "https://dinari.com",
    category: "public_equity",
  },
  "libre-capital": {
    name: "Libre Capital",
    link: "https://www.librecapital.com",
    category: "funds",
  },
};

export const DEFILLAMA_PRIVATE_EQUITY_SLUGS = Object.keys(PRIVATE_EQUITY_PROJECTS);
