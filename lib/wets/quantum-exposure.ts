/**
 * Quantum Exposure Index — indicative structural exposure by RWA vertical.
 * Not a live market feed; methodology for institutional narrative + scoring.
 */

export type QeiVerticalId =
  | "tokenized_treasuries"
  | "real_estate"
  | "water_rights"
  | "energy_grid"
  | "energy_microgrid"
  | "capacity_rights"
  | "luxury_collectible"
  | "vehicle_vessel"
  | "sports_rights"
  | "private_credit"
  | "commodities";

export type QeiBand = "elevated" | "moderate" | "contained";

export type QeiVertical = {
  id: QeiVerticalId;
  label: string;
  exposure_score: number; // 0–10, higher = more structural quantum/custody risk
  band: QeiBand;
  avg_pool_concentration: "high" | "medium" | "low";
  asset_duration: "short" | "medium" | "long";
  legal_recourse_typical: "strong" | "mixed" | "weak";
  rationale: string;
  wets_link?: string;
};

export const QUANTUM_EXPOSURE_VERTICALS: QeiVertical[] = [
  {
    id: "tokenized_treasuries",
    label: "Treasuries tokenisées",
    exposure_score: 7.5,
    band: "elevated",
    avg_pool_concentration: "high",
    asset_duration: "short",
    legal_recourse_typical: "mixed",
    rationale:
      "Gros pools par point de custody ; rotation rapide des clés ; recours légal souvent contractuel mais concentration opérationnelle élevée.",
  },
  {
    id: "real_estate",
    label: "Immobilier tokenisé",
    exposure_score: 5.5,
    band: "moderate",
    avg_pool_concentration: "medium",
    asset_duration: "long",
    legal_recourse_typical: "strong",
    rationale:
      "Titre foncier / SPV souvent au-dessus du token ; durée longue augmente la fenêtre quantique, mais recourse off-chain typiquement plus fort.",
    wets_link: "/eau/trust",
  },
  {
    id: "water_rights",
    label: "Droits d’eau / concessions",
    exposure_score: 6.0,
    band: "moderate",
    avg_pool_concentration: "medium",
    asset_duration: "long",
    legal_recourse_typical: "mixed",
    rationale:
      "Actifs longs + stress hydrique ; qualité du recours dépend entièrement de la SPV/concession — d’où le critère WETS post_quantum_legal_recourse.",
    wets_link: "/eau/trust",
  },
  {
    id: "energy_grid",
    label: "Énergie raccordée réseau",
    exposure_score: 7.0,
    band: "elevated",
    avg_pool_concentration: "high",
    asset_duration: "long",
    legal_recourse_typical: "mixed",
    rationale:
      "Promesses de MW + files d’interconnexion 3–5 ans ; custody souvent centralisée ; risque « capacité papier » avant COD.",
    wets_link: "/eau/trust",
  },
  {
    id: "energy_microgrid",
    label: "Microgrids / behind-the-meter",
    exposure_score: 5.0,
    band: "moderate",
    avg_pool_concentration: "medium",
    asset_duration: "long",
    legal_recourse_typical: "mixed",
    rationale:
      "Moins dépendants de la queue réseau ; encore naissants en tokenisation — fenêtre pour imposer recours off-chain + Shield reseal dès le jour 1.",
    wets_link: "/power",
  },
  {
    id: "capacity_rights",
    label: "Capacity rights (MW / cooling / queue)",
    exposure_score: 7.5,
    band: "elevated",
    avg_pool_concentration: "high",
    asset_duration: "long",
    legal_recourse_typical: "weak",
    rationale:
      "Droits longs, souvent « papier » avant COD ; concentration utility ; recours dépend entièrement du registre et du contrat de capacité.",
    wets_link: "/trust/capacity",
  },
  {
    id: "luxury_collectible",
    label: "Luxe / collectibles",
    exposure_score: 6.5,
    band: "elevated",
    avg_pool_concentration: "high",
    asset_duration: "long",
    legal_recourse_typical: "mixed",
    rationale:
      "Custody vault concentrée ; provenance critique ; token sans titre = exposition structurelle haute.",
    wets_link: "/trust/passport",
  },
  {
    id: "vehicle_vessel",
    label: "Véhicules / bateaux",
    exposure_score: 6.0,
    band: "moderate",
    avg_pool_concentration: "medium",
    asset_duration: "medium",
    legal_recourse_typical: "mixed",
    rationale:
      "Titre administratif / pavillon souvent plus fort que le token — à condition que le registre fasse foi.",
    wets_link: "/trust/passport",
  },
  {
    id: "sports_rights",
    label: "Droits sportifs",
    exposure_score: 7.0,
    band: "elevated",
    avg_pool_concentration: "high",
    asset_duration: "medium",
    legal_recourse_typical: "weak",
    rationale:
      "Cashflows contractuels ; contrepartie unique ; marketing ownership fréquent — claim vs title indispensable.",
    wets_link: "/trust/passport",
  },
  {
    id: "private_credit",
    label: "Private credit / fonds",
    exposure_score: 6.5,
    band: "elevated",
    avg_pool_concentration: "high",
    asset_duration: "medium",
    legal_recourse_typical: "strong",
    rationale:
      "Documentation légale riche, mais admin/custody points uniques ; durée moyenne + taille de pool = exposition structurelle.",
  },
  {
    id: "commodities",
    label: "Commodities tokenisées",
    exposure_score: 8.0,
    band: "elevated",
    avg_pool_concentration: "high",
    asset_duration: "short",
    legal_recourse_typical: "weak",
    rationale:
      "Souvent « possession du token ≈ claim » ; vaults concentrés ; peu de recourse post-compromission documenté.",
  },
];

export const QEI_METHODOLOGY = [
  "Taille moyenne des pools par point de custody (concentration).",
  "Durée de vie typique de l’actif (fenêtre d’attaque quantique).",
  "Présence typique d’un recours légal off-chain (registre / SPV / transfer agent).",
  "Indice indicatif 0–10 — plus haut = plus d’exposition structurelle. Pas une note de crédit.",
] as const;

export const QEI_ROUTE = "/trust/quantum";
