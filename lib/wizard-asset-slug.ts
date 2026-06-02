/** Slug scoring / API — mapping libellés wizard (Step 1) → clé interne. */

export type AssetSlug =
  | "real_estate"
  | "luxury_vehicle"
  | "fine_art"
  | "wine_spirits"
  | "watches_jewelry"
  | "precious_metals"
  | "land_island"
  | "private_credit"
  | "sports_memorabilia"
  | "music_royalties"
  | "film_ip"
  | "collectibles"
  | "fashion"
  | "other";

const WIZARD_TO_SLUG = new Map<string, AssetSlug>([
  ["Real estate", "real_estate"],
  ["Vehicles & classic cars", "luxury_vehicle"],
  ["Fine art", "fine_art"],
  ["Wine & spirits", "wine_spirits"],
  ["Watches & jewelry", "watches_jewelry"],
  ["Commodities & precious metals", "precious_metals"],
  ["Land & island", "land_island"],
  ["Private equity / SME shares", "private_credit"],
  ["Music & royalties", "music_royalties"],
  ["Fashion & luxury goods", "fashion"],
  ["Film & IP rights", "film_ip"],
  ["Collectibles", "collectibles"],
  ["Other", "other"],
]);

export function assetSlugFromWizardType(wizardType: string): AssetSlug {
  return WIZARD_TO_SLUG.get(wizardType) ?? "other";
}
