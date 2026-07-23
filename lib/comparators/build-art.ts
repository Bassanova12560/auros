import {
  filterRwaPools,
  groupPoolsByProduct,
  type DefiLlamaPool,
} from "./defillama";
import { ART_PROJECTS, DEFILLAMA_ART_SLUGS } from "./art.config";
import type { ManualProductInput } from "./validate";
import type { ArtRow, ComparatorProductRow } from "./types";

export type ArtPayload = {
  rows: ArtRow[];
  fetchedAt: string;
  source: "live" | "fallback";
};

function filterArtPools(pools: DefiLlamaPool[]): DefiLlamaPool[] {
  return filterRwaPools(pools, DEFILLAMA_ART_SLUGS).filter((pool) => {
    const meta = ART_PROJECTS[pool.project];
    if (!meta?.symbols?.length) return true;
    return meta.symbols.includes(pool.symbol);
  });
}

function groupedToRow(
  group: ReturnType<typeof groupPoolsByProduct>[number]
): ArtRow {
  const meta = ART_PROJECTS[group.project];
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
    category: meta?.category ?? "fine_art",
  };
}

function manualToRow(entry: ManualProductInput): ArtRow {
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
    category: (entry.category as ArtRow["category"]) ?? "fine_art",
    jurisdiction: entry.jurisdiction,
  };
}

export function buildArtPayload(
  pools: DefiLlamaPool[],
  manual: ManualProductInput[],
  fetchedAt: string
): ArtPayload {
  const filtered = filterArtPools(pools);
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

export function buildArtFallback(
  manual: ManualProductInput[],
  fetchedAt: string
): ArtPayload {
  return {
    rows: manual.map(manualToRow).sort((a, b) => b.apy - a.apy),
    fetchedAt,
    source: "fallback",
  };
}

export function resolveArtLink(row: ComparatorProductRow): string {
  const aff = row.affiliate_link?.trim();
  if (aff) return aff;
  return row.link;
}
