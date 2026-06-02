import type { BondCategory } from "./types";

export type BondProjectMeta = {
  name: string;
  link: string;
  category: BondCategory;
  affiliate_link?: string;
  logo?: string;
  /** Limite aux symboles obligataires (ex. OUSG, pas USDY). */
  symbols?: string[];
};

export const BOND_PROJECTS: Record<string, BondProjectMeta> = {
  "openeden-tbill": {
    name: "OpenEden",
    link: "https://openeden.com",
    category: "sovereign",
    logo: "/logos/openeden.png",
  },
  "theo-network-thbill": {
    name: "Theo Network",
    link: "https://theo.xyz",
    category: "sovereign",
    logo: "/logos/theo.png",
  },
  "vaneck-treasury-fund": {
    name: "VanEck",
    link: "https://vaneck.com",
    category: "sovereign",
    logo: "/logos/vaneck.png",
  },
  "ondo-yield-assets": {
    name: "Ondo Finance",
    link: "https://ondo.finance",
    category: "sovereign",
    logo: "/logos/ondo.png",
    symbols: ["OUSG"],
  },
  "superstate-ustb": {
    name: "Superstate",
    link: "https://superstate.co",
    category: "sovereign",
    logo: "/logos/superstate.png",
    symbols: ["USTB"],
  },
  "centrifuge-protocol": {
    name: "Centrifuge",
    link: "https://centrifuge.io",
    category: "structured",
    logo: "/logos/centrifuge.png",
    symbols: ["JTRSY"],
  },
};

export const DEFILLAMA_BOND_SLUGS = Object.keys(BOND_PROJECTS);
