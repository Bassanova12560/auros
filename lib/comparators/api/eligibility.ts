/**
 * Indicative eligibility composite — never legal advice, never invent APY.
 * Combines compare fields × MiCA-oriented flags × jurisdiction hints × green/CQS hooks.
 */

import type { HubProduct } from "../compare-hub";
import { isGreenRelevantHubProduct } from "../compare-report";
import {
  resolveCompareCqs,
  resolveCompareCsrd,
  type CompareCqsAttachment,
  type CompareCsrdAttachment,
} from "../green-cqs-bridge";
import { toCompareApiProduct } from "./catalog";
import { buildCompareProof, type CompareProof } from "./signing";
import { SITE_URL } from "../site";

export type MicaOrientedFlags = {
  eu_nexus_hint: "likely" | "possible" | "unlikely" | "unknown";
  asset_class_hint:
    | "e_money_adjacent"
    | "financial_instrument_adjacent"
    | "utility_or_collectible"
    | "credit_or_fund"
    | "unknown";
  whitepaper_expected: boolean;
  retail_access_friction: "low" | "medium" | "high" | "unknown";
  disclaimer: "indicative_not_legal_advice";
};

export type JurisdictionHint = {
  raw: string | null;
  region: "EU" | "US" | "UK" | "CH" | "AE" | "OTHER" | "UNKNOWN";
  mica_overlay_relevant: boolean;
};

export type GreenEligibilityFlags = {
  green_relevant: boolean;
  carbon_token_hint: boolean;
  csrd_path_suggested: boolean;
  /** True only when a Green carbon profile was resolved. */
  cqs_data_available: boolean;
  cqs: CompareCqsAttachment | null;
  csrd: CompareCsrdAttachment;
  green_href: string;
  csrd_href: string;
};

export type EligibilityProduct = {
  product_id: string;
  entity_key: string;
  entity_id: string;
  issuer_key: string;
  parent_issuer: string | null;
  token_addresses: ReturnType<typeof toCompareApiProduct>["token_addresses"];
  as_of: string;
  compare: ReturnType<typeof toCompareApiProduct>;
  mica: MicaOrientedFlags;
  jurisdiction: JurisdictionHint;
  green: GreenEligibilityFlags;
  policy: {
    never_invent_apy: true;
    indicative_only: true;
    not_legal_advice: true;
  };
};

const EU_HINTS = [
  "eu",
  "eea",
  "france",
  "germany",
  "luxembourg",
  "ireland",
  "netherlands",
  "spain",
  "italy",
  "belgium",
  "austria",
  "portugal",
  "malta",
  "cyprus",
  "lithuania",
  "estonia",
  "latvia",
  "poland",
  "sweden",
  "finland",
  "denmark",
];

function regionFromJurisdiction(raw: string | null): JurisdictionHint["region"] {
  if (!raw) return "UNKNOWN";
  const j = raw.toLowerCase();
  if (EU_HINTS.some((h) => j.includes(h)) || j === "eu" || j.includes("europe")) {
    return "EU";
  }
  if (j.includes("us") || j.includes("united states") || j.includes("wyoming")) {
    return "US";
  }
  if (j.includes("uk") || j.includes("united kingdom") || j.includes("britain")) {
    return "UK";
  }
  if (j.includes("switzerland") || j.includes("swiss") || j === "ch") {
    return "CH";
  }
  if (j.includes("uae") || j.includes("dubai") || j.includes("abu dhabi")) {
    return "AE";
  }
  return "OTHER";
}

