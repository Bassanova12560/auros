import type { StablecoinCategory } from "./types";

export type StablecoinProjectMeta = {
  name: string;
  link: string;
  category: StablecoinCategory;
  affiliate_link?: string;
  logo?: string;
};

export const STABLECOIN_PROJECTS: Record<string, StablecoinProjectMeta> = {
  "ondo-yield-assets": {
    name: "Ondo Finance",
    link: "https://ondo.finance",
    category: "treasury",
    logo: "/logos/ondo.png",
  },
  maple: {
    name: "Maple Finance",
    link: "https://maple.finance",
    category: "credit",
    logo: "/logos/maple.png",
  },
  "centrifuge-protocol": {
    name: "Centrifuge",
    link: "https://centrifuge.io",
    category: "mixed",
    logo: "/logos/centrifuge.png",
  },
  "superstate-ustb": {
    name: "Superstate",
    link: "https://superstate.co",
    category: "treasury",
    logo: "/logos/superstate.png",
  },
  "superstate-uscc": {
    name: "Superstate",
    link: "https://superstate.co",
    category: "treasury",
    logo: "/logos/superstate.png",
  },
  "openeden-tbill": {
    name: "OpenEden",
    link: "https://openeden.com",
    category: "treasury",
    logo: "/logos/openeden.png",
  },
  "openeden-usdo": {
    name: "OpenEden",
    link: "https://openeden.com",
    category: "treasury",
    logo: "/logos/openeden.png",
  },
  goldfinch: {
    name: "Goldfinch",
    link: "https://goldfinch.finance",
    category: "credit",
    logo: "/logos/goldfinch.png",
  },
  "backed-finance": {
    name: "Backed Finance",
    link: "https://backed.fi",
    category: "treasury",
    logo: "/logos/backed.png",
  },
  "blackrock-buidl": {
    name: "BlackRock BUIDL",
    link: "https://www.securitize.io",
    category: "treasury",
  },
  "circle-usyc": {
    name: "Circle USYC",
    link: "https://usyc.hashnote.com",
    category: "treasury",
  },
};

export const DEFILLAMA_PROJECT_SLUGS = Object.keys(STABLECOIN_PROJECTS);
