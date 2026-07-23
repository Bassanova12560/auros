import bondsManual from "@/data/bonds-manual.json";
import commoditiesManual from "@/data/commodities-manual.json";
import immobilierManual from "@/data/immobilier-manual.json";
import privateCreditManual from "@/data/private-credit-manual.json";
import privateEquityManual from "@/data/private-equity-manual.json";
import artManual from "@/data/art-manual.json";
import stablecoinsManual from "@/data/stablecoins-manual.json";
import { ART_PROJECTS } from "@/lib/comparators/art.config";
import { BOND_PROJECTS } from "@/lib/comparators/bonds.config";
import { COMMODITY_PROJECTS } from "@/lib/comparators/commodities.config";
import { IMMOBILIER_PROJECTS } from "@/lib/comparators/immobilier.config";
import { PRIVATE_CREDIT_PROJECTS } from "@/lib/comparators/private-credit.config";
import { PRIVATE_EQUITY_PROJECTS } from "@/lib/comparators/private-equity.config";
import { STABLECOIN_PROJECTS } from "@/lib/comparators/stablecoins.config";
import { COMPARATOR_ROUTES } from "@/lib/comparators/constants";
import { absoluteUrl } from "@/lib/comparators/site";

export type TrackableProduct = {
  id: string;
  platform: string;
  product: string;
  assetClass: string;
  defillamaSlug: string | null;
  source: "manual" | "defillama_config";
  aurosPage: string;
  externalLink?: string;
};

type ManualRow = {
  id: string;
  project: string;
  platform: string;
  product: string;
  link?: string;
};

const ASSET_CLASS_ROUTES: Record<string, string> = {
  bonds: COMPARATOR_ROUTES.bonds,
  sovereign: COMPARATOR_ROUTES.bonds,
  corporate: COMPARATOR_ROUTES.bonds,
  structured: COMPARATOR_ROUTES.bonds,
  treasury: COMPARATOR_ROUTES.stablecoins,
  credit: COMPARATOR_ROUTES.stablecoins,
  mixed: COMPARATOR_ROUTES.stablecoins,
  residential: COMPARATOR_ROUTES.realEstate,
  commercial: COMPARATOR_ROUTES.realEstate,
  land: COMPARATOR_ROUTES.realEstate,
  prime: COMPARATOR_ROUTES.privateCredit,
  emerging: COMPARATOR_ROUTES.privateCredit,
  alternative: COMPARATOR_ROUTES.privateCredit,
  precious_metals: COMPARATOR_ROUTES.commodities,
  agricultural: COMPARATOR_ROUTES.commodities,
  funds: COMPARATOR_ROUTES.privateEquity,
  public_equity: COMPARATOR_ROUTES.privateEquity,
  infrastructure: COMPARATOR_ROUTES.privateEquity,
  fine_art: COMPARATOR_ROUTES.art,
  collectibles: COMPARATOR_ROUTES.art,
};

function routeForCategory(category: string): string {
  return ASSET_CLASS_ROUTES[category] ?? COMPARATOR_ROUTES.compare;
}

function manualToProducts(rows: ManualRow[], assetClass: string): TrackableProduct[] {
  return rows.map((row) => ({
    id: row.id,
    platform: row.platform,
    product: row.product,
    assetClass,
    defillamaSlug: row.project,
    source: "manual" as const,
    aurosPage: absoluteUrl(routeForCategory((row as { category?: string }).category ?? assetClass)),
    externalLink: row.link?.startsWith("http") ? row.link : undefined,
  }));
}

function configSlugsToProducts(
  projects: Record<string, { name: string; link: string; category: string }>,
  assetClass: string,
  route: string
): TrackableProduct[] {
  return Object.entries(projects).map(([slug, meta]) => ({
    id: `defillama-${slug}`,
    platform: meta.name,
    product: slug,
    assetClass,
    defillamaSlug: slug,
    source: "defillama_config" as const,
    aurosPage: absoluteUrl(route),
    externalLink: meta.link.startsWith("http") ? meta.link : undefined,
  }));
}

/** Static catalog for listing submissions (manual JSON + DeFiLlama slug registry). */
export function getTrackableProducts(): TrackableProduct[] {
  const manual: TrackableProduct[] = [
    ...manualToProducts(bondsManual, "bonds"),
    ...manualToProducts(immobilierManual, "real_estate"),
    ...manualToProducts(privateCreditManual, "private_credit"),
    ...manualToProducts(privateEquityManual, "private_equity"),
    ...manualToProducts(artManual, "art"),
    ...manualToProducts(stablecoinsManual, "stablecoins"),
    ...manualToProducts(commoditiesManual, "commodities"),
  ];

  const fromConfig: TrackableProduct[] = [
    ...configSlugsToProducts(STABLECOIN_PROJECTS, "stablecoins", COMPARATOR_ROUTES.stablecoins),
    ...configSlugsToProducts(BOND_PROJECTS, "bonds", COMPARATOR_ROUTES.bonds),
    ...configSlugsToProducts(IMMOBILIER_PROJECTS, "real_estate", COMPARATOR_ROUTES.realEstate),
    ...configSlugsToProducts(COMMODITY_PROJECTS, "commodities", COMPARATOR_ROUTES.commodities),
    ...configSlugsToProducts(
      PRIVATE_CREDIT_PROJECTS,
      "private_credit",
      COMPARATOR_ROUTES.privateCredit
    ),
    ...configSlugsToProducts(
      PRIVATE_EQUITY_PROJECTS,
      "private_equity",
      COMPARATOR_ROUTES.privateEquity
    ),
    ...configSlugsToProducts(ART_PROJECTS, "art", COMPARATOR_ROUTES.art),
  ];

  const seen = new Set<string>();
  const merged: TrackableProduct[] = [];

  for (const item of [...manual, ...fromConfig]) {
    const key = `${item.platform.toLowerCase()}::${item.product.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  return merged.sort((a, b) =>
    a.platform.localeCompare(b.platform) || a.product.localeCompare(b.product)
  );
}

export function getTrackableProductsSummary() {
  const products = getTrackableProducts();
  const platforms = new Set(products.map((p) => p.platform));
  const defillamaSlugs = new Set(
    products.map((p) => p.defillamaSlug).filter(Boolean) as string[]
  );
  const byClass = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.assetClass] = (acc[p.assetClass] ?? 0) + 1;
    return acc;
  }, {});

  return {
    totalProducts: products.length,
    uniquePlatforms: platforms.size,
    defillamaSlugs: defillamaSlugs.size,
    manualEntries: products.filter((p) => p.source === "manual").length,
    byAssetClass: byClass,
    /** Live hub may exceed this via grouped DeFiLlama pools at runtime. */
    note: "Compare hub /compare deduplicates and merges live pools; runtime count grows with DeFiLlama coverage.",
  };
}

/** Protocols worth citing in DeFiLlama/CoinGecko submissions (already indexed on DeFiLlama yields). */
export const DEFILLAMA_INDEXED_PROTOCOLS = [
  ...new Set([
    ...Object.keys(STABLECOIN_PROJECTS),
    ...Object.keys(BOND_PROJECTS),
    ...Object.keys(IMMOBILIER_PROJECTS),
    ...Object.keys(COMMODITY_PROJECTS),
    ...Object.keys(PRIVATE_CREDIT_PROJECTS),
    ...Object.keys(PRIVATE_EQUITY_PROJECTS),
    ...Object.keys(ART_PROJECTS),
  ]),
].sort();
