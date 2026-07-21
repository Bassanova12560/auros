/** Config for public “welcome” landings before tool/console routes. */

import {
  COMPASS_DASHBOARD_ROUTE,
  COMPASS_WELCOME_ROUTE,
} from "@/lib/resilience/compass";
import {
  CONTINUITY_PLAYBOOK_ROUTE,
  CONTINUITY_WELCOME_ROUTE,
} from "@/lib/wets/continuity-playbook";

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

export const QEI_WELCOME_PATH = "/trust/quantum";
export const QEI_INDEX_PATH = "/trust/quantum/index";
export const TRUST_CAPACITY_WELCOME_PATH = "/trust/capacity";
export const TRUST_CAPACITY_GUIDE_PATH = "/trust/capacity/guide";
export const TRUST_PASSPORT_WELCOME_PATH = "/trust/passport";
export const TRUST_PASSPORT_PACKS_PATH = "/trust/passport/packs";
export const TRUST_INSTITUTIONS_WELCOME_PATH = "/trust/institutions";
export const TRUST_INSTITUTIONS_INDEX_PATH = "/trust/institutions/index";
export const VERIFY_WELCOME_PATH = "/verify";
export const VERIFY_CHECK_PATH = "/verify/check";
export const POWER_WELCOME_PATH = "/power";
export const POWER_HUB_PATH = "/power/hub";
export const GREEN_WELCOME_PATH = "/green";
export const GREEN_HUB_PATH = "/green/hub";

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
      { href: "/demos/data-center-100mw", label: "Cas data center 100 MW" },
      { href: COMPASS_WELCOME_ROUTE, label: "Auros Compass" },
      { href: CONTINUITY_WELCOME_ROUTE, label: "Playbook continuité" },
    ],
  },
  [CONTINUITY_WELCOME_ROUTE]: {
    path: CONTINUITY_WELCOME_ROUTE,
    product: "Eau · Resilience",
    eyebrow: "Continuity playbook",
    title: "De l’alerte hydrique à la décision chiffrée",
    intro:
      "Après WELHR, générez un playbook indicatif : bascule eau non potable, boucle fermée, délestage IT — CAPEX/OPEX en fourchettes, pas d’exécution sans vous.",
    features: [
      {
        title: "3 scénarios max",
        body: "Alignés stress zone et grade WELHR — même logique que risk events WETS.",
      },
      {
        title: "Export Markdown",
        body: "Dossier partageable risk desk / board — à valider counsel et EPC.",
      },
      {
        title: "Pont Trust",
        body: "Capacity rights + WETS social_litigation_risk + preuves Shield.",
      },
    ],
    ctas: [
      {
        href: CONTINUITY_PLAYBOOK_ROUTE,
        label: "Générer un playbook",
        primary: true,
      },
      { href: WELHR_SCORE_PATH, label: "Score WELHR d’abord" },
      { href: "/demos/data-center-100mw", label: "Voir la démo 100 MW" },
    ],
    secondaryLinks: [
      { href: WETS_WELCOME_PATH, label: "WETS" },
      { href: COMPASS_WELCOME_ROUTE, label: "Compass" },
      { href: "/h2o-rwa", label: "H₂O RWA" },
    ],
  },
  [COMPASS_WELCOME_ROUTE]: {
    path: COMPASS_WELCOME_ROUTE,
    product: "Resilience",
    eyebrow: "Auros Compass",
    title: "Un cockpit — trois KPI, trois priorités",
    intro:
      "Chefs de projet et ingénieurs : filtrez par eau, carbone indicatif ou budget. Chaque mode affiche au plus 3 actions — pas un dashboard infini.",
    features: [
      {
        title: "Mode Eau",
        body: "WELHR, playbook continuité, console WETS — résilience hydrique.",
      },
      {
        title: "Mode Carbone",
        body: "Green hub, Power, capacity rights — watts et droits réseau.",
      },
      {
        title: "Mode Budget",
        body: "Démo ROI 100 MW, compare, wizard — fourchettes indicatives.",
      },
    ],
    ctas: [
      {
        href: `${COMPASS_DASHBOARD_ROUTE}?mode=water`,
        label: "Ouvrir le Compass",
        primary: true,
      },
      { href: "/eau", label: "Hub Eau" },
      { href: "/demos/data-center-100mw", label: "Démo marketing" },
    ],
    secondaryLinks: [
      { href: CONTINUITY_WELCOME_ROUTE, label: "Playbook continuité" },
      { href: "/eau/risk", label: "WELHR" },
      { href: "/trust/capacity", label: "Capacity" },
    ],
  },
  [QEI_WELCOME_PATH]: {
    path: QEI_WELCOME_PATH,
    product: "Trust",
    eyebrow: "Quantum Exposure · 2026",
    title: "Exposition post-quantique des verticaux RWA",
    intro:
      "Indice structurel custody / durée d’actif / recours légal off-chain — pas une note de crédit. Comprenez le risque avant de scorer un projet WETS ou d’intégrer Shield.",
    features: [
      {
        title: "Classement par vertical",
        body: "Eau, capacity, immo, crédit privé — scores indicatifs 0–10 et bandes elevated / moderate / contained.",
      },
      {
        title: "Playbook & dossiers",
        body: "Clauses recours SPV, rapports publics /trust/quantum/report — même grammaire que Lifestyle Passport.",
      },
      {
        title: "Pont WETS + Shield",
        body: "4 questions PQC au niveau projet ; reseal Shield pour preuves hash-only admission plateforme.",
      },
    ],
    ctas: [
      { href: QEI_INDEX_PATH, label: "Voir l’index complet", primary: true },
      { href: "/trust/quantum/playbook", label: "Playbook clauses" },
      { href: WETS_WELCOME_PATH, label: "Accueil WETS" },
    ],
    secondaryLinks: [
      { href: "/developers/shield", label: "Shield PQC" },
      { href: "/trust/passport", label: "Lifestyle Passport" },
      { href: "/rwa-gates", label: "5 portes RWA" },
    ],
  },
  [TRUST_CAPACITY_WELCOME_PATH]: {
    path: TRUST_CAPACITY_WELCOME_PATH,
    product: "Trust · Scarcity",
    eyebrow: "Capacity rights",
    title: "Les droits de capacité — MW, cooling, file réseau",
    intro:
      "L’objet RWA que les data centers achètent vraiment : pas seulement l’immobilier. AUROS score la crédibilité du droit (COD, contrat opposable), pas le pitch token.",
    features: [
      {
        title: "Pack dédié",
        body: "6 questions factuelles + preuves — même discipline anti-greenwashing que WETS.",
      },
      {
        title: "Convergence eau + watts",
        body: "Refroidissement, interconnexion, allocation — au cœur du stress hydrique WELHR.",
      },
      {
        title: "Admission verify",
        body: "Rapport partageable et lien Shield pour plateformes qui exigent admit-on-verify.",
      },
    ],
    ctas: [
      {
        href: `${TRUST_PACKS_WELCOME_PATH}/new?pack=capacity_rights`,
        label: "Scorer un capacity pack",
        primary: true,
      },
      { href: TRUST_CAPACITY_GUIDE_PATH, label: "Guide & questions" },
      { href: POWER_WELCOME_PATH, label: "Hub Power" },
    ],
    secondaryLinks: [
      { href: WETS_WELCOME_PATH, label: "WETS eau/énergie" },
      { href: QEI_WELCOME_PATH, label: "Quantum index" },
      { href: TRUST_PACKS_CATALOG_PATH, label: "Catalogue packs" },
    ],
  },
  [TRUST_PASSPORT_WELCOME_PATH]: {
    path: TRUST_PASSPORT_WELCOME_PATH,
    product: "Trust · Lifestyle",
    eyebrow: "Lifestyle Passport",
    title: "Patrimoine tokenisé — titre, custody, assurance",
    intro:
      "Immo, luxe, véhicules, yachts, sport : le volume démocratique des RWA. AUROS n’est pas la vitrine — c’est le passeport d’admission que wealth desks et plateformes peuvent exiger.",
    features: [
      {
        title: "5 packs lifestyle",
        body: "Claim vs title, registre, assurance — checklist sans URL = ignorée au score.",
      },
      {
        title: "Recours post-quantique",
        body: "Aligné playbook quantum : si la clé tombe, le registre réémet au vrai propriétaire.",
      },
      {
        title: "Rapports publics",
        body: "Grade A–D shareable + verify pour LPs et compliance light.",
      },
    ],
    ctas: [
      {
        href: `${TRUST_PACKS_WELCOME_PATH}/new?pack=real_estate`,
        label: "Pack immobilier",
        primary: true,
      },
      { href: TRUST_PASSPORT_PACKS_PATH, label: "Tous les packs passport" },
      { href: TRUST_PACKS_CATALOG_PATH, label: "Rapports publiés" },
    ],
    secondaryLinks: [
      { href: "/real-estate", label: "Comparator immo" },
      { href: "/trust/capacity", label: "Capacity rights" },
      { href: "/trust/quantum/playbook", label: "Playbook clauses" },
    ],
  },
  [TRUST_INSTITUTIONS_WELCOME_PATH]: {
    path: TRUST_INSTITUTIONS_WELCOME_PATH,
    product: "Trust · Institutions",
    eyebrow: "Rails RWA",
    title: "Qui prépare l’intégration RWA — radar indicatif",
    intro:
      "Régulateurs, CSD, hubs wealth — pas une liste officielle. Un écran pour risk desks : où les rails bougent, et pourquoi AUROS pousse admit-on-verify plutôt que list-and-pray.",
    features: [
      {
        title: "Index sourcé",
        body: "Entrées avec statut live / pilot / watching et lien source quand disponible.",
      },
      {
        title: "Console développeurs",
        body: "Intégrations institutionnelles, webhooks, parcours partenaire.",
      },
      {
        title: "Trust Packs + juridictions",
        body: "Relier le radar institutionnel à vos dossiers d’admission multi-vertical.",
      },
    ],
    ctas: [
      { href: TRUST_INSTITUTIONS_INDEX_PATH, label: "Ouvrir l’index", primary: true },
      { href: "/developers/institutions", label: "Console institutions" },
      { href: TRUST_PACKS_WELCOME_PATH, label: "Trust Packs" },
    ],
    secondaryLinks: [
      { href: "/jurisdictions", label: "Comparateur juridictions" },
      { href: "/rwa-gates", label: "5 portes" },
      { href: VERIFY_WELCOME_PATH, label: "Verify public" },
    ],
    disclaimer:
      "Index indicatif — pas une recommandation réglementaire. Vérifier les sources officielles ; counsel requis.",
  },
  [VERIFY_WELCOME_PATH]: {
    path: VERIFY_WELCOME_PATH,
    product: "Protocol",
    eyebrow: "Public verify · gratuit",
    title: "Preuves AUROS vérifiables en secondes",
    intro:
      "Receipt Shield (shr_…) ou attestation (att_…) — sans compte, sans data room. Le risk desk valide valid/invalid + hash avant d’admettre un listing.",
    features: [
      {
        title: "Gratuit & public",
        body: "API GET /api/v1/attest/verify — même logique que la console web.",
      },
      {
        title: "Embed plateforme",
        body: "Badge iframe /embed/verify pour marketplaces partenaires.",
      },
      {
        title: "5ᵉ porte RWA",
        body: "Admit-on-verify : preuve cryptographique, pas un agrément bancaire.",
      },
    ],
    ctas: [
      { href: VERIFY_CHECK_PATH, label: "Lancer une vérification", primary: true },
      { href: "/platforms", label: "Pour plateformes" },
      { href: "/rwa-gates", label: "Les 5 portes" },
    ],
    secondaryLinks: [
      { href: "/developers/shield", label: "Shield" },
      { href: "/embed/verify", label: "Embed badge" },
      { href: "/developers/institutions", label: "Institutions" },
    ],
  },
  [POWER_WELCOME_PATH]: {
    path: POWER_WELCOME_PATH,
    product: "Power",
    eyebrow: "Low-carbon & nucléaire",
    title: "Verticale power AUROS — watts hors Green Verified",
    intro:
      "Booking indicatif bas-carbone / nucléaire via Watts Reserve + ChargeFlow CFU — pas un GO/REC ni un conseil d’investissement. Preuves hash-only pour dossiers institutionnels.",
    features: [
      {
        title: "Watts Reserve",
        body: "Profil firm/flex, source nuclear — réservation indicative liée à /compare.",
      },
      {
        title: "ChargeFlow",
        body: "Mint et verify CFU-E — sessions → unités hashées, URL publique.",
      },
      {
        title: "Shield Evidence Pack",
        body: "Dossier crédit / ESG Premium avec generation_source lisible.",
      },
    ],
    ctas: [
      { href: POWER_HUB_PATH, label: "Ouvrir le hub Power", primary: true },
      { href: "/green/watts", label: "Hub Watts Green" },
      { href: "/guides/low-carbon-power", label: "Guide low-carbon" },
    ],
    secondaryLinks: [
      { href: TRUST_CAPACITY_WELCOME_PATH, label: "Capacity rights" },
      { href: "/developers/shield/banks", label: "Shield banks" },
      { href: WETS_WELCOME_PATH, label: "WETS énergie" },
    ],
  },
  [GREEN_WELCOME_PATH]: {
    path: GREEN_WELCOME_PATH,
    product: "Green",
    eyebrow: "Énergie locale · marketplace",
    title: "AUROS Green — surplus, marché, label",
    intro:
      "Carte acteurs, offres, registre, ChargeFlow et label — énergie locale tokenisable sans promesse de rendement. Arrivez ici pour comprendre ; entrez dans le hub pour agir.",
    features: [
      {
        title: "Marketplace & registre",
        body: "Producteurs, stockeurs, chargeurs — données indicatives, acteurs référencés vs démo.",
      },
      {
        title: "ChargeFlow & Watts",
        body: "CFU-E, inventaire, secondaire indicatif — hook compare et prep RWA.",
      },
      {
        title: "Label & CSRD",
        body: "Parcours label Green, check CSRD, impact report — ton pro rassurant.",
      },
    ],
    ctas: [
      { href: GREEN_HUB_PATH, label: "Explorer le hub Green", primary: true },
      { href: "/green/market", label: "Marketplace" },
      { href: "/green/chargeflow", label: "ChargeFlow" },
    ],
    secondaryLinks: [
      { href: "/green/api", label: "Green API" },
      { href: "/green/compare", label: "Compare Green" },
      { href: POWER_WELCOME_PATH, label: "Power (hors Verified)" },
    ],
  },
};

export function welcomeConfigForPath(path: string): VerticalWelcomeConfig | null {
  return VERTICAL_WELCOMES[path] ?? null;
}
