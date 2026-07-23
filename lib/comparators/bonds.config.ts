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
  "openeden-hybond": {
    name: "OpenEden × BNY",
    link: "https://openeden.com",
    category: "corporate",
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
  "franklin-templeton": {
    name: "Franklin Templeton",
    link: "https://www.franklintempleton.com/products/benji",
    category: "sovereign",
  },
  hashnote: {
    name: "Hashnote",
    link: "https://usyc.hashnote.com",
    category: "sovereign",
  },
  "circle-usyc": {
    name: "Circle USYC",
    link: "https://usyc.hashnote.com",
    category: "sovereign",
  },
  "blackrock-buidl": {
    name: "BlackRock BUIDL",
    link: "https://www.securitize.io",
    category: "sovereign",
  },
  wisdomtree: {
    name: "WisdomTree",
    link: "https://www.wisdomtree.com/investments/digital-assets",
    category: "sovereign",
  },
  "matrixdock-sbtb": {
    name: "Matrixdock",
    link: "https://matrixdock.com",
    category: "sovereign",
    logo: "/logos/matrixdock.png",
  },
  "matrixdock-stbt": {
    name: "Matrixdock",
    link: "https://matrixdock.com",
    category: "sovereign",
    logo: "/logos/matrixdock.png",
  },
  "backed-finance": {
    name: "Backed Finance",
    link: "https://backed.fi",
    category: "sovereign",
    logo: "/logos/backed.png",
  },
  bitbond: {
    name: "Bitbond",
    link: "https://www.bitbond.com",
    category: "corporate",
  },
  toucan: {
    name: "Toucan Protocol",
    link: "/green/compare?rwa=toucan",
    category: "structured",
  },
  "klima-dao": {
    name: "KlimaDAO",
    link: "/green/compare?rwa=klim",
    category: "structured",
  },
  "moss-earth": {
    name: "Moss.Earth",
    link: "/green/compare?rwa=moss",
    category: "structured",
  },
  flowcarbon: {
    name: "Flow Carbon",
    link: "/green/compare?rwa=flowcarbon",
    category: "structured",
  },
};

export const DEFILLAMA_BOND_SLUGS = Object.keys(BOND_PROJECTS);
