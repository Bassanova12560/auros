import type { CommodityCategory } from "./types";

export type CommodityProjectMeta = {
  name: string;
  link: string;
  category: CommodityCategory;
  affiliate_link?: string;
  logo?: string;
  symbols?: string[];
};

export const COMMODITY_PROJECTS: Record<string, CommodityProjectMeta> = {
  "landx-finance": {
    name: "LandX Finance",
    link: "https://landx.fi",
    category: "agricultural",
    logo: "/logos/landx.png",
  },
  agrotoken: {
    name: "Agrotoken",
    link: "https://agrotoken.io",
    category: "agricultural",
  },
  "ondo-global-markets": {
    name: "Ondo Finance",
    link: "https://ondo.finance/global-markets",
    category: "precious_metals",
    logo: "/logos/ondo.png",
  },
  "cache-gold": {
    name: "Cache Gold",
    link: "https://cache.gold",
    category: "precious_metals",
  },
};

export const DEFILLAMA_COMMODITY_SLUGS = Object.keys(COMMODITY_PROJECTS);
