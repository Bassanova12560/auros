import type { GreenLabelStatus, GreenProjectType } from "./constants";

export type GreenCompareRow = {
  id: string;
  name: string;
  type: GreenProjectType;
  typeLabelKey: GreenProjectType;
  token: string;
  yieldNote: string;
  impactNote: string;
  labelStatus: GreenLabelStatus;
  sourceUrl: string;
  sourceLabel: string;
  lastReviewed: string;
};

/** Market references — not AUROS Green Verified unless status is certified. */
export const GREEN_COMPARE_ROWS: GreenCompareRow[] = [
  {
    id: "toucan",
    name: "Toucan Protocol",
    type: "carbon",
    typeLabelKey: "carbon",
    token: "BCT / NCT / TCO2",
    yieldNote: "Variable — marché secondaire (Polygon)",
    impactNote: "~1 tCO₂ par crédit retiré (BCT base, NCT nature-based)",
    labelStatus: "reference",
    sourceUrl: "https://toucan.earth/",
    sourceLabel: "toucan.earth",
    lastReviewed: "2026-06-11",
  },
  {
    id: "powerledger",
    name: "Powerledger",
    type: "rec",
    typeLabelKey: "rec",
    token: "POWR / traceability RECs",
    yieldNote: "Platform-dependent — not investment advice",
    impactNote: "Renewable energy traceability (MWh matched)",
    labelStatus: "in_review",
    sourceUrl: "https://powerledger.io/",
    sourceLabel: "powerledger.io",
    lastReviewed: "2026-05-29",
  },
  {
    id: "wepower",
    name: "WePower (legacy PPA model)",
    type: "ppa",
    typeLabelKey: "ppa",
    token: "WPR (historical)",
    yieldNote: "Historical PPA tokenization — verify current status",
    impactNote: "Solar PPA energy allocation",
    labelStatus: "reference",
    sourceUrl: "https://wepower.network/",
    sourceLabel: "wepower.network",
    lastReviewed: "2026-05-29",
  },
  {
    id: "klim",
    name: "KlimaDAO",
    type: "carbon",
    typeLabelKey: "carbon",
    token: "KLIMA",
    yieldNote: "Pas un produit de rendement — vérifier le protocole actuel",
    impactNote: "Mécanisme de retrait de crédits carbone on-chain (Polygon)",
    labelStatus: "reference",
    sourceUrl: "https://www.klimadao.finance/",
    sourceLabel: "klimadao.finance",
    lastReviewed: "2026-06-11",
  },
  {
    id: "moss",
    name: "Moss.Earth (MCO2)",
    type: "carbon",
    typeLabelKey: "carbon",
    token: "MCO2",
    yieldNote: "Exposition crédits carbone — pas d'APY fixe",
    impactNote: "Crédits conservation Amazon (vérifier millésime & registre)",
    labelStatus: "reference",
    sourceUrl: "https://moss.earth/",
    sourceLabel: "moss.earth",
    lastReviewed: "2026-06-11",
  },
  {
    id: "flowcarbon",
    name: "Flow Carbon (GNT)",
    type: "carbon",
    typeLabelKey: "carbon",
    token: "GNT",
    yieldNote: "Crédits carbone tokenisés — marché variable",
    impactNote: "Nature-based credits on Ethereum (verify registry)",
    labelStatus: "reference",
    sourceUrl: "https://flowcarbon.com/",
    sourceLabel: "flowcarbon.com",
    lastReviewed: "2026-06-11",
  },
  {
    id: "energy-web",
    name: "Energy Web (EW Zero)",
    type: "rec",
    typeLabelKey: "rec",
    token: "EWT ecosystem",
    yieldNote: "Infrastructure / tooling — not a fund",
    impactNote: "Renewable energy certificates & grid decarbonization tooling",
    labelStatus: "in_review",
    sourceUrl: "https://energyweb.org/",
    sourceLabel: "energyweb.org",
    lastReviewed: "2026-05-29",
  },
];

/** @deprecated Phase 2 — use getGreenRegistrySnapshot() */
export type GreenRegistryProject = {
  id: string;
  name: string;
  type: GreenProjectType;
  country: string;
  certifiedAt: string;
  verifyPath?: string;
};

/** @deprecated Phase 2 — use getGreenRegistrySnapshot() */
export const GREEN_REGISTRY_PROJECTS: GreenRegistryProject[] = [];

/** @deprecated Phase 2 — use getGreenRegistrySnapshot() */
export const GREEN_REGISTRY_EXPERTS: { id: string; name: string; certifiedAt: string }[] = [];