function micaFlags(product: HubProduct, region: JurisdictionHint["region"]): MicaOrientedFlags {
  const asset = product.comparatorId;
  let asset_class_hint: MicaOrientedFlags["asset_class_hint"] = "unknown";
  if (asset === "stablecoins") asset_class_hint = "e_money_adjacent";
  else if (asset === "obligations" || asset === "immobilier") {
    asset_class_hint = "financial_instrument_adjacent";
  } else if (asset === "private-credit" || asset === "private-equity") {
    asset_class_hint = "credit_or_fund";
  } else if (asset === "art-collectibles" || asset === "matieres-premieres") {
    asset_class_hint = "utility_or_collectible";
  }

  let eu_nexus_hint: MicaOrientedFlags["eu_nexus_hint"] = "unknown";
  if (region === "EU") eu_nexus_hint = "likely";
  else if (region === "CH" || region === "UK") eu_nexus_hint = "possible";
  else if (region === "US" || region === "AE") eu_nexus_hint = "unlikely";

  const retail_access_friction: MicaOrientedFlags["retail_access_friction"] =
    product.meta.accreditedOnly
      ? "high"
      : product.meta.minInvestmentUsd >= 10_000
        ? "medium"
        : product.meta.minInvestmentUsd >= 500
          ? "low"
          : "low";

  return {
    eu_nexus_hint,
    asset_class_hint,
    whitepaper_expected:
      asset_class_hint === "e_money_adjacent" ||
      asset_class_hint === "financial_instrument_adjacent",
    retail_access_friction,
    disclaimer: "indicative_not_legal_advice",
  };
}

function greenFlags(product: HubProduct): GreenEligibilityFlags {
  const green_relevant = isGreenRelevantHubProduct(product);
  const hay = `${product.row.id} ${product.row.product}`.toLowerCase();
  const carbon_token_hint = /toucan|klima|moss|flowcarbon|bct|nct|mco2|carbon|regen|solid.?world|crbw|energy.?web|powerledger|powr/.test(
    hay
  );
  const cqs = resolveCompareCqs(product);
  const csrd = resolveCompareCsrd(product, green_relevant, carbon_token_hint);
  return {
    green_relevant,
    carbon_token_hint,
    csrd_path_suggested: csrd.path_suggested,
    cqs_data_available: Boolean(cqs),
    cqs,
    csrd,
    green_href: `${SITE_URL}/green`,
    csrd_href: `${SITE_URL}/green/csrd-check`,
  };
}

export function buildEligibilityForProduct(
  product: HubProduct,
  asOf: string
): EligibilityProduct {
  const raw = product.meta.jurisdiction ?? null;
  const region = regionFromJurisdiction(raw);
  const compare = toCompareApiProduct(product, asOf);
  return {
    product_id: product.row.id,
    entity_key: compare.entity_key,
    entity_id: compare.entity_id,
    issuer_key: compare.issuer_key,
    parent_issuer: compare.parent_issuer,
    token_addresses: compare.token_addresses,
    as_of: asOf,
    compare,
    mica: micaFlags(product, region),
    jurisdiction: {
      raw,
      region,
      mica_overlay_relevant: region === "EU" || region === "CH" || region === "UK",
    },
    green: greenFlags(product),
    policy: {
      never_invent_apy: true,
      indicative_only: true,
      not_legal_advice: true,
    },
  };
}

export type EligibilityResponse = {
  schema: "auros.compare.eligibility.v1";
  as_of: string;
  products: EligibilityProduct[];
  missing_ids: string[];
  meta: {
    indicative: true;
    not_legal_advice: true;
    never_invent_apy: true;
    mica_checker: string;
    premium_compare: string;
  };
  proof: CompareProof;
};

export function buildEligibilityResponse(
  hubProducts: HubProduct[],
  requestedIds: string[],
  asOf: string
): EligibilityResponse {
  const byId = new Map(hubProducts.map((p) => [p.row.id, p]));
  const products: EligibilityProduct[] = [];
  const missing_ids: string[] = [];
  for (const id of requestedIds) {
    const hit = byId.get(id);
    if (!hit) {
      missing_ids.push(id);
      continue;
    }
    products.push(buildEligibilityForProduct(hit, asOf));
  }
  const core = {
    schema: "auros.compare.eligibility.v1" as const,
    as_of: asOf,
    products,
    missing_ids,
  };
  return {
    ...core,
    meta: {
      indicative: true,
      not_legal_advice: true,
      never_invent_apy: true,
      mica_checker: "/tools/mica-checker",
      premium_compare: "/api/v1/compare",
    },
    proof: buildCompareProof(core),
  };
}
