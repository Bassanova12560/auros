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
    token: "TCO2 / pool tokens",
    yieldNote: "Variable — secondary market",
    impactNote: "~1 tCO₂ per retired credit (project-dependent)",
    labelStatus: "reference",
    sourceUrl: "https://toucan.earth/",
    sourceLabel: "toucan.earth",
    lastReviewed: "2026-05-29",
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
    name: "Klima DAO (retired credits)",
    type: "carbon",
    typeLabelKey: "carbon",
    token: "KLIMA (legacy treasury)",
    yieldNote: "Not a yield product — verify current protocol",
    impactNote: "On-chain carbon credit retirement mechanism",
    labelStatus: "reference",
    sourceUrl: "https://www.klimadao.finance/",
    sourceLabel: "klimadao.finance",
    lastReviewed: "2026-05-29",
  },
  {
    id: "moss",
    name: "Moss.Earth (MCO2)",
    type: "carbon",
    typeLabelKey: "carbon",
    token: "MCO2",
    yieldNote: "Carbon credit exposure — not fixed APY",
    impactNote: "Amazon conservation credits (verify vintage & registry)",
    labelStatus: "reference",
    sourceUrl: "https://moss.earth/",
    sourceLabel: "moss.earth",
    lastReviewed: "2026-05-29",
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
