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

/** RWA product id / platform hints → Green compare row id. */
const RWA_TO_GREEN_ROW: Record<string, string> = {
  "toucan-bct-nct": "toucan",
  toucan: "toucan",
  "klima-klima": "klim",
  "klima-dao": "klim",
  klimadao: "klim",
  "moss-mco2": "moss",
  "moss-earth": "moss",
  moss: "moss",
  "flowcarbon-gnt": "flowcarbon",
  flowcarbon: "flowcarbon",
  "regen-network": "regen-network",
  "solid-world": "solid-world",
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
  const platform = product.row.platform.trim().toLowerCase();
  if (RWA_TO_GREEN_ROW[platform]) return RWA_TO_GREEN_ROW[platform];
  for (const [hint, greenId] of Object.entries(RWA_TO_GREEN_ROW)) {
    if (id.includes(hint) || platform.includes(hint)) return greenId;
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
