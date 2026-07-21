/** AUROS Asset Trust Packs — taxonomy across scarcity + lifestyle RWAs */

export const TRUST_PACK_FAMILIES = ["scarcity", "lifestyle"] as const;
export type TrustPackFamily = (typeof TRUST_PACK_FAMILIES)[number];

export const TRUST_PACK_IDS = [
  "water_energy",
  "capacity_rights",
  "real_estate",
  "luxury_collectible",
  "vehicle",
  "vessel",
  "sports_rights",
] as const;

export type TrustPackId = (typeof TRUST_PACK_IDS)[number];

export type TrustPackMeta = {
  id: TrustPackId;
  family: TrustPackFamily;
  label: string;
  short: string;
  /** Deep product if already shipped (WETS, etc.) */
  deepHref?: string;
  deepLabel?: string;
};

export const TRUST_PACK_META: Record<TrustPackId, TrustPackMeta> = {
  water_energy: {
    id: "water_energy",
    family: "scarcity",
    label: "Eau / énergie (WETS)",
    short: "Droits d’eau, microgrids, raccordement, recours PQC.",
    deepHref: "/eau/trust",
    deepLabel: "Console WETS",
  },
  capacity_rights: {
    id: "capacity_rights",
    family: "scarcity",
    label: "Capacity rights",
    short: "MW, file d’interconnexion, cooling, allocation — droits de capacité.",
    deepHref: "/trust/capacity",
    deepLabel: "Hub capacity",
  },
  real_estate: {
    id: "real_estate",
    family: "lifestyle",
    label: "Immobilier tokenisé",
    short: "Titre, SPV, registre, assurance, claim vs title.",
    deepHref: "/trust/passport",
    deepLabel: "Lifestyle Passport",
  },
  luxury_collectible: {
    id: "luxury_collectible",
    family: "lifestyle",
    label: "Luxe / collectibles",
    short: "Provenance, custody, assurance, authentification.",
    deepHref: "/trust/passport",
    deepLabel: "Lifestyle Passport",
  },
  vehicle: {
    id: "vehicle",
    family: "lifestyle",
    label: "Véhicules",
    short: "Titre véhicule, VIN, custody, assurance flotte.",
    deepHref: "/trust/passport",
    deepLabel: "Lifestyle Passport",
  },
  vessel: {
    id: "vessel",
    family: "lifestyle",
    label: "Bateaux / yachts",
    short: "Pavillon, registre maritime, mortgage, assurance.",
    deepHref: "/trust/passport",
    deepLabel: "Lifestyle Passport",
  },
  sports_rights: {
    id: "sports_rights",
    family: "lifestyle",
    label: "Droits sportifs",
    short: "Naming, media, athlete equity — claim contractuel documenté.",
    deepHref: "/trust/passport",
    deepLabel: "Lifestyle Passport",
  },
};

export const TRUST_PACKS_ROUTE = "/trust/packs";
export const TRUST_CAPACITY_ROUTE = "/trust/capacity";
export const TRUST_PASSPORT_ROUTE = "/trust/passport";
export const TRUST_INSTITUTIONS_ROUTE = "/trust/institutions";

export const TRUST_PACK_DISCLAIMER =
  "AUROS Asset Trust Pack — indicative admission screen. Not a credit rating, appraisal, legal opinion, or investment advice. Counsel required.";
