import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";
import {
  GREEN_ABOUT_ROUTE,
  GREEN_CERTIFICATION_ROUTE,
  GREEN_CHARGERS_ROUTE,
  GREEN_COMPARE_ROUTE,
  GREEN_CONSUMERS_ROUTE,
  GREEN_DISCLAIMER,
  GREEN_GUIDE_ROUTE,
  GREEN_LABEL_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_MARKET_OFFER_ROUTE,
  GREEN_MARKET_ACTOR_ROUTE,
  GREEN_PRATICIEN_ROUTE,
  GREEN_PRATICIEN_EXAM_ROUTE,
  GREEN_PRODUCERS_ROUTE,
  GREEN_REGISTRY_ROUTE,
  GREEN_REGISTER_ROUTE,
  GREEN_ROUTE,
  GREEN_RTMS_ASSISTANT_ROUTE,
  GREEN_STANDARDS_ROUTE,
  GREEN_STORERS_ROUTE,
} from "@/lib/green";

export const greenHomePage = enrichPage({
  id: "green",
  path: GREEN_ROUTE,
  title: "Tokenisation verte & énergie locale | AUROS Green",
  description:
    "Place de marché mondiale énergie verte, grille RTMS, registre public et wizard actif renouvelable. 25+ pays, statuts honnêtes (démo, pilote, registre). FR / EN / ES.",
  summary:
    "AUROS Green — hub tokenisation verte : marketplace mondiale (25+ pays), méthodologie RTMS, KPIs indicatifs, registre vérifiable, wizard actif renouvelable et candidature label.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-01",
  keywords: [
    "tokenisation verte",
    "énergie locale tokenisée",
    "RWA vert",
    "tokenisation énergie renouvelable",
    "marketplace énergie verte mondiale",
    "standard RTMS",
    "AUROS Green",
    "green RWA tokenization",
  ],
  intents: [
    "Tokeniser un actif renouvelable",
    "Trouver producteurs solaire internationaux",
    "Comprendre la grille RTMS",
    "Obtenir le label Auros Green Verified",
  ],
  audience: [
    "investisseurs impact",
    "promoteurs solaire",
    "experts ESG",
    "family office",
    "producteurs énergie",
  ],
  facts: [
    { key: "Positionnement", value: "Standard de référence éducatif — pas agrément régulateur" },
    { key: "Grille", value: "RTMS — Réel, Transparent, Mesurable, Sain" },
    { key: "Marketplace", value: `${GREEN_MARKET_ROUTE} — 25+ pays, carte mondiale fitGlobal` },
    { key: "Comparateur", value: `${GREEN_COMPARE_ROUTE} — lignes sourcées, statuts honnêtes` },
    { key: "Label", value: `${GREEN_LABEL_ROUTE} — candidature + revue documentaire` },
    { key: "Registre", value: `${GREEN_REGISTRY_ROUTE} — cas pilotes + Verified RTMS` },
    { key: "Wizard", value: "/wizard?asset=renewable — actif renouvelable, 4 parties" },
    { key: "Disclaimer", value: GREEN_DISCLAIMER },
  ],
  faq: [
    {
      question: "AUROS Green certifie-t-il automatiquement les projets listés au comparateur ?",
      answer:
        "Non. Le comparateur liste des références marché éducatives. Seuls les projets passant la revue RTMS obtiennent le badge Auros Green Verified.",
    },
    {
      question: "Le label remplace-t-il un audit investisseur ?",
      answer:
        "Non. La Phase 1 couvre une revue documentaire RTMS — pas d'audit sur site ni due diligence.",
    },
  ],
  relatedPaths: [
    GREEN_ABOUT_ROUTE,
    GREEN_MARKET_ROUTE,
    GREEN_STANDARDS_ROUTE,
    GREEN_COMPARE_ROUTE,
    GREEN_LABEL_ROUTE,
    "/compare",
    "/academy",
    "/wizard",
  ],
});

export const greenAboutPage = enrichPage({
  id: "green-about",
  path: GREEN_ABOUT_ROUTE,
  title: "Le standard | AUROS Green",
  description:
    "Positionnement RTMS, garanties, parcours label et profils — AUROS Green en détail. FR / EN / ES.",
  summary:
    "Page détaillée AUROS Green : promesse du standard RTMS, valeurs, parcours label, profils investisseur / porteur / consultant.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["standard RWA vert", "RTMS green", "about AUROS Green"],
  intents: ["Comprendre AUROS Green", "Parcours label vert tokenisé"],
  audience: ["investisseurs", "promoteurs", "consultants ESG"],
  facts: [
    { key: "Hub", value: `${GREEN_ROUTE} — entrée minimaliste` },
    { key: "Grille", value: "RTMS — Réel, Transparent, Mesurable, Sain" },
  ],
  relatedPaths: [GREEN_ROUTE, GREEN_STANDARDS_ROUTE, GREEN_LABEL_ROUTE],
});

