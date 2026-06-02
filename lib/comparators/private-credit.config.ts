import type { PrivateCreditCategory } from "./types";

export type PrivateCreditProjectMeta = {
  name: string;
  link: string;
  category: PrivateCreditCategory;
  affiliate_link?: string;
  logo?: string;
  symbols?: string[];
};

export const PRIVATE_CREDIT_PROJECTS: Record<string, PrivateCreditProjectMeta> = {
  maple: {
    name: "Maple Finance",
    link: "https://maple.finance",
    category: "prime",
    logo: "/logos/maple.png",
  },
  goldfinch: {
    name: "Goldfinch",
    link: "https://goldfinch.finance",
    category: "emerging",
    logo: "/logos/goldfinch.png",
  },
  "centrifuge-protocol": {
    name: "Centrifuge",
    link: "https://centrifuge.io",
    category: "alternative",
    logo: "/logos/centrifuge.png",
    symbols: ["USDC"],
  },
  "nest-credit": {
    name: "Nest Credit",
    link: "https://nest.credit",
    category: "alternative",
    logo: "/logos/nest.png",
  },
};

export const DEFILLAMA_PRIVATE_CREDIT_SLUGS = Object.keys(
  PRIVATE_CREDIT_PROJECTS
);
