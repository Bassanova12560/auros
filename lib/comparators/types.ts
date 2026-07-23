export type ComparatorProductRow = {
  id: string;
  project: string;
  platform: string;
  product: string;
  apy: number;
  apyBase: number | null;
  apyReward: number | null;
  tvlUsd: number;
  chains: string[];
  link: string;
  affiliate_link: string;
  logo: string;
  live: boolean;
  category: string;
  jurisdiction?: string;
};

export type StablecoinCategory = "treasury" | "credit" | "mixed";

export type StablecoinRow = ComparatorProductRow & {
  category: StablecoinCategory;
};

export type CommodityCategory = "agricultural" | "precious_metals";

export type CommodityRow = ComparatorProductRow & {
  category: CommodityCategory;
};

export type PrivateCreditCategory = "prime" | "emerging" | "alternative";

export type PrivateCreditRow = ComparatorProductRow & {
  category: PrivateCreditCategory;
};

export type BondCategory = "sovereign" | "corporate" | "structured";

export type BondRow = ComparatorProductRow & {
  category: BondCategory;
};

export type RealEstateCategory = "residential" | "commercial" | "land";

export type RealEstateRow = ComparatorProductRow & {
  category: RealEstateCategory;
};

export type PrivateEquityCategory = "funds" | "public_equity" | "infrastructure";

export type PrivateEquityRow = ComparatorProductRow & {
  category: PrivateEquityCategory;
};

export type ArtCategory = "fine_art" | "collectibles";

export type ArtRow = ComparatorProductRow & {
  category: ArtCategory;
};

export const STABLECOIN_CATEGORY_LABELS: Record<StablecoinCategory, string> = {
  treasury: "Trésorerie",
  credit: "Crédit",
  mixed: "Mixte",
};

export type SortField = "apy" | "tvlUsd" | "platform" | "product";
export type SortDirection = "asc" | "desc";