export const greenStandardsPage = enrichPage({
  id: "green-standards",
  path: GREEN_STANDARDS_ROUTE,
  title: "Standards RTMS | AUROS Green",
  description:
    "Grille RTMS AUROS Green — Réel, Transparent, Mesurable, Sain. Critères pour évaluer un actif vert tokenisé.",
  summary:
    "Standards AUROS Green RTMS : quatre piliers pour évaluer un actif vert tokenisé avant label ou investissement — impact off-chain, traçabilité, métriques reproductibles, structure juridique et risques assumés.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["RTMS standard", "green RWA criteria", "critères RWA vert"],
  intents: ["Critères pour un RWA vert", "Grille d'évaluation token vert"],
  audience: ["auditeurs", "compliance", "promoteurs"],
  facts: [
    { key: "Piliers", value: "Réel · Transparent · Mesurable · Sain" },
  ],
  relatedPaths: [GREEN_ROUTE, GREEN_LABEL_ROUTE],
});

export const greenComparePage = enrichPage({
  id: "green-compare",
  path: GREEN_COMPARE_ROUTE,
  title: "Comparateur projets verts tokenisés (RWA) | AUROS Green",
  description:
    "Comparateur éducatif projets verts tokenisés — références sourcées (Toucan, Powerledger, WePower, Klima, Moss, Energy Web), statuts label honnêtes.",
  summary:
    "Comparateur AUROS Green : lignes manuelles sourcées avec statut label honnête (certified / in_review / reference). Rendements et impacts indicatifs — pas conseil investissement.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: [
    "comparateur RWA vert",
    "green token comparison",
    "REC tokenisés comparer",
    "crédits carbone blockchain",
    "projets solaires tokenisés",
    "standard RTMS",
  ],
  intents: [
    "Comparer tokens carbone",
    "Comparer REC tokenisés",
    "Trouver références marché green RWA",
    "Vérifier statut label projet vert",
  ],
  audience: ["investisseurs impact", "analystes ESG", "family office"],
  facts: [
    { key: "Lignes", value: "6+ références marché sourcées Phase 1" },
    { key: "Registre", value: `${GREEN_REGISTRY_ROUTE} — Verified + pilotes` },
    { key: "Avertissement", value: "Pas un conseil en investissement" },
  ],
  faq: [
    {
      question: "Le comparateur liste-t-il des projets certifiés AUROS ?",
      answer:
        "Uniquement après revue RTMS et publication au registre Verified. Les autres lignes sont des références marché éducatives.",
    },
    {
      question: "Puis-je investir via AUROS Green ?",
      answer:
        "Non. AUROS Green est un standard et un outil de transparence — pas une plateforme d'investissement.",
    },
  ],
  relatedPaths: [GREEN_ROUTE, GREEN_REGISTRY_ROUTE, GREEN_LABEL_ROUTE, "/compare"],
});

export const greenLabelPage = enrichPage({
  id: "green-label",
  path: GREEN_LABEL_ROUTE,
  title: "Label Auros Green Verified | AUROS Green",
  description:
    "Candidature label Auros Green Verified — revue documentaire RTMS.",
  summary:
    "Formulaire candidature label AUROS Green : projet solaire, éolien, REC, carbone, PPA ou autre RWA vert. Revue documentaire RTMS — badge public uniquement après validation.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["label vert RWA", "Auros Green Verified"],
  intents: ["Obtenir label vert tokenisation", "Certifier projet solaire tokenisé"],
  audience: ["promoteurs", "SPV", "fonds impact"],
  facts: [
    { key: "Process", value: "Candidature in-app → revue 5 jours ouvrés (objectif)" },
    { key: "Ne couvre pas", value: "Audit sur site, garantie rendement" },
  ],
  relatedPaths: [GREEN_STANDARDS_ROUTE, GREEN_REGISTRY_ROUTE],
});

