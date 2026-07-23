import type { ArtCategory } from "./types";

export type ArtProjectMeta = {
  name: string;
  link: string;
  category: ArtCategory;
  affiliate_link?: string;
  logo?: string;
  symbols?: string[];
};

/**
 * Art / collectibles RWA — mostly off DeFiLlama yields.
 * Prefer manual catalog with APY 0 when no public coupon exists.
 */
export const ART_PROJECTS: Record<string, ArtProjectMeta> = {
  masterworks: {
    name: "Masterworks",
    link: "https://www.masterworks.com",
    category: "fine_art",
  },
  particle: {
    name: "Particle",
    link: "https://www.particlecollection.com",
    category: "collectibles",
  },
  artory: {
    name: "Artory",
    link: "https://www.artory.com",
    category: "fine_art",
  },
  "propy-nft": {
    name: "Propy",
    link: "https://propy.com",
    category: "collectibles",
  },
};

export const DEFILLAMA_ART_SLUGS = Object.keys(ART_PROJECTS);
