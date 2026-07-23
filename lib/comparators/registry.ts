import { COMPARATOR_ROUTES } from "./constants";

export type ComparatorId =
  | "stablecoins"
  | "immobilier"
  | "obligations"
  | "matieres-premieres"
  | "private-credit"
  | "private-equity"
  | "art-collectibles";

export type ComparatorEntry = {
  id: ComparatorId;
  href: string;
  tool: string;
  soon?: boolean;
};

export const COMPARATOR_REGISTRY: ComparatorEntry[] = [
  {
    id: "stablecoins",
    href: COMPARATOR_ROUTES.stablecoins,
    tool: "stablecoins",
  },
  {
    id: "immobilier",
    href: COMPARATOR_ROUTES.realEstate,
    tool: "immobilier",
  },
  {
    id: "obligations",
    href: COMPARATOR_ROUTES.bonds,
    tool: "bonds",
  },
  {
    id: "matieres-premieres",
    href: COMPARATOR_ROUTES.commodities,
    tool: "commodities",
  },
  {
    id: "private-credit",
    href: COMPARATOR_ROUTES.privateCredit,
    tool: "private credit",
  },
  {
    id: "private-equity",
    href: COMPARATOR_ROUTES.privateEquity,
    tool: "private equity",
  },
  {
    id: "art-collectibles",
    href: COMPARATOR_ROUTES.art,
    tool: "art",
  },
];

export function getComparatorByPath(pathname: string): ComparatorEntry | undefined {
  return COMPARATOR_REGISTRY.find((c) => c.href === pathname);
}

export function isCompareHubPath(pathname: string): boolean {
  return pathname === COMPARATOR_ROUTES.compare;
}

export function isComparatorPath(pathname: string): boolean {
  return (
    isCompareHubPath(pathname) ||
    COMPARATOR_REGISTRY.some((c) => c.href === pathname)
  );
}
