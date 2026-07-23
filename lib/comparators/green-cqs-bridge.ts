/**
 * Soft join RWA hub products → Green carbon profiles / CSRD hints.
 * Fail soft: no invented CQS when no Green row/profile exists.
 */

import { GREEN_COMPARE_ROWS } from "@/lib/green/compare-data";
import {
  computeCarbonQualityFromProfile,
  type CarbonQualityScore,
} from "@/lib/green/scoring/carbon-quality";
import {
  GREEN_CARBON_PROFILES,
  type CarbonQualityProfile,
} from "@/lib/green/scoring/carbon-profiles";
import type { HubProduct } from "./compare-hub";

/**
 * RWA product id / platform / symbol hints → Green compare row id.
 * Expanded aliases only — never invent scores when profile missing.
 */
const RWA_TO_GREEN_ROW: Record<string, string> = {
  // Toucan
  "toucan-bct-nct": "toucan",
  toucan: "toucan",
  "toucan-protocol": "toucan",
  bct: "toucan",
  nct: "toucan",
  tco2: "toucan",
  // KlimaDAO
  "klima-klima": "klim",
  "klima-dao": "klim",
  klimadao: "klim",
  klim: "klim",
  klima: "klim",
  // Moss
  "moss-mco2": "moss",
  "moss-earth": "moss",
  moss: "moss",
  mco2: "moss",
  // Flow Carbon
  "flowcarbon-gnt": "flowcarbon",
  flowcarbon: "flowcarbon",
  "flow-carbon": "flowcarbon",
  gnt: "flowcarbon",
  // Regen
  "regen-network": "regen-network",
  regen: "regen-network",
  "regen-network::regen": "regen-network",
  // Solid World
  "solid-world": "solid-world",
  solidworld: "solid-world",
  "solid-world-dao": "solid-world",
  crbw: "solid-world",
  // Energy / REC references (CSRD path via green row; CQS only if profile exists)
  "energy-web": "energy-web",
  energyweb: "energy-web",
  ewt: "energy-web",
  powerledger: "powerledger",
  "power-ledger": "powerledger",
  powr: "powerledger",
  wepower: "wepower",
  sunexchange: "sunexchange",
  "sun-exchange": "sunexchange",
};

export type CompareCqsAttachment = {
  available: true;
  score: number;
  tier: CarbonQualityScore["tier"];
  registry: CarbonQualityScore["registry"];
  ccp_aligned: CarbonQualityScore["ccp_aligned"];
  priority_keys: CarbonQualityScore["priority_keys"];
  green_row_id: string;
  source: "green_carbon_profile";
  indicative: true;
  note: "Not audited — Green market reference profile only";
};

export type CompareCsrdAttachment = {
  path_suggested: boolean;
  green_row_id: string | null;
  taxonomy_score: number | null;
  label_status: string | null;
  source: "green_compare_row" | "heuristic";
  indicative: true;
};

function resolveGreenRowId(product: HubProduct): string | null {
  const id = product.row.id.toLowerCase();
  if (RWA_TO_GREEN_ROW[id]) return RWA_TO_GREEN_ROW[id];
  // Live DeFiLlama: project::symbol
  if (id.includes("::")) {
    const [project, symbol] = id.split("::");
    if (project && RWA_TO_GREEN_ROW[project]) return RWA_TO_GREEN_ROW[project];
    if (symbol && RWA_TO_GREEN_ROW[symbol.toLowerCase()]) {
      return RWA_TO_GREEN_ROW[symbol.toLowerCase()];
    }
  }
  const platform = product.row.platform.trim().toLowerCase();
  if (RWA_TO_GREEN_ROW[platform]) return RWA_TO_GREEN_ROW[platform];
  const project = product.row.project.trim().toLowerCase();
  if (RWA_TO_GREEN_ROW[project]) return RWA_TO_GREEN_ROW[project];
  const productName = product.row.product.trim().toLowerCase();
  if (RWA_TO_GREEN_ROW[productName]) return RWA_TO_GREEN_ROW[productName];
  for (const [hint, greenId] of Object.entries(RWA_TO_GREEN_ROW)) {
    if (id.includes(hint) || platform.includes(hint) || project.includes(hint)) {
      return greenId;
    }
  }
  return null;
}

function profileForGreenId(greenId: string): CarbonQualityProfile | null {
  return GREEN_CARBON_PROFILES[greenId] ?? null;
}

export function resolveCompareCqs(
  product: HubProduct
): CompareCqsAttachment | null {
  const greenId = resolveGreenRowId(product);
  if (!greenId) return null;
  const profile = profileForGreenId(greenId);
  if (!profile) return null;
  const scored = computeCarbonQualityFromProfile(profile);
  return {
    available: true,
    score: scored.score,
    tier: scored.tier,
    registry: scored.registry,
    ccp_aligned: scored.ccp_aligned,
    priority_keys: scored.priority_keys,
    green_row_id: greenId,
    source: "green_carbon_profile",
    indicative: true,
    note: "Not audited — Green market reference profile only",
  };
}

export function resolveCompareCsrd(
  product: HubProduct,
  greenRelevant: boolean,
  carbonHint: boolean
): CompareCsrdAttachment {
  const greenId = resolveGreenRowId(product);
  const row = greenId
    ? GREEN_COMPARE_ROWS.find((r) => r.id === greenId)
    : undefined;
  if (row) {
    return {
      path_suggested: true,
      green_row_id: row.id,
      taxonomy_score: row.green_taxonomy_score,
      label_status: row.labelStatus,
      source: "green_compare_row",
      indicative: true,
    };
  }
  return {
    path_suggested: greenRelevant || carbonHint,
    green_row_id: null,
    taxonomy_score: null,
    label_status: null,
    source: "heuristic",
    indicative: true,
  };
}
