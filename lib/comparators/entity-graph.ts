/**
 * Issuer ↔ token identity across chains — extends platform::product dedupe.
 * Prefer stable entity_id / issuer_key; attach contract addresses only when known.
 * Never invent on-chain addresses — fail soft (empty token_addresses).
 */

import type { HubProduct } from "./compare-hub";
import { productDedupeKey } from "./compare-hub";

/** Known issuer aliases → canonical issuer_key (lowercase slug). */
const ISSUER_ALIASES: Record<string, string> = {
  blackrock: "blackrock",
  "blackrock buidl": "blackrock",
  "secuitize blackrock": "blackrock",
  "securitize blackrock": "blackrock",
  circle: "circle",
  "circle internet financial": "circle",
  ondo: "ondo",
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
  hashnote: "hashnote",
  superstate: "superstate",
  wisdomtree: "wisdomtree",
  "wisdomtree digital": "wisdomtree",
  spiko: "spiko",
  realt: "realt",
  "real t": "realt",
  realtokens: "realt",
  yieldbricks: "yieldbricks",
  figure: "figure",
  "figure technologies": "figure",
  bitbond: "bitbond",
  "regen network": "regen",
  regen: "regen",
  "solid world": "solid-world",
  "solidworld": "solid-world",
  "energy web": "energy-web",
  powerledger: "powerledger",
  "power ledger": "powerledger",
};

/** Parent issuer when a product line is a subsidiary / wrapper. */
const PARENT_ISSUER: Record<string, string> = {
  "securitize-blackrock": "blackrock",
};

/**
 * Manual multi-chain token catalog — public contracts only.
 * Keys: product row id, project::symbol, or entity_id suffix patterns.
 * Addresses are lowercase checksum-agnostic; never fabricate unknowns.
 */
const MANUAL_TOKEN_ADDRESSES: Record<
  string,
  Record<string, string>
> = {
  // BlackRock BUIDL (Securitize) — Ethereum
  "blackrock-buidl": {
    ethereum: "0x7712c79b2e6492d8c9614655dcdbb237ee2690d8",
  },
  "blackrock-buidl::buidl": {
    ethereum: "0x7712c79b2e6492d8c9614655dcdbb237ee2690d8",
  },
  // Hashnote / Circle USYC
  "hashnote-usyc": {
    ethereum: "0x136471a34f6ef19fe571effc1ca711fdb8e49f2b",
  },
  "circle-usyc": {
    ethereum: "0x136471a34f6ef19fe571effc1ca711fdb8e49f2b",
  },
  // Ondo
  "ondo-yield-assets::ousg": {
    ethereum: "0x1b19c19393e2d034d8ff31ff34c481a4fc43b720",
  },
  "ondo-yield-assets::usdy": {
    ethereum: "0x96f6ef951840721adbf46ac996b59e48012b1071",
  },
  // Toucan carbon baskets (Polygon)
  "toucan-bct-nct": {
    polygon: "0x2f800db0fdb5223b3c73b4ed7ad7f8ace4574140",
  },
  "toucan::bct": {
    polygon: "0x2f800db0fdb5223b3c73b4ed7ad7f8ace4574140",
  },
  "toucan::nct": {
    polygon: "0xd838290e877e998bf4c78c73fd75bc8ac0eb4c4a",
  },
  // KlimaDAO
  "klima-klima": {
    polygon: "0x4e78011ce80ee02d2c3e649fb657e45898257815",
  },
  "klima-dao::klima": {
    polygon: "0x4e78011ce80ee02d2c3e649fb657e45898257815",
  },
  // Moss MCO2
  "moss-mco2": {
    ethereum: "0xfc98e825a2264d890f9a1e68ed50e1526abccacd",
  },
  "moss-earth::mco2": {
    ethereum: "0xfc98e825a2264d890f9a1e68ed50e1526abccacd",
  },
  // Maple syrupUSDC (Syrup)
  "maple-mcusdc": {
    ethereum: "0xc3af7bb39049037769c7d9852fad0ef10d29235d",
  },
};

const ADDRESS_RE = /^0x[a-f0-9]{40}$/;

function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function normalizeChainSlug(chain: string): string {
  return slugify(chain) || "unknown";
}

function normalizeAddress(raw: string): string | null {
  const a = raw.trim().toLowerCase();
  return ADDRESS_RE.test(a) ? a : null;
}

export function normalizeIssuerKey(platform: string): string {
  const lower = platform.trim().toLowerCase();
  if (ISSUER_ALIASES[lower]) return ISSUER_ALIASES[lower];
  for (const [alias, key] of Object.entries(ISSUER_ALIASES)) {
    if (lower.startsWith(alias) || lower.includes(alias)) return key;
  }
  return slugify(platform) || "unknown";
}

export function productSlugFromRow(product: HubProduct): string {
  const fromId = product.row.id.includes("-")
    ? product.row.id.split("-").slice(1).join("-")
    : product.row.id;
  // Live DeFiLlama ids are project::symbol
  if (product.row.id.includes("::")) {
    return slugify(product.row.id.split("::").slice(1).join("::") || product.row.product);
  }
  return slugify(fromId || product.row.product) || "product";
}

export type CompareTokenAddress = {
  chain: string;
  address: string;
  source: "manual_catalog" | "defillama";
};

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
  /**
   * Known contract addresses per chain — empty when unknown (fail soft).
   * Never invent addresses.
   */
  token_addresses: CompareTokenAddress[];
};

function lookupManualAddresses(
  product: HubProduct
): Record<string, string> {
  const id = product.row.id.toLowerCase();
  const projectSymbol = `${product.row.project}::${product.row.product}`.toLowerCase();
  const merged: Record<string, string> = {};
  for (const key of [id, projectSymbol, product.row.project.toLowerCase()]) {
    const hit = MANUAL_TOKEN_ADDRESSES[key];
    if (!hit) continue;
    for (const [chain, addr] of Object.entries(hit)) {
      const n = normalizeAddress(addr);
      if (n) merged[normalizeChainSlug(chain)] = n;
    }
  }
  return merged;
}

function collectTokenAddresses(product: HubProduct): CompareTokenAddress[] {
  const byChain = new Map<string, CompareTokenAddress>();

  const manual = lookupManualAddresses(product);
  for (const [chain, address] of Object.entries(manual)) {
    byChain.set(chain, { chain, address, source: "manual_catalog" });
  }

  const fromLlama = product.row.underlyingTokens;
  if (Array.isArray(fromLlama)) {
    for (const entry of fromLlama) {
      if (!entry || typeof entry !== "object") continue;
      const chain = normalizeChainSlug(String(entry.chain ?? ""));
      const address = normalizeAddress(String(entry.address ?? ""));
      if (!chain || chain === "unknown" || !address) continue;
      if (byChain.has(chain)) continue; // manual wins
      byChain.set(chain, { chain, address, source: "defillama" });
    }
  }

  return [...byChain.values()].sort((a, b) => a.chain.localeCompare(b.chain));
}

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
    token_addresses: collectTokenAddresses(product),
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
