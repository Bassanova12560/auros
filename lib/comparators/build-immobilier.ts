import {
  filterRwaPools,
  groupPoolsByProduct,
  type DefiLlamaPool,
} from "./defillama";
import {
  DEFILLAMA_IMMOBILIER_SLUGS,
  IMMOBILIER_PROJECTS,
} from "./immobilier.config";
import type { ManualProductInput } from "./validate";
import type { ComparatorProductRow, RealEstateRow } from "./types";

export type ImmobilierPayload = {
  rows: RealEstateRow[];
  fetchedAt: string;
  source: "live" | "fallback";
};

function groupedToRow(
  group: ReturnType<typeof groupPoolsByProduct>[number]
): RealEstateRow {
  const meta = IMMOBILIER_PROJECTS[group.project];
  return {
    id: group.id,
    project: group.project,
    platform: meta?.name ?? group.project,
    product: group.symbol,
    apy: group.apy,
    apyBase: group.apyBase,
    apyReward: group.apyReward,
    tvlUsd: group.tvlUsd,
    chains: group.chains,
    link: meta?.link ?? "#",
    affiliate_link: meta?.affiliate_link ?? "",
    logo: meta?.logo ?? "",
    live: true,
    category: meta?.category ?? "residential",
  };
}

function manualToRow(entry: ManualProductInput): RealEstateRow {
  return {
    id: entry.id,
    project: entry.project,
    platform: entry.platform,
    product: entry.product,
    apy: entry.apy,
    apyBase: null,
    apyReward: null,
    tvlUsd: entry.tvlUsd ?? 0,
    chains: entry.chains,
    link: entry.link,
    affiliate_link: entry.affiliate_link ?? "",
    logo: entry.logo ?? "",
    live: false,
    category: (entry.category as RealEstateRow["category"]) ?? "residential",
  };
}

export function buildImmobilierPayload(
  pools: DefiLlamaPool[],
  manual: ManualProductInput[],
  fetchedAt: string
): ImmobilierPayload {
  const filtered = filterRwaPools(pools, DEFILLAMA_IMMOBILIER_SLUGS);
  const grouped = groupPoolsByProduct(filtered);
  const liveRows = grouped.map(groupedToRow);
  const liveIds = new Set(liveRows.map((r) => r.id));
  const extras = manual.map(manualToRow).filter((m) => !liveIds.has(m.id));

  return {
    rows: [...liveRows, ...extras].sort((a, b) => b.apy - a.apy),
    fetchedAt,
    source: liveRows.length > 0 ? "live" : "fallback",
  };
}

export function buildImmobilierFallback(
  manual: ManualProductInput[],
  fetchedAt: string
): ImmobilierPayload {
  return {
    rows: manual.map(manualToRow).sort((a, b) => b.apy - a.apy),
    fetchedAt,
    source: "fallback",
  };
}

export function resolveImmobilierLink(row: ComparatorProductRow): string {
  const aff = row.affiliate_link?.trim();
  if (aff) return aff;
  return row.link;
}
