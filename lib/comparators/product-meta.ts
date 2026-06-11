import type { ComparatorId } from "./registry";
import type { ComparatorProductRow } from "./types";

export type ProductHighlight = "new" | "popular";

export type ProductMetaInput = {
  minInvestmentUsd?: number;
  liquidityDays?: number;
  fees?: string;
  accreditedOnly?: boolean;
  highlight?: ProductHighlight | null;
};

export type ResolvedProductMeta = {
  minInvestmentUsd: number;
  liquidityDays: number;
  fees: string;
  accreditedOnly: boolean;
  highlight: ProductHighlight | null;
};

/** Overrides par id produit (priorité max). */
const ID_META: Record<string, ProductMetaInput> = {
  "realt-portfolio": {
    minInvestmentUsd: 50,
    liquidityDays: 14,
    fees: "2% + frais gas",
    highlight: "popular",
  },
  "lofty-portfolio": {
    minInvestmentUsd: 50,
    liquidityDays: 7,
    fees: "1.5%",
    highlight: "popular",
  },
  "estate-protocol-dubai": {
    minInvestmentUsd: 100,
    liquidityDays: 30,
    fees: "2%",
  },
  "realtyx-luxury": {
    minInvestmentUsd: 100,
    liquidityDays: 30,
    fees: "2%",
  },
  "yieldbricks-eu": {
    minInvestmentUsd: 500,
    liquidityDays: 30,
    fees: "1.5%",
  },
  "landshare-properties": {
    minInvestmentUsd: 50,
    liquidityDays: 14,
    fees: "2%",
  },
  "mountain-usdm": {
    minInvestmentUsd: 1,
    liquidityDays: 1,
    fees: "0%",
  },
  "backed-bib01": {
    minInvestmentUsd: 1000,
    liquidityDays: 3,
    fees: "0.2%",
    accreditedOnly: true,
    highlight: "popular",
  },
  "republic-note": {
    minInvestmentUsd: 500,
    liquidityDays: 7,
    fees: "1%",
  },
  "paxos-paxg": {
    minInvestmentUsd: 20,
    liquidityDays: 1,
    fees: "0.02% custody",
    highlight: "popular",
  },
  "tether-xaut": {
    minInvestmentUsd: 1,
    liquidityDays: 1,
    fees: "0.25% custody",
  },
  "matrixdock-xaum": {
    minInvestmentUsd: 1,
    liquidityDays: 1,
    fees: "0.3%",
  },
  "ondo-yield-assets::OUSG": {
    minInvestmentUsd: 5000,
    liquidityDays: 1,
    fees: "0.15%",
    highlight: "popular",
  },
  "ondo-yield-assets::USDY": {
    minInvestmentUsd: 500,
    liquidityDays: 1,
    fees: "0.15%",
  },
  "openeden-tbill::TBILL": {
    minInvestmentUsd: 1000,
    liquidityDays: 1,
    fees: "0.3%",
  },
  "openeden-usdo::USDO": {
    minInvestmentUsd: 1000,
    liquidityDays: 1,
    fees: "0.3%",
  },
  "superstate-ustb::USTB": {
    minInvestmentUsd: 1000,
    liquidityDays: 1,
    fees: "0.15%",
    highlight: "popular",
  },
  "superstate-uscc::USCC": {
    minInvestmentUsd: 1000,
    liquidityDays: 1,
    fees: "0.15%",
  },
  "theo-network-thbill::THBILL": {
    minInvestmentUsd: 1000,
    liquidityDays: 1,
    fees: "0.25%",
  },
  "vaneck-treasury-fund::VBILL": {
    minInvestmentUsd: 5000,
    liquidityDays: 2,
    fees: "0.25%",
  },
  "maple::USDC": {
    minInvestmentUsd: 100_000,
    liquidityDays: 90,
    fees: "0.5–1%",
    accreditedOnly: true,
    highlight: "popular",
  },
  "goldfinch::USDC": {
    minInvestmentUsd: 1000,
    liquidityDays: 60,
    fees: "1–2%",
    accreditedOnly: true,
  },
  "goldfinch::GFI": {
    minInvestmentUsd: 1000,
    liquidityDays: 60,
    fees: "1–2%",
    accreditedOnly: true,
  },
  "nest-credit::USDC": {
    minInvestmentUsd: 25_000,
    liquidityDays: 90,
    fees: "1%",
    accreditedOnly: true,
    highlight: "new",
  },
  "centrifuge-protocol::USDC": {
    minInvestmentUsd: 5000,
    liquidityDays: 30,
    fees: "0.5%",
  },
  "centrifuge-protocol::JTRSY": {
    minInvestmentUsd: 5000,
    liquidityDays: 30,
    fees: "0.5%",
  },
  "landx::CORN": {
    minInvestmentUsd: 100,
    liquidityDays: 365,
    fees: "2%",
  },
  "landx::SOY": {
    minInvestmentUsd: 100,
    liquidityDays: 365,
    fees: "2%",
  },
  "franklin-benji": {
    minInvestmentUsd: 1,
    liquidityDays: 1,
    fees: "0.15%",
    highlight: "popular",
  },
  "hashnote-usyc": {
    minInvestmentUsd: 100_000,
    liquidityDays: 1,
    fees: "0.1%",
    accreditedOnly: true,
    highlight: "popular",
  },
  "wisdomtree-wtgxx": {
    minInvestmentUsd: 1000,
    liquidityDays: 1,
    fees: "0.2%",
    accreditedOnly: true,
  },
  "openeden-hybond": {
    minInvestmentUsd: 100_000,
    liquidityDays: 7,
    fees: "0.5%",
    accreditedOnly: true,
  },
  "matrixdock-sbtb": {
    minInvestmentUsd: 1000,
    liquidityDays: 1,
    fees: "0.3%",
    accreditedOnly: true,
  },
  "backed-bcspx": {
    minInvestmentUsd: 1000,
    liquidityDays: 3,
    fees: "0.2%",
    accreditedOnly: true,
  },
  "bitbond-bafin": {
    minInvestmentUsd: 1000,
    liquidityDays: 7,
    fees: "0.5%",
    accreditedOnly: true,
  },
  "swarm-bafin": {
    minInvestmentUsd: 100,
    liquidityDays: 3,
    fees: "0.3%",
    accreditedOnly: true,
  },
  "mt-pelerin-equity": {
    minInvestmentUsd: 1000,
    liquidityDays: 30,
    fees: "1%",
    accreditedOnly: true,
  },
  "hamilton-lane-scope": {
    minInvestmentUsd: 50_000,
    liquidityDays: 90,
    fees: "1.5%",
    accreditedOnly: true,
    highlight: "popular",
  },
  "apollo-diversified": {
    minInvestmentUsd: 25_000,
    liquidityDays: 90,
    fees: "1.5%",
    accreditedOnly: true,
  },
  "kkr-healthcare": {
    minInvestmentUsd: 25_000,
    liquidityDays: 90,
    fees: "1.5%",
    accreditedOnly: true,
  },
  "blackstone-breit": {
    minInvestmentUsd: 25_000,
    liquidityDays: 90,
    fees: "1.5%",
    accreditedOnly: true,
    highlight: "popular",
  },
  "toucan-bct-nct": {
    minInvestmentUsd: 1,
    liquidityDays: 1,
    fees: "0.5% retrait",
  },
  "klima-klima": {
    minInvestmentUsd: 1,
    liquidityDays: 1,
    fees: "Variable",
  },
  "moss-mco2": {
    minInvestmentUsd: 1,
    liquidityDays: 1,
    fees: "0.5%",
  },
  "flowcarbon-gnt": {
    minInvestmentUsd: 100,
    liquidityDays: 7,
    fees: "1%",
  },
  "maple-mcusdc": {
    minInvestmentUsd: 100_000,
    liquidityDays: 30,
    fees: "0.5%",
    accreditedOnly: true,
    highlight: "popular",
  },
  "figure-heloc": {
    minInvestmentUsd: 10_000,
    liquidityDays: 90,
    fees: "0.5–1%",
    accreditedOnly: true,
    highlight: "popular",
  },
  "credix-latam": {
    minInvestmentUsd: 1000,
    liquidityDays: 60,
    fees: "1–2%",
    accreditedOnly: true,
  },
  "truefi-global": {
    minInvestmentUsd: 5000,
    liquidityDays: 30,
    fees: "0.5%",
    accreditedOnly: true,
  },
  "huma-finance": {
    minInvestmentUsd: 1000,
    liquidityDays: 30,
    fees: "1%",
    accreditedOnly: true,
    highlight: "new",
  },
  "clearpool-usdc": {
    minInvestmentUsd: 1000,
    liquidityDays: 7,
    fees: "0.3%",
    accreditedOnly: true,
  },
  "centrifuge-aave": {
    minInvestmentUsd: 5000,
    liquidityDays: 30,
    fees: "0.5%",
    accreditedOnly: true,
  },
  "centrifuge-blocktower": {
    minInvestmentUsd: 5000,
    liquidityDays: 30,
    fees: "0.5%",
    accreditedOnly: true,
  },
  "centrifuge-anemoy": {
    minInvestmentUsd: 5000,
    liquidityDays: 30,
    fees: "0.5%",
    accreditedOnly: true,
  },
  "centrifuge-newsilver": {
    minInvestmentUsd: 5000,
    liquidityDays: 30,
    fees: "0.5%",
    accreditedOnly: true,
  },
  "centrifuge-figure": {
    minInvestmentUsd: 5000,
    liquidityDays: 30,
    fees: "0.5%",
    accreditedOnly: true,
  },
  "blocksquare-eu": {
    minInvestmentUsd: 100,
    liquidityDays: 30,
    fees: "1.5%",
  },
  "stegx-hedera": {
    minInvestmentUsd: 1000,
    liquidityDays: 30,
    fees: "1.5%",
    accreditedOnly: true,
  },
  "tangible-usdr": {
    minInvestmentUsd: 1,
    liquidityDays: 1,
    fees: "0.5%",
    highlight: "new",
  },
  "ondo-global-markets": {
    minInvestmentUsd: 100,
    liquidityDays: 1,
    fees: "0.15%",
    accreditedOnly: true,
  },
  "agrotoken-soja": {
    minInvestmentUsd: 500,
    liquidityDays: 365,
    fees: "2%",
  },
  "cache-gold-cgt": {
    minInvestmentUsd: 50,
    liquidityDays: 3,
    fees: "0.3%",
  },
};

