import type { RealEstateCategory } from "./types";

export type RealEstateProjectMeta = {
  name: string;
  link: string;
  category: RealEstateCategory;
  affiliate_link?: string;
  logo?: string;
};

/** Slugs DeFiLlama — compléter quand les protocoles immo seront indexés yields. */
export const IMMOBILIER_PROJECTS: Record<string, RealEstateProjectMeta> = {
  "realt-tokens": {
    name: "RealT",
    link: "https://realt.co",
    category: "residential",
    logo: "/logos/realt.png",
  },
  lofty: {
    name: "Lofty",
    link: "https://lofty.ai",
    category: "residential",
    logo: "/logos/lofty.png",
  },
  yieldbricks: {
    name: "YieldBricks",
    link: "https://yieldbricks.com",
    category: "commercial",
    logo: "/logos/yieldbricks.png",
  },
  "estate-protocol": {
    name: "Estate Protocol",
    link: "https://estateprotocol.io",
    category: "residential",
    logo: "/logos/estate-protocol.png",
  },
  realtyx: {
    name: "RealtyX",
    link: "https://realtyx.io",
    category: "residential",
    logo: "/logos/realtyx.png",
  },
  landshare: {
    name: "Landshare",
    link: "https://landshare.io",
    category: "land",
    logo: "/logos/landshare.png",
  },
};

export const DEFILLAMA_IMMOBILIER_SLUGS = Object.keys(IMMOBILIER_PROJECTS);
