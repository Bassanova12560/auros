import type { GreenLabelStatus, GreenProjectType } from "./constants";

export type GreenCompareRow = {
  id: string;
  name: string;
  type: GreenProjectType;
  typeLabelKey: GreenProjectType;
  token: string;
  yieldNote: string;
  impactNote: string;
  /** Indicative EU Taxonomy alignment score (0–100), null if unknown. */
  green_taxonomy_score: number | null;
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
    green_taxonomy_score: 62,
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
    green_taxonomy_score: 71,
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
    green_taxonomy_score: 58,
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
    green_taxonomy_score: 55,
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
    green_taxonomy_score: 68,
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
    green_taxonomy_score: 64,
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
    green_taxonomy_score: 74,
    labelStatus: "in_review",
    sourceUrl: "https://energyweb.org/",
    sourceLabel: "energyweb.org",
    lastReviewed: "2026-05-29",
  },
  {
    id: "sunexchange",
    name: "SunExchange",
    type: "solar",
    typeLabelKey: "solar",
    token: "Solar cells (crowdfunded)",
    yieldNote: "Solar lease income — verify project status",
    impactNote: "Distributed solar PV in Africa & emerging markets",
    green_taxonomy_score: 76,
    labelStatus: "reference",
    sourceUrl: "https://sunexchange.com/",
    sourceLabel: "sunexchange.com",
    lastReviewed: "2026-06-13",
  },
  {
    id: "regen-network",
    name: "Regen Network",
    type: "carbon",
    typeLabelKey: "carbon",
    token: "REGEN / ecocredits",
    yieldNote: "Ecological credit marketplace — not fixed yield",
    impactNote: "Nature-based & soil carbon credits on Cosmos",
    green_taxonomy_score: 66,
    labelStatus: "reference",
    sourceUrl: "https://www.regen.network/",
    sourceLabel: "regen.network",
    lastReviewed: "2026-06-13",
  },
  {
    id: "solid-world",
    name: "Solid World DAO",
    type: "carbon",
    typeLabelKey: "carbon",
    token: "CRBW / liquidity pools",
    yieldNote: "Forward carbon liquidity — high risk",
    impactNote: "Pre-purchase & tokenized forward carbon credits",
    green_taxonomy_score: 59,
    labelStatus: "reference",
    sourceUrl: "https://www.solid.world/",
    sourceLabel: "solid.world",
    lastReviewed: "2026-06-13",
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
