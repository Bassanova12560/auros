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
  /** Token addresses when DeFiLlama provides them — may be empty. */
  underlyingTokens?: string[];
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
  /** First valid underlying token per chain when DeFiLlama exposes it. */
  underlyingTokens: { chain: string; address: string }[];
};

function firstUnderlying(
  pool: DefiLlamaPool
): { chain: string; address: string } | null {
  const raw = pool.underlyingTokens?.find(
    (t) => typeof t === "string" && /^0x[a-fA-F0-9]{40}$/.test(t)
  );
  if (!raw || !pool.chain) return null;
  return { chain: pool.chain, address: raw.toLowerCase() };
}

export function groupPoolsByProduct(pools: DefiLlamaPool[]): GroupedPool[] {
  const map = new Map<string, GroupedPool>();

  for (const pool of pools) {
    const key = `${pool.project}::${pool.symbol}`;
    const existing = map.get(key);
    const token = firstUnderlying(pool);

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
        underlyingTokens: token ? [token] : [],
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
    if (
      token &&
      !existing.underlyingTokens.some(
        (t) => t.chain.toLowerCase() === token.chain.toLowerCase()
      )
    ) {
      existing.underlyingTokens.push(token);
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