export const greenCertificationPage = enrichPage({
  id: "green-certification",
  path: GREEN_CERTIFICATION_ROUTE,
  title: "Certification individuelle Green | AUROS Green",
  description:
    "Parcours certification Green — Academy Fondamentaux d'abord, spécialisation Praticien à venir.",
  summary:
    "Certification individuelle AUROS Green : Academy Fondamentaux gratuit + examen RTMS Praticien (beta) pour le badge expert.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["certification expert green RWA"],
  intents: ["Devenir expert RWA vert"],
  audience: ["consultants", "particuliers"],
  facts: [
    { key: "Étape 1", value: "/academy/fondamentaux — gratuit" },
    { key: "Étape 2", value: "Standards RTMS — lecture obligatoire" },
    { key: "Prochainement", value: "Parcours Praticien avancé (cas dossiers)" },
    { key: "Examen RTMS", value: `${GREEN_PRATICIEN_EXAM_ROUTE} — 8 questions, 7/8 requis` },
  ],
  relatedPaths: [GREEN_ROUTE, "/academy"],
});

export const greenRegistryPage = enrichPage({
  id: "green-registry",
  path: GREEN_REGISTRY_ROUTE,
  title: "Registre AUROS Green",
  description:
    "Registre public projets et experts labellisés AUROS Green.",
  summary:
    "Registre AUROS Green Phase 1 : structure prête, listes vides jusqu'aux premières validations label.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["registre RWA vert", "projets certifiés green"],
  intents: ["Liste projets Auros Green Verified"],
  audience: ["investisseurs", "presse"],
  facts: [{ key: "Statut Phase 3", value: "Premier Verified + cas pilotes RTMS + verify public" }],
  relatedPaths: [GREEN_LABEL_ROUTE, GREEN_ROUTE],
});

export const greenPraticienPage = enrichPage({
  id: "green-praticien",
  path: GREEN_PRATICIEN_ROUTE,
  title: "Praticien Green | AUROS Green",
  description:
    "Parcours Praticien Green — spécialisation audit RTMS, waitlist FR/EN/ES.",
  summary:
    "Track Praticien AUROS Green : prérequis Fondamentaux Academy + RTMS, examen RTMS beta (badge expert 365 j), waitlist parcours avancé.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["certification expert green RWA", "audit RTMS"],
  intents: ["Devenir auditeur RWA vert"],
  audience: ["consultants ESG", "auditeurs"],
  facts: [
    { key: "Statut", value: "Examen RTMS beta ouvert — waitlist parcours avancé" },
    { key: "Examen", value: `${GREEN_PRATICIEN_EXAM_ROUTE} — noindex, vérifiable registre` },
  ],
  relatedPaths: [GREEN_CERTIFICATION_ROUTE, GREEN_PRATICIEN_EXAM_ROUTE, GREEN_STANDARDS_ROUTE, "/academy"],
});

export const greenPraticienExamPage = enrichPage({
  id: "green-praticien-exam",
  path: GREEN_PRATICIEN_EXAM_ROUTE,
  title: "Examen Praticien Green | AUROS Green",
  description: "Quiz RTMS Praticien Green — badge expert vérifiable. FR / EN / ES.",
  summary:
    "Examen RTMS Praticien AUROS Green : 8 questions tirées d'une banque RTMS, 7/8 requis pour le badge expert registre (365 jours).",
  contentType: "landing",
  language: "multi",
  indexable: false,
  lastUpdated: "2026-05-29",
  keywords: ["examen RTMS green", "certification expert RWA vert"],
  intents: ["Passer examen Praticien Green"],
  audience: ["consultants ESG", "auditeurs"],
  facts: [{ key: "Score", value: "7/8 minimum — badge expert registre public" }],
  relatedPaths: [GREEN_PRATICIEN_ROUTE, GREEN_REGISTRY_ROUTE],
});

export const greenGuidePage = enrichPage({
  id: "green-tokenize-surplus",
  path: GREEN_GUIDE_ROUTE,
  title: "Tokeniser un surplus énergétique | AUROS Green",
  description:
    "Guide éducatif tokenisation surplus énergétique — étapes, risques, wizard AUROS.",
  summary:
    "Guide AUROS Green tokenisation surplus : qualifier production, structurer actif, traçabilité on-chain, conformité. Lien wizard actif renouvelable.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["tokeniser surplus solaire", "PPA tokenization guide"],
  intents: ["Comment tokeniser excédent solaire"],
  audience: ["producteurs", "PME énergie"],
  facts: [
    { key: "Wizard", value: "/wizard?asset=renewable" },
  ],
  relatedPaths: [GREEN_ROUTE, GREEN_LABEL_ROUTE, "/wizard"],
});