/** Overrides par slug projet DeFiLlama. */
const PROJECT_META: Record<string, ProductMetaInput> = {
  maple: {
    minInvestmentUsd: 100_000,
    liquidityDays: 90,
    fees: "0.5–1%",
    accreditedOnly: true,
  },
  goldfinch: {
    minInvestmentUsd: 1000,
    liquidityDays: 60,
    fees: "1–2%",
    accreditedOnly: true,
  },
  "nest-credit": {
    minInvestmentUsd: 25_000,
    liquidityDays: 90,
    fees: "1%",
    accreditedOnly: true,
    highlight: "new",
  },
  "realt-tokens": {
    minInvestmentUsd: 50,
    liquidityDays: 14,
    fees: "2%",
    highlight: "popular",
  },
  lofty: {
    minInvestmentUsd: 50,
    liquidityDays: 7,
    fees: "1.5%",
    highlight: "popular",
  },
  "backed-finance": {
    minInvestmentUsd: 1000,
    liquidityDays: 3,
    fees: "0.2%",
    accreditedOnly: true,
  },
  figure: {
    minInvestmentUsd: 10_000,
    liquidityDays: 90,
    fees: "0.5–1%",
    accreditedOnly: true,
  },
  credix: {
    minInvestmentUsd: 1000,
    liquidityDays: 60,
    fees: "1–2%",
    accreditedOnly: true,
  },
  truefi: {
    minInvestmentUsd: 5000,
    liquidityDays: 30,
    fees: "0.5%",
    accreditedOnly: true,
  },
  "huma-finance": {
    minInvestmentUsd: 1000,
    liquidityDays: 30,
    fees: "1%",
    accreditedOnly: true,
  },
  clearpool: {
    minInvestmentUsd: 1000,
    liquidityDays: 7,
    fees: "0.3%",
    accreditedOnly: true,
  },
  blocksquare: {
    minInvestmentUsd: 100,
    liquidityDays: 30,
    fees: "1.5%",
  },
  stegx: {
    minInvestmentUsd: 1000,
    liquidityDays: 30,
    fees: "1.5%",
    accreditedOnly: true,
  },
  tangible: {
    minInvestmentUsd: 1,
    liquidityDays: 1,
    fees: "0.5%",
  },
  landx: {
    minInvestmentUsd: 100,
    liquidityDays: 365,
    fees: "2%",
  },
  "ondo-yield-assets": {
    minInvestmentUsd: 500,
    liquidityDays: 1,
    fees: "0.15%",
  },
  "openeden-tbill": {
    minInvestmentUsd: 1000,
    liquidityDays: 1,
    fees: "0.3%",
  },
  "openeden-usdo": {
    minInvestmentUsd: 1000,
    liquidityDays: 1,
    fees: "0.3%",
  },
  "superstate-ustb": {
    minInvestmentUsd: 1000,
    liquidityDays: 1,
    fees: "0.15%",
  },
  "superstate-uscc": {
    minInvestmentUsd: 1000,
    liquidityDays: 1,
    fees: "0.15%",
  },
};

