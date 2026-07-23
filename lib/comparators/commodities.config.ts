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
  "cache-gold": {
    name: "Cache Gold",
    link: "https://cache.gold",
    category: "precious_metals",
  },
  "paxos-gold": {
    name: "Paxos",
    link: "https://paxos.com/paxgold",
    category: "precious_metals",
    logo: "/logos/paxos.png",
  },
  "tether-gold": {
    name: "Tether",
    link: "https://gold.tether.to",
    category: "precious_metals",
    logo: "/logos/tether.png",
  },
  "matrixdock-xaum": {
    name: "Matrixdock",
    link: "https://matrixdock.com",
    category: "precious_metals",
    logo: "/logos/matrixdock.png",
  },
};

export const DEFILLAMA_COMMODITY_SLUGS = Object.keys(COMMODITY_PROJECTS);
