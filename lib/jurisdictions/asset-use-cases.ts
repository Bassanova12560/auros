import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";

import type { JurisdictionAssetType } from "./types";

export type AssetUseCase = {
  assetType: JurisdictionAssetType;
  title: string;
  subtitle: string;
  typicalJurisdictions: string[];
  starterKitFocus: string[];
  roiNote: string;
};

type AssetUseCaseCopy = Record<JurisdictionAssetType, AssetUseCase>;

const FR: AssetUseCaseCopy = {
  real_estate: {
    assetType: "real_estate",
    title: "Immobilier tokenisé",
    subtitle:
      "Programme neuf, foncière, actif unique — arbitrage retail vs investisseurs qualifiés, custodie actif et SPV.",
    typicalJurisdictions: ["dubai-difc", "luxembourg", "bahrain", "france"],
    starterKitFocus: [
      "Structure SPV + séparation actif / véhicule d'émission",
      "Régime investisseur (retail, pro, institutionnel)",
      "Shortlist tech immo (Brickken, Tokeny, Securitize)",
    ],
    roiNote: "Erreur juridiction = +6 mois et 20 k€+ de refonte structure.",
  },
  bonds: {
    assetType: "bonds",
    title: "Obligations & titres tokenisés",
    subtitle:
      "Dette privée, mini-bonds, T-Bills tokenisés — licence titres et distribution qualifiée.",
    typicalJurisdictions: ["luxembourg", "ireland", "gibraltar", "switzerland"],
    starterKitFocus: [
      "Classification titre vs e-money / utility token",
      "Prospectus et exemptions (prospectus réglementé vs simplifié)",
      "Matching émetteurs institutionnels (Securitize, Polymath)",
    ],
    roiNote: "Brief cabinet prêt → −40 % heures en phase structuration.",
  },
  private_credit: {
    assetType: "private_credit",
    title: "Crédit privé tokenisé",
    subtitle:
      "Pools de prêts, revenue share — KYC renforcé et règles de transfert restreintes.",
    typicalJurisdictions: ["gibraltar", "dubai-difc", "luxembourg", "switzerland"],
    starterKitFocus: [
      "Cadre DLT / security token pour créances",
      "Politique AML et origination des prêts",
      "Tech avec restrictions de transfert on-chain",
    ],
    roiNote: "Checklist LCB-FT incluse — point bloquant fréquent en due diligence.",
  },
  funds: {
    assetType: "funds",
    title: "Fonds & véhicules d'investissement",
    subtitle:
      "RAIF, AIF, fonds feeder — passeport UE vs hub offshore selon base investisseurs.",
    typicalJurisdictions: ["luxembourg", "ireland", "singapore", "dubai-difc"],
    starterKitFocus: [
      "Choix RAIF / AIF / véhicule tokenisé",
      "Gestionnaire agréé vs délégation",
      "Calendrier CSSF / CBI / MAS",
    ],
    roiNote: "Comparatif 8 juridictions évite un aller-retour cabinet de 3 semaines.",
  },
};

const EN: AssetUseCaseCopy = {
  real_estate: {
    ...FR.real_estate,
    title: "Tokenized real estate",
    subtitle:
      "REIT, single asset, portfolio — retail vs qualified investor framing and asset custody.",
    typicalJurisdictions: FR.real_estate.typicalJurisdictions,
    starterKitFocus: [
      "SPV structure + asset / issuer separation",
      "Investor regime (retail, professional, institutional)",
      "Real estate tech shortlist (Brickken, Tokeny, Securitize)",
    ],
    roiNote: "Wrong jurisdiction = +6 months and €20k+ restructure.",
  },
  bonds: {
    ...FR.bonds,
    title: "Tokenized bonds & securities",
    subtitle:
      "Private debt, mini-bonds, tokenized T-Bills — securities licensing and qualified distribution.",
    starterKitFocus: [
      "Security vs e-money / utility classification",
      "Prospectus and exemptions",
      "Institutional issuer matching (Securitize, Polymath)",
    ],
    roiNote: "Ready counsel brief → −40% structuring hours.",
  },
  private_credit: {
    ...FR.private_credit,
    title: "Tokenized private credit",
    subtitle:
      "Loan pools, revenue share — enhanced KYC and restricted transfer rules.",
    starterKitFocus: [
      "DLT / security token framework for receivables",
      "AML policy and loan origination",
      "Tech with on-chain transfer restrictions",
    ],
    roiNote: "AML checklist included — common due diligence blocker.",
  },
  funds: {
    ...FR.funds,
    title: "Funds & investment vehicles",
    subtitle:
      "RAIF, AIF, feeder funds — EU passport vs offshore hub by investor base.",
    starterKitFocus: [
      "RAIF / AIF / tokenized vehicle choice",
      "Licensed manager vs delegation",
      "CSSF / CBI / MAS timeline",
    ],
    roiNote: "8-jurisdiction compare avoids a 3-week counsel round-trip.",
  },
};

const ES: AssetUseCaseCopy = {
  ...EN,
  real_estate: { ...EN.real_estate, title: "Inmobiliario tokenizado" },
  bonds: { ...EN.bonds, title: "Bonos tokenizados" },
  private_credit: { ...EN.private_credit, title: "Crédito privado tokenizado" },
  funds: { ...EN.funds, title: "Fondos tokenizados" },
};

const CATALOG: CatalogMap< AssetUseCaseCopy> = { fr: FR, en: EN, es: ES };

export function getAssetUseCases(locale: Locale): AssetUseCase[] {
  const copy = CATALOG[resolveCatalogLocale(locale)] ?? FR;
  return [
    copy.real_estate,
    copy.bonds,
    copy.private_credit,
    copy.funds,
  ];
}

export function getAssetUseCase(
  locale: Locale,
  assetType: JurisdictionAssetType
): AssetUseCase {
  return (CATALOG[resolveCatalogLocale(locale)] ?? FR)[assetType];
}
