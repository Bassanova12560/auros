import {
  filterRwaPools,
  groupPoolsByProduct,
  type DefiLlamaPool,
} from "./defillama";
import {
  DEFILLAMA_PROJECT_SLUGS,
  STABLECOIN_PROJECTS,
} from "./stablecoins.config";
import type { ManualProductInput } from "./validate";
import type { ComparatorProductRow, StablecoinRow } from "./types";

export type StablecoinsPayload = {
  rows: StablecoinRow[];
  fetchedAt: string;
  source: "live" | "fallback";
};

function resolveLink(
  project: string,
  affiliate?: string,
  fallback?: string
): string {
  const aff = affiliate?.trim();
  if (aff) return aff;
  return fallback ?? STABLECOIN_PROJECTS[project]?.link ?? "#";
}

function groupedToRow(
  group: ReturnType<typeof groupPoolsByProduct>[number]
): StablecoinRow {
  const meta = STABLECOIN_PROJECTS[group.project];
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
    category: meta?.category ?? "mixed",
  };
}

function manualToRow(entry: ManualProductInput): StablecoinRow {
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
    category: (entry.category as StablecoinRow["category"]) ?? "mixed",
    jurisdiction: entry.jurisdiction,
  };
}

export function buildStablecoinPayload(
  pools: DefiLlamaPool[],
  manual: ManualProductInput[],
  fetchedAt: string
): StablecoinsPayload {
  const filtered = filterRwaPools(pools, DEFILLAMA_PROJECT_SLUGS);
  const grouped = groupPoolsByProduct(filtered);
  const liveRows = grouped.map(groupedToRow);
  const liveIds = new Set(liveRows.map((r) => r.id));
  const extras = manual.map(manualToRow).filter((m) => !liveIds.has(m.id));

  return {
    rows: [...liveRows, ...extras].sort((a, b) => b.apy - a.apy),
    fetchedAt,
    source: "live",
  };
}

export function buildStablecoinFallback(
  manual: ManualProductInput[],
  fetchedAt: string
): StablecoinsPayload {
  return {
    rows: manual.map(manualToRow).sort((a, b) => b.apy - a.apy),
    fetchedAt,
    source: "fallback",
  };
}

export function resolvePlatformLink(row: ComparatorProductRow): string {
  return resolveLink(row.project, row.affiliate_link, row.link);
}
