/** Config for public “welcome” landings before tool/console routes. */

export type VerticalWelcomeCta = {
  href: string;
  label: string;
  primary?: boolean;
};

export type VerticalWelcomeFeature = {
  title: string;
  body: string;
};

export type VerticalWelcomeConfig = {
  /** Canonical path for FocusPageShell + metadata */
  path: string;
  product?: string;
  eyebrow: string;
  title: string;
  intro: string;
  /** Max 3 — UX psychology */
  features: VerticalWelcomeFeature[];
  ctas: VerticalWelcomeCta[];
  secondaryLinks?: VerticalWelcomeCta[];
  disclaimer?: string;
};

export const WETS_WELCOME_PATH = "/eau/trust";
export const WETS_CONSOLE_PATH = "/eau/trust/console";
export const WELHR_WELCOME_PATH = "/eau/risk";
export const WELHR_SCORE_PATH = "/eau/risk/score";
export const TRUST_PACKS_WELCOME_PATH = "/trust/packs";
export const TRUST_PACKS_CATALOG_PATH = "/trust/packs/catalog";
export const H2O_RWA_PATH = "/h2o-rwa";

export const VERTICAL_WELCOMES: Record<string, VerticalWelcomeConfig> = {
  [WETS_WELCOME_PATH]: {
    path: WETS_WELCOME_PATH,
    product: "Eau · Trust",
    eyebrow: "Water/Energy Trust Score · WETS",
    title: "Scorer un RWA eau ou énergie avant le listing",
    intro:
      "Grille indépendante en 7 critères — légal, hydrologie, litige local, raccordement réseau, transparence, token, recours post-quantique. Pas une note de crédit : un écran de diligence indicatif pour fonds et plateformes.",
    features: [
      {
        title: "Trust Score A–D",
        body: "Score assisté (Claude / Groq / heuristique WELHR), édition humaine, rapport public partageable.",
      },
      {
        title: "Preuves sourcées",
        body: "Checklist PQC et champs énergie (BTM, file d’interconnexion, permis) — sans preuve, pas de gonflement de score.",
      },
      {
        title: "Admit-on-verify",
        body: "Rapports publics, dossier quantum, lien Shield reseal — les 5 portes RWA pour se démarquer d’une marketplace.",
      },
    ],
    ctas: [
      {
        href: `${WETS_CONSOLE_PATH}/projects/new`,
        label: "Scorer un projet",
        primary: true,
      },
      { href: `${WETS_WELCOME_PATH}/reports`, label: "Voir les rapports publics" },
      { href: WETS_CONSOLE_PATH, label: "Ouvrir la console" },
    ],
    secondaryLinks: [
      { href: "/eau/risk", label: "WELHR — risque legal & hydrique" },
      { href: "/trust/quantum", label: "Quantum Exposure Index" },
      { href: "/eau", label: "Hub Eau / H₂O" },
    ],
  },
  [WELHR_WELCOME_PATH]: {
    path: WELHR_WELCOME_PATH,
    product: "Eau",
    eyebrow: "WELHR · Due diligence",
    title: "Le filtre hydrique avant un RWA eau ou data center",
    intro:
      "Stress de zone, signaux de moratorium / litige, social license — score indicatif avant qu’un token lève des fonds. Les marketplaces listent ; elles ne scorent pas le blocage par l’autorité locale de l’eau.",
    features: [
      {
        title: "Score rapide",
        body: "Texte + région + type d’actif → bandes de stress et signaux légaux locaux.",
      },
      {
        title: "Alimente WETS",
        body: "Les risk events et le proxy hydrologique nourrissent le critère social / hydrique du Trust Score.",
      },
      {
        title: "API machine",
        body: "POST /api/green/eau/legal-risk pour intégrer le filtre dans votre pipeline diligence.",
      },
    ],
    ctas: [
      { href: WELHR_SCORE_PATH, label: "Lancer un score WELHR", primary: true },
      { href: WETS_WELCOME_PATH, label: "Water/Energy Trust Score" },
      { href: "/eau", label: "Hub Eau" },
    ],
    secondaryLinks: [
      { href: "/rwa-gates", label: "5 portes RWA" },
      { href: "/verify", label: "Verify public" },
    ],
  },
  [TRUST_PACKS_WELCOME_PATH]: {
    path: TRUST_PACKS_WELCOME_PATH,
    product: "Trust",
    eyebrow: "Asset Trust Packs",
    title: "Admission multi-vertical — scarcity & lifestyle",
    intro:
      "Même grammaire que WETS : questions factuelles + preuves obligatoires. Eau/watts (WETS), capacity rights, immo, luxe, véhicules, bateaux, sport — pas une marketplace.",
    features: [
      {
        title: "7 packs",
        body: "Poids par question, grade A–D, checklist anti-washing (sans URL = ignoré au score).",
      },
      {
        title: "Rapports publics",
        body: "Shareables pour plateformes et LPs — badge + lien verify / Shield.",
      },
      {
        title: "Capacity + Passport",
        body: "Droits de MW / queue / cooling et patrimoine lifestyle (titre, custody, assurance).",
      },
    ],
    ctas: [
      {
        href: `${TRUST_PACKS_WELCOME_PATH}/new`,
        label: "Nouvel assessment",
        primary: true,
      },
      { href: TRUST_PACKS_CATALOG_PATH, label: "Catalogue & rapports publiés" },
      { href: "/trust/passport", label: "Lifestyle Passport" },
    ],
    secondaryLinks: [
      { href: "/trust/capacity", label: "Capacity rights" },
      { href: "/trust/institutions", label: "Index institutions RWA" },
    ],
  },
  [H2O_RWA_PATH]: {
    path: H2O_RWA_PATH,
    product: "Eau",
    eyebrow: "H₂O RWA · Tokenisation de l’eau",
    title: "Infrastructure de confiance pour les RWA hydriques",
    intro:
      "Droits d’eau, crédits, data centers, blue bonds : AUROS fournit scores, preuves hash-only et rapports — pas un exchange. Arrivez ici depuis Google ; descendez vers l’outil qui vous correspond.",
    features: [
      {
        title: "H₂O Score & passeport",
        body: "Readiness hydrique et dossier wizard — hub /eau.",
      },
      {
        title: "WETS + WELHR",
        body: "Trust Score projet et filtre legal/hydro avant levée.",
      },
      {
        title: "CFU-W",
        body: "Unités de flux eau vérifiables (ChargeFlow) pour preuves unitaires.",
      },
    ],
    ctas: [
      { href: "/eau", label: "Hub Eau complet", primary: true },
      { href: WETS_WELCOME_PATH, label: "Trust Score (WETS)" },
      { href: WELHR_WELCOME_PATH, label: "Risque WELHR" },
    ],
    secondaryLinks: [
      { href: "/comment-tokeniser/eau", label: "Guide tokenisation eau" },
      { href: "/eau/chargeflow", label: "CFU-W ChargeFlow" },
      { href: "/trust/packs", label: "Trust Packs" },
    ],
  },
};

export function welcomeConfigForPath(path: string): VerticalWelcomeConfig | null {
  return VERTICAL_WELCOMES[path] ?? null;
}