type CategoryDefaults = Record<string, ProductMetaInput>;

const COMPARATOR_CATEGORY_DEFAULTS: Record<ComparatorId, CategoryDefaults> = {
  stablecoins: {
    treasury: { minInvestmentUsd: 1, liquidityDays: 1, fees: "0–0.5%" },
    credit: { minInvestmentUsd: 1000, liquidityDays: 7, fees: "0.5–1%" },
    mixed: { minInvestmentUsd: 100, liquidityDays: 3, fees: "0.5%" },
  },
  immobilier: {
    residential: { minInvestmentUsd: 50, liquidityDays: 30, fees: "1–2%" },
    commercial: { minInvestmentUsd: 500, liquidityDays: 30, fees: "1.5%" },
    land: { minInvestmentUsd: 100, liquidityDays: 60, fees: "2%" },
  },
  obligations: {
    sovereign: { minInvestmentUsd: 100, liquidityDays: 1, fees: "0.1–0.5%" },
    corporate: { minInvestmentUsd: 500, liquidityDays: 7, fees: "0.5–1%" },
    structured: { minInvestmentUsd: 5000, liquidityDays: 30, fees: "0.5–1%" },
  },
  "matieres-premieres": {
    agricultural: { minInvestmentUsd: 100, liquidityDays: 365, fees: "2%" },
    precious_metals: {
      minInvestmentUsd: 1,
      liquidityDays: 1,
      fees: "0.02–0.3%",
    },
  },
  "private-credit": {
    prime: {
      minInvestmentUsd: 10_000,
      liquidityDays: 90,
      fees: "0.5–1%",
      accreditedOnly: true,
    },
    emerging: {
      minInvestmentUsd: 1000,
      liquidityDays: 60,
      fees: "1–2%",
      accreditedOnly: true,
    },
    alternative: {
      minInvestmentUsd: 5000,
      liquidityDays: 90,
      fees: "1%",
      accreditedOnly: true,
    },
  },
};