export const greenMarketPage = enrichPage({
  id: "green-market",
  path: GREEN_MARKET_ROUTE,
  title: "Place de marché mondiale | AUROS Green",
  description:
    "Carte interactive mondiale — producteurs, stockeurs, rechargeurs, consommateurs. Filtres par pays, ville et rayon. Annonces MVP.",
  summary:
    "Marketplace AUROS Green Phase MVP : carte Leaflet mondiale (France, Europe, Amériques, Asie, Afrique), filtres rayon/type, annonces vente/achat, géocodage ville+pays.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-01",
  keywords: [
    "marketplace énergie verte mondiale",
    "tokenisation énergie",
    "carte producteurs solaire international",
    "green energy marketplace map",
  ],
  intents: [
    "Acheter énergie verte à l'international",
    "Vendre surplus solaire",
    "Trouver stockage batterie près d'une ville",
  ],
  audience: ["producteurs", "consommateurs", "collectivités", "fonds impact"],
  facts: [
    { key: "Carte", value: "Leaflet OSM — vue mondiale, zoom adaptatif aux acteurs" },
    { key: "Acteurs démo", value: "50+ acteurs (France + 28 pays pilotes)" },
    { key: "Géolocalisation", value: "Ville + pays — Nominatim avec repli registre" },
    { key: "Annonces", value: "localStorage MVP + seed JSON + soumission registre" },
  ],
  relatedPaths: [GREEN_ROUTE, GREEN_PRODUCERS_ROUTE, GREEN_STORERS_ROUTE, GREEN_MARKET_OFFER_ROUTE, GREEN_MARKET_ACTOR_ROUTE],
});

export const greenMarketOfferPage = enrichPage({
  id: "green-market-offer",
  path: GREEN_MARKET_OFFER_ROUTE,
  title: "Détail annonce marketplace | AUROS Green",
  description:
    "Fiche annonce énergie locale — volume, prix, acteur, localisation et carte. Données indicatives MVP.",
  summary:
    "Pages détail des annonces AUROS Green marketplace : offre vente/achat, acteur lié, carte Leaflet, lien retour marché avec acteur focalisé.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-03",
  keywords: [
    "annonce énergie verte",
    "offre solaire marketplace",
    "green energy listing detail",
  ],
  intents: [
    "Consulter une annonce énergie avant contact",
    "Partager une offre marketplace Green",
  ],
  audience: ["producteurs", "consommateurs", "fonds impact"],
  facts: [
    { key: "URL", value: `${GREEN_MARKET_OFFER_ROUTE}/{id}` },
    { key: "Retour carte", value: `${GREEN_MARKET_ROUTE}?q={acteur}` },
  ],
  relatedPaths: [GREEN_MARKET_ROUTE, GREEN_REGISTER_ROUTE, GREEN_MARKET_ACTOR_ROUTE],
});

export const greenMarketActorPage = enrichPage({
  id: "green-market-actor",
  path: GREEN_MARKET_ACTOR_ROUTE,
  title: "Fiche acteur marketplace | AUROS Green",
  description:
    "Profil acteur énergie locale — capacité, localisation, annonces et contact. Données indicatives MVP.",
  summary:
    "Pages profil acteur AUROS Green marketplace : producteur, stockeur, rechargeur ou consommateur avec carte, annonces liées et contact.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-03",
  keywords: [
    "fiche producteur solaire",
    "acteur énergie verte marketplace",
    "green energy actor profile",
  ],
  intents: [
    "Consulter un acteur avant contact",
    "Voir les annonces d'un producteur",
  ],
  audience: ["producteurs", "consommateurs", "fonds impact"],
  facts: [
    { key: "URL", value: `${GREEN_MARKET_ACTOR_ROUTE}/{id}` },
    { key: "Annonces", value: "Listées sur la fiche acteur si disponibles" },
  ],
  relatedPaths: [GREEN_MARKET_ROUTE, GREEN_MARKET_OFFER_ROUTE, GREEN_REGISTER_ROUTE],
});

export const greenRegisterPage = enrichPage({
  id: "green-register",
  path: GREEN_REGISTER_ROUTE,
  title: "Référencer un acteur | AUROS Green",
  description:
    "Soumettez une fiche producteur, stockeur, rechargeur ou consommateur — revue AUROS sous 48 h, publication sur la carte mondiale.",
  summary:
    "Formulaire référencement acteur AUROS Green : géolocalisation ville+pays, type d'acteur, contact — publication sur la marketplace après modération.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-02",
  keywords: [
    "référencer producteur solaire",
    "marketplace énergie verte inscription",
    "register green energy actor",
  ],
  intents: [
    "Publier ma fiche producteur solaire",
    "Apparaître sur la carte AUROS Green",
    "Référencer stockage batterie",
  ],
  audience: ["producteurs", "stockeurs", "collectivités", "PME énergie"],
  facts: [
    { key: "Revue", value: "48 h ouvrées — modération AUROS" },
    { key: "Carte", value: `${GREEN_MARKET_ROUTE} — vue mondiale Leaflet` },
  ],
  relatedPaths: [GREEN_MARKET_ROUTE, GREEN_ROUTE, GREEN_LABEL_ROUTE],
});

