import type { HubProduct } from "../compare-hub";
import { isSponsoredProductId } from "../sponsored";
import { isGreenRelevantHubProduct } from "../compare-report";
import { resolveCompareEntity } from "../entity-graph";
import { SITE_URL } from "../site";
import type { RiskTier } from "../risk";

export type SourceType = "live" | "manual";

export type CompareCitation = {
  url: string;
  as_of: string;
  source_type: SourceType;
  label: string;
};

export type CompareApiProduct = {
  id: string;
  /** Cross-chain / cross-class entity identity (platform+product). */
  entity_key: string;
  /** Stable entity id: ent:{issuer_key}:{product_slug} */
  entity_id: string;
  /** Canonical issuer slug (aliases collapsed). */
  issuer_key: string;
  /** Parent issuer when known (soft graph). */
  parent_issuer: string | null;
  platform: string;
  product: string;
  category: string;
  asset_class: string;
  apy: number;
  apy_note: "indicative_never_invented";
  tvl_usd: number;
  chains: string[];
  /** Known contracts per chain — empty when unknown (never invented). */
  token_addresses: {
    chain: string;
    address: string;
    source: "manual_catalog" | "defillama";
  }[];
  live: boolean;
  source_type: SourceType;
  risk_tier: RiskTier;
  risk_tiers: RiskTier[];
  min_investment_usd: number;
  liquidity_days: number;
  fees: string;
  jurisdiction: string | null;
  accredited_only: boolean;
  sponsored: boolean;
  green_relevant: boolean;
  comparator_href: string;
  citation: CompareCitation;
};

const CATEGORY_API: Record<string, string> = {
  stablecoins: "stablecoins",
  immobilier: "real_estate",
  obligations: "bonds",
  "matieres-premieres": "commodities",
  "private-credit": "private_credit",
  "private-equity": "private_equity",
  "art-collectibles": "art",
};

export function toCompareApiProduct(
  product: HubProduct,
  asOf: string
): CompareApiProduct {
  const source_type: SourceType = product.row.live ? "live" : "manual";
  const path = product.comparatorHref.startsWith("http")
    ? product.comparatorHref
    : `${SITE_URL}${product.comparatorHref}`;
  const entity = resolveCompareEntity(product);
  return {
    id: product.row.id,
    entity_key: entity.entity_key,
    entity_id: entity.entity_id,
    issuer_key: entity.issuer_key,
    parent_issuer: entity.parent_issuer,
    platform: product.row.platform,
    product: product.row.product,
    category: product.row.category,
    asset_class: CATEGORY_API[product.comparatorId] ?? product.comparatorId,
    apy: product.row.apy,
    apy_note: "indicative_never_invented",
    tvl_usd: product.row.tvlUsd,
    chains: product.row.chains,
    token_addresses: entity.token_addresses,
    live: product.row.live,
    source_type,
    risk_tier: product.riskTier,
    risk_tiers: product.riskTiers ?? [product.riskTier],
    min_investment_usd: product.meta.minInvestmentUsd,
    liquidity_days: product.meta.liquidityDays,
    fees: product.meta.fees,
    jurisdiction: product.meta.jurisdiction ?? null,
    accredited_only: product.meta.accreditedOnly,
    sponsored: isSponsoredProductId(product.row.id),
    green_relevant: isGreenRelevantHubProduct(product),
    comparator_href: product.comparatorHref,
    citation: {
      url: path,
      as_of: asOf,
      source_type,
      label: source_type === "live" ? "DeFiLlama-derived live row" : "AUROS curated manual row",
    },
  };
}

export type ScreenerFilters = {
  ids?: string[];
  risk_tier?: RiskTier | "all";
  source?: SourceType | "all";
  jurisdiction?: string;
  yield_min?: number;
  max_ticket_usd?: number;
  green_only?: boolean;
  limit?: number;
};

export function applyScreener(
  products: HubProduct[],
  filters: ScreenerFilters
): HubProduct[] {
  let list = products;
  if (filters.ids?.length) {
    const set = new Set(filters.ids);
    list = list.filter((p) => set.has(p.row.id));
  }
  if (filters.risk_tier && filters.risk_tier !== "all") {
    const tier = filters.risk_tier;
    list = list.filter((p) => (p.riskTiers ?? [p.riskTier]).includes(tier));
  }
  if (filters.source === "live") {
    list = list.filter((p) => p.row.live);
  } else if (filters.source === "manual") {
    list = list.filter((p) => !p.row.live);
  }
  if (filters.jurisdiction?.trim()) {
    const j = filters.jurisdiction.trim().toLowerCase();
    list = list.filter((p) =>
      (p.meta.jurisdiction ?? "").toLowerCase().includes(j)
    );
  }
  if (filters.yield_min !== undefined && Number.isFinite(filters.yield_min)) {
    list = list.filter((p) => p.row.apy >= filters.yield_min!);
  }
  if (
    filters.max_ticket_usd !== undefined &&
    Number.isFinite(filters.max_ticket_usd)
  ) {
    list = list.filter(
      (p) => p.meta.minInvestmentUsd <= filters.max_ticket_usd!
    );
  }
  if (filters.green_only) {
    list = list.filter(isGreenRelevantHubProduct);
  }
  const limit = Math.min(Math.max(1, filters.limit ?? 50), 100);
  return list.slice(0, limit);
}

export type DriftNote = {
  code: string;
  message: string;
};

export function buildDriftNotes(input: {
  requestedIds?: string[];
  foundIds: string[];
  fetchedAt: string;
}): DriftNote[] {
  const notes: DriftNote[] = [];
  if (input.requestedIds?.length) {
    const found = new Set(input.foundIds);
    const missing = input.requestedIds.filter((id) => !found.has(id));
    for (const id of missing) {
      notes.push({
        code: "slug_missing",
        message: `Product id not in catalog: ${id}`,
      });
    }
  }
  const ageMs = Date.now() - Date.parse(input.fetchedAt);
  if (Number.isFinite(ageMs) && ageMs > 6 * 3_600_000) {
    notes.push({
      code: "stale_cache",
      message: `Hub fetched_at older than 6h (${input.fetchedAt}) — revalidate may be pending`,
    });
  }
  return notes;
}
