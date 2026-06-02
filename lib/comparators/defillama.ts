const YIELDS_URL = "https://yields.llama.fi/pools";
const MIN_TVL_USD = 100_000;

export type DefiLlamaPool = {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number;
  apy: number;
  apyBase?: number;
  apyReward?: number;
};

type YieldsResponse = {
  data: DefiLlamaPool[];
};

export async function fetchDefiLlamaPools(): Promise<DefiLlamaPool[]> {
  const res = await fetch(YIELDS_URL, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`DeFiLlama yields ${res.status}`);
  }

  const json = (await res.json()) as YieldsResponse;
  return json.data ?? [];
}

export function filterRwaPools(
  pools: DefiLlamaPool[],
  projectSlugs: string[]
): DefiLlamaPool[] {
  const slugSet = new Set(projectSlugs);
  return pools.filter(
    (p) =>
      slugSet.has(p.project) &&
      typeof p.apy === "number" &&
      p.apy > 0 &&
      typeof p.tvlUsd === "number" &&
      p.tvlUsd >= MIN_TVL_USD
  );
}

export type GroupedPool = {
  id: string;
  project: string;
  symbol: string;
  apy: number;
  apyBase: number | null;
  apyReward: number | null;
  tvlUsd: number;
  chains: string[];
};

export function groupPoolsByProduct(pools: DefiLlamaPool[]): GroupedPool[] {
  const map = new Map<string, GroupedPool>();

  for (const pool of pools) {
    const key = `${pool.project}::${pool.symbol}`;
    const existing = map.get(key);

    if (!existing) {
      map.set(key, {
        id: key,
        project: pool.project,
        symbol: pool.symbol,
        apy: pool.apy,
        apyBase: pool.apyBase ?? null,
        apyReward: pool.apyReward ?? null,
        tvlUsd: pool.tvlUsd,
        chains: [pool.chain],
      });
      continue;
    }

    existing.tvlUsd += pool.tvlUsd;
    if (pool.apy > existing.apy) {
      existing.apy = pool.apy;
      existing.apyBase = pool.apyBase ?? null;
      existing.apyReward = pool.apyReward ?? null;
    }
    if (!existing.chains.includes(pool.chain)) {
      existing.chains.push(pool.chain);
    }
  }

  return [...map.values()].sort((a, b) => b.apy - a.apy);
}

export function formatTvl(usd: number): string {
  if (usd >= 1_000_000_000) return `$${(usd / 1_000_000_000).toFixed(1)}B`;
  if (usd >= 1_000_000) return `$${(usd / 1_000_000).toFixed(0)}M`;
  if (usd >= 1_000) return `$${(usd / 1_000).toFixed(0)}K`;
  return `$${Math.round(usd)}`;
}
