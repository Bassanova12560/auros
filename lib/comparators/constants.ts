/** Public comparator routes — English slugs for SEO */
export const COMPARATOR_ROUTES = {
  compare: "/compare",
  stablecoins: "/stablecoins",
  realEstate: "/real-estate",
  bonds: "/bonds",
  commodities: "/commodities",
  privateCredit: "/private-credit",
  privateEquity: "/private-equity",
  art: "/art-collectibles",
} as const;

/** Post-market conversion — chooser (~4 min) before full wizard. */
export const DOSSIER_CTA = {
  href: "/start",
} as const;

export const STABLECOINS_CACHE_KEY = "auros-stablecoin-rows";
export const STABLECOINS_REVALIDATE_SECONDS = 3600;

export const IMMOBILIER_CACHE_KEY = "auros-immobilier-rows";
export const IMMOBILIER_REVALIDATE_SECONDS = 3600;

export const BONDS_CACHE_KEY = "auros-bond-rows";
export const BONDS_REVALIDATE_SECONDS = 3600;

export const COMMODITIES_CACHE_KEY = "auros-commodities-rows";
export const COMMODITIES_REVALIDATE_SECONDS = 3600;

export const PRIVATE_CREDIT_CACHE_KEY = "auros-private-credit-rows";
export const PRIVATE_CREDIT_REVALIDATE_SECONDS = 3600;

export type ComparatorPageId =
  | "stablecoins"
  | "immobilier"
  | "obligations"
  | "matieres-premieres"
  | "private-credit";

/** Legacy French paths → 301 to English slugs */
export const LEGACY_COMPARATOR_REDIRECTS = [
  { source: "/comparateurs/stablecoins", destination: "/stablecoins" },
  { source: "/comparateurs/immobilier", destination: "/real-estate" },
  { source: "/comparateurs/obligations", destination: "/bonds" },
  {
    source: "/comparateurs/matieres-premieres",
    destination: "/commodities",
  },
  {
    source: "/comparateurs/private-equity",
    destination: "/private-credit",
  },
  {
    source: "/comparateurs/art-collectibles",
    destination: "/art-collectibles",
  },
] as const;
