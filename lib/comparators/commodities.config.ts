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
};

export const DEFILLAMA_COMMODITY_SLUGS = Object.keys(COMMODITY_PROJECTS);
