import type { ComparatorId } from "./registry";
import type { ComparatorProductRow } from "./types";
import { resolveArtLink } from "./build-art";
import { resolveBondLink } from "./build-bonds";
import { resolveCommodityLink } from "./build-commodities";
import { resolveImmobilierLink } from "./build-immobilier";
import { resolvePrivateCreditLink } from "./build-private-credit";
import { resolvePrivateEquityLink } from "./build-private-equity";
import { resolvePlatformLink } from "./build-stablecoins";

export function resolveComparatorProductLink(
  comparatorId: ComparatorId,
  row: ComparatorProductRow
): string {
  switch (comparatorId) {
    case "stablecoins":
      return resolvePlatformLink(row);
    case "immobilier":
      return resolveImmobilierLink(row);
    case "obligations":
      return resolveBondLink(row);
    case "matieres-premieres":
      return resolveCommodityLink(row);
    case "private-credit":
      return resolvePrivateCreditLink(row);
    case "private-equity":
      return resolvePrivateEquityLink(row);
    case "art-collectibles":
      return resolveArtLink(row);
  }
}