const COMPARATOR_DEFAULTS: Record<ComparatorId, ProductMetaInput> = {
  stablecoins: { minInvestmentUsd: 100, liquidityDays: 1, fees: "0.5%" },
  immobilier: { minInvestmentUsd: 50, liquidityDays: 30, fees: "2%" },
  obligations: { minInvestmentUsd: 500, liquidityDays: 1, fees: "0.3%" },
  "matieres-premieres": {
    minInvestmentUsd: 100,
    liquidityDays: 30,
    fees: "1%",
  },
  "private-credit": {
    minInvestmentUsd: 5000,
    liquidityDays: 90,
    fees: "1%",
    accreditedOnly: true,
  },
};

function mergeMeta(...layers: ProductMetaInput[]): ResolvedProductMeta {
  const merged: ProductMetaInput = {};
  for (const layer of layers) {
    Object.assign(merged, layer);
  }

  return {
    minInvestmentUsd: merged.minInvestmentUsd ?? 100,
    liquidityDays: merged.liquidityDays ?? 30,
    fees: merged.fees ?? "—",
    accreditedOnly: merged.accreditedOnly ?? false,
    highlight: merged.highlight ?? null,
  };
}

export function resolveProductMeta(
  comparatorId: ComparatorId,
  row: ComparatorProductRow
): ResolvedProductMeta {
  return mergeMeta(
    COMPARATOR_DEFAULTS[comparatorId],
    COMPARATOR_CATEGORY_DEFAULTS[comparatorId][row.category] ?? {},
    PROJECT_META[row.project] ?? {},
    ID_META[row.id] ?? {}
  );
}

export function formatMinInvestment(usd: number): string {
  if (usd >= 1000) {
    const k = usd / 1000;
    return Number.isInteger(k) ? `$${k}K` : `$${k.toFixed(1)}K`;
  }
  return `$${Math.round(usd)}`;
}

export type LiquidityLabels = {
  instant: string;
  days: (n: number) => string;
};

export function formatLiquidity(
  days: number,
  labels: LiquidityLabels
): string {
  if (days <= 1) return labels.instant;
  return labels.days(days);
}

export function matchesMinInvestmentFilter(
  meta: ResolvedProductMeta,
  filter: "all" | "under500" | "under5000"
): boolean {
  if (filter === "all") return true;
  if (filter === "under500") return meta.minInvestmentUsd <= 500;
  return meta.minInvestmentUsd <= 5000;
}
