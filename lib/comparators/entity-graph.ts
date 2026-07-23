/**
 * Issuer ↔ token identity across chains — extends platform::product dedupe.
 * Prefer stable entity_id / issuer_key without inventing on-chain addresses.
 */

import type { HubProduct } from "./compare-hub";
import { productDedupeKey } from "./compare-hub";

/** Known issuer aliases → canonical issuer_key (lowercase slug). */
const ISSUER_ALIASES: Record<string, string> = {
  blackrock: "blackrock",
  "blackrock buidl": "blackrock",
  "secuitize blackrock": "blackrock",
  "securitize blackrock": "blackrock",
  "circle": "circle",
  "circle internet financial": "circle",
  "ondo": "ondo",
  "ondo finance": "ondo",
  maple: "maple",
  "maple finance": "maple",
  backed: "backed",
  "backed finance": "backed",
  "backed assets": "backed",
  centrifuge: "centrifuge",
  "centrifuge tinlake": "centrifuge",
  toucan: "toucan",
  "toucan protocol": "toucan",
  klimadao: "klimadao",
  "klima dao": "klimadao",
  "klima-dao": "klimadao",
  "moss.earth": "moss",
  moss: "moss",
  "flow carbon": "flowcarbon",
  flowcarbon: "flowcarbon",
  "franklin templeton": "franklin-templeton",
  "franklin onchain": "franklin-templeton",
  "hashnote": "hashnote",
  "superstate": "superstate",
  "wisdomtree": "wisdomtree",
  "wisdomtree digital": "wisdomtree",
  spiko: "spiko",
  realt: "realt",
  "real t": "realt",
  "realtokens": "realt",
  yieldbricks: "yieldbricks",
  "figure": "figure",
  "figure technologies": "figure",
  bitbond: "bitbond",
};

/** Parent issuer when a product line is a subsidiary / wrapper. */
const PARENT_ISSUER: Record<string, string> = {
  "securitize-blackrock": "blackrock",
};

function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function normalizeIssuerKey(platform: string): string {
  const lower = platform.trim().toLowerCase();
  if (ISSUER_ALIASES[lower]) return ISSUER_ALIASES[lower];
  // Try without trailing product noise
  for (const [alias, key] of Object.entries(ISSUER_ALIASES)) {
    if (lower.startsWith(alias) || lower.includes(alias)) return key;
  }
  return slugify(platform) || "unknown";
}

export function productSlugFromRow(product: HubProduct): string {
  const fromId = product.row.id.includes("-")
    ? product.row.id.split("-").slice(1).join("-")
    : product.row.id;
  return slugify(fromId || product.row.product) || "product";
}

export type CompareEntityIdentity = {
  /** Legacy hub dedupe: platform::product */
  entity_key: string;
  /** Stable cross-catalog id: ent:{issuer}:{product_slug} */
  entity_id: string;
  /** Canonical issuer slug */
  issuer_key: string;
  /** Parent issuer when known; else null */
  parent_issuer: string | null;
  /** Chains carrying this product (may be empty) */
  chains: string[];
};

export function resolveCompareEntity(product: HubProduct): CompareEntityIdentity {
  const issuer_key = normalizeIssuerKey(product.row.platform);
  const product_slug = productSlugFromRow(product);
  const parent =
    PARENT_ISSUER[issuer_key] ??
    PARENT_ISSUER[product.row.id] ??
    null;
  return {
    entity_key: productDedupeKey(product),
    entity_id: `ent:${issuer_key}:${product_slug}`,
    issuer_key,
    parent_issuer: parent && parent !== issuer_key ? parent : null,
    chains: [...product.row.chains],
  };
}

/** Collapse products that share entity_id (stronger than platform::product). */
export function dedupeByEntityId(products: HubProduct[]): HubProduct[] {
  const map = new Map<string, HubProduct>();
  for (const product of products) {
    const { entity_id } = resolveCompareEntity(product);
    const existing = map.get(entity_id);
    if (!existing) {
      map.set(entity_id, product);
      continue;
    }
    // Prefer live + higher TVL when merging duplicates across classes
    const prefer =
      (product.row.live && !existing.row.live) ||
      (product.row.live === existing.row.live &&
        product.row.tvlUsd > existing.row.tvlUsd) ||
      (product.row.live === existing.row.live &&
        product.row.tvlUsd === existing.row.tvlUsd &&
        product.row.apy > existing.row.apy);
    if (prefer) map.set(entity_id, product);
  }
  return [...map.values()];
}