export const greenRtmsAssistantPage = enrichPage({
  id: "green-rtms-assistant",
  path: GREEN_RTMS_ASSISTANT_ROUTE,
  title: "Assistant RTMS préliminaire | AUROS Green",
  description:
    "Grille RTMS indicative — résumé projet + PDF optionnel, score rule-based, disclaimer clair.",
  summary:
    "Assistant RTMS AUROS Green (bêta) : pré-diagnostic rule-based sur résumé texte, checklist 4 piliers, pas de certification automatique.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-02",
  keywords: ["assistant RTMS", "preliminary green audit", "RWA vert diagnostic"],
  intents: ["Évaluer mon dossier RTMS avant label", "Checklist conformité green RWA"],
  audience: ["promoteurs", "consultants ESG"],
  facts: [
    { key: "Statut", value: "Indicatif — revue humaine pour label Verified" },
    { key: "Entrée", value: "Résumé 12+ mots + PDF optionnel (non stocké)" },
  ],
  relatedPaths: [GREEN_STANDARDS_ROUTE, GREEN_LABEL_ROUTE, GREEN_ROUTE],
});

export const greenProducersPage = enrichPage({
  id: "green-producers",
  path: GREEN_PRODUCERS_ROUTE,
  title: "Producteurs | AUROS Green",
  description: "Liste producteurs solaire, éolien, hydro — place de marché mondiale AUROS Green.",
  summary: "Producteurs énergie renouvelable référencés sur la carte mondiale AUROS Green.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-31",
  keywords: ["producteur solaire tokenisé"],
  intents: ["Trouver producteur local"],
  audience: ["acheteurs", "SPV"],
  facts: [{ key: "Badge", value: "Auros Green Verified sur dossiers certifiés" }],
  relatedPaths: [GREEN_MARKET_ROUTE, GREEN_LABEL_ROUTE],
});

export const greenStorersPage = enrichPage({
  id: "green-storers",
  path: GREEN_STORERS_ROUTE,
  title: "Stockeurs | AUROS Green",
  description: "Batteries et stockage — AUROS Green marketplace.",
  summary: "Acteurs stockage BESS sur AUROS Green.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-31",
  keywords: ["stockage batterie énergie"],
  intents: ["Trouver capacité stockage"],
  audience: ["producteurs", "réseau"],
  facts: [],
  relatedPaths: [GREEN_MARKET_ROUTE],
});

export const greenChargersPage = enrichPage({
  id: "green-chargers",
  path: GREEN_CHARGERS_ROUTE,
  title: "Rechargeurs | AUROS Green",
  description: "Bornes VE — AUROS Green marketplace.",
  summary: "Infrastructure recharge véhicule électrique.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-31",
  keywords: ["borne recharge VE"],
  intents: ["Sourcer recharge verte"],
  audience: ["flottes", "collectivités"],
  facts: [],
  relatedPaths: [GREEN_MARKET_ROUTE],
});

export const greenConsumersPage = enrichPage({
  id: "green-consumers",
  path: GREEN_CONSUMERS_ROUTE,
  title: "Consommateurs | AUROS Green",
  description: "Acheteurs et sites consommateurs — AUROS Green marketplace.",
  summary: "Demande énergie locale industrielle et tertiaire.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-31",
  keywords: ["acheteur énergie renouvelable"],
  intents: ["Publier demande achat énergie"],
  audience: ["industrie", "campus"],
  facts: [],
  relatedPaths: [GREEN_MARKET_ROUTE],
});

export const greenPages: AiFirstPage[] = [
  greenHomePage,
  greenAboutPage,
  greenMarketPage,
  greenMarketOfferPage,
  greenMarketActorPage,
  greenRegisterPage,
  greenProducersPage,
  greenStorersPage,
  greenChargersPage,
  greenConsumersPage,
  greenStandardsPage,
  greenComparePage,
  greenRtmsAssistantPage,
  greenLabelPage,
  greenCertificationPage,
  greenPraticienPage,
  greenPraticienExamPage,
  greenRegistryPage,
  greenGuidePage,
];
