import {
  filterRwaPools,
  groupPoolsByProduct,
  type DefiLlamaPool,
} from "./defillama";
import { BOND_PROJECTS, DEFILLAMA_BOND_SLUGS } from "./bonds.config";
import type { ManualProductInput } from "./validate";
import type { BondRow, ComparatorProductRow } from "./types";

export type BondsPayload = {
  rows: BondRow[];
  fetchedAt: string;
  source: "live" | "fallback";
};

function filterBondPools(pools: DefiLlamaPool[]): DefiLlamaPool[] {
  const slugSet = new Set(DEFILLAMA_BOND_SLUGS);
  return filterRwaPools(pools, DEFILLAMA_BOND_SLUGS).filter((pool) => {
    const meta = BOND_PROJECTS[pool.project];
    if (!meta?.symbols?.length) return slugSet.has(pool.project);
    return meta.symbols.includes(pool.symbol);
  });
}

function groupedToRow(
  group: ReturnType<typeof groupPoolsByProduct>[number]
): BondRow {
  const meta = BOND_PROJECTS[group.project];
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
    underlyingTokens: group.underlyingTokens.length
      ? group.underlyingTokens
      : undefined,
    link: meta?.link ?? "#",
    affiliate_link: meta?.affiliate_link ?? "",
    logo: meta?.logo ?? "",
    live: true,
    category: meta?.category ?? "sovereign",
  };
}

function manualToRow(entry: ManualProductInput): BondRow {
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
    category: (entry.category as BondRow["category"]) ?? "sovereign",
    jurisdiction: entry.jurisdiction,
  };
}

export function buildBondsPayload(
  pools: DefiLlamaPool[],
  manual: ManualProductInput[],
  fetchedAt: string
): BondsPayload {
  const filtered = filterBondPools(pools);
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

export function buildBondsFallback(
  manual: ManualProductInput[],
  fetchedAt: string
): BondsPayload {
  return {
    rows: manual.map(manualToRow).sort((a, b) => b.apy - a.apy),
    fetchedAt,
    source: "fallback",
  };
}

export function resolveBondLink(row: ComparatorProductRow): string {
  const aff = row.affiliate_link?.trim();
  if (aff) return aff;
  return row.link;
}
