import {
  filterRwaPools,
  groupPoolsByProduct,
  type DefiLlamaPool,
} from "./defillama";
import {
  DEFILLAMA_PRIVATE_CREDIT_SLUGS,
  PRIVATE_CREDIT_PROJECTS,
} from "./private-credit.config";
import type { ManualProductInput } from "./validate";
import type { ComparatorProductRow, PrivateCreditRow } from "./types";

export type PrivateCreditPayload = {
  rows: PrivateCreditRow[];
  fetchedAt: string;
  source: "live" | "fallback";
};

function filterPrivateCreditPools(pools: DefiLlamaPool[]): DefiLlamaPool[] {
  return filterRwaPools(pools, DEFILLAMA_PRIVATE_CREDIT_SLUGS).filter((pool) => {
    const meta = PRIVATE_CREDIT_PROJECTS[pool.project];
    if (!meta?.symbols?.length) return true;
    return meta.symbols.includes(pool.symbol);
  });
}

function groupedToRow(
  group: ReturnType<typeof groupPoolsByProduct>[number]
): PrivateCreditRow {
  const meta = PRIVATE_CREDIT_PROJECTS[group.project];
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
    category: meta?.category ?? "prime",
  };
}

function manualToRow(entry: ManualProductInput): PrivateCreditRow {
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
    category: (entry.category as PrivateCreditRow["category"]) ?? "prime",
    jurisdiction: entry.jurisdiction,
  };
}

export function buildPrivateCreditPayload(
  pools: DefiLlamaPool[],
  manual: ManualProductInput[],
  fetchedAt: string
): PrivateCreditPayload {
  const filtered = filterPrivateCreditPools(pools);
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

export function buildPrivateCreditFallback(
  manual: ManualProductInput[],
  fetchedAt: string
): PrivateCreditPayload {
  return {
    rows: manual.map(manualToRow).sort((a, b) => b.apy - a.apy),
    fetchedAt,
    source: "fallback",
  };
}

export function resolvePrivateCreditLink(row: ComparatorProductRow): string {
  const aff = row.affiliate_link?.trim();
  if (aff) return aff;
  return row.link;
}
