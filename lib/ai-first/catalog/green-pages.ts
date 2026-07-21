import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";
import {
  GREEN_ABOUT_ROUTE,
  GREEN_CERTIFICATION_ROUTE,
  GREEN_CHARGERS_ROUTE,
  GREEN_COMPARE_ROUTE,
  GREEN_CSRD_CHECK_ROUTE,
  GREEN_IMPACT_REPORT_ROUTE,
  GREEN_IMPACT_REPORT_READY_ROUTE,
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
  GREEN_REGISTRY_PROJECT_ROUTE,
  GREEN_REGISTER_ROUTE,
  GREEN_ROUTE,
  GREEN_RTMS_ASSISTANT_ROUTE,
  GREEN_ASSISTANT_ROUTE,
  GREEN_STANDARDS_ROUTE,
  GREEN_STORERS_ROUTE,
} from "@/lib/green";

export const greenHomePage = enrichPage({
  id: "green",
  path: GREEN_ROUTE,
  title: "Tokenisation verte & énergie locale | AUROS Green",
  description:
    "AUROS Green — Structurez vos actifs d'énergie renouvelable pour la tokenisation MiCA.",
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
    GREEN_CSRD_CHECK_ROUTE,
    GREEN_IMPACT_REPORT_ROUTE,
    GREEN_LABEL_ROUTE,
    "/compare",
    "/developers",
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
  title: "Registre public projets AUROS Green Verified",
  description:
    "Registre public des projets et experts labellisés AUROS Green — statuts Verified RTMS et cas pilotes éducatifs, vérifiables en ligne.",
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
  relatedPaths: [GREEN_LABEL_ROUTE, GREEN_ROUTE, GREEN_REGISTRY_PROJECT_ROUTE],
});

export const greenRegistryProjectPage = enrichPage({
  id: "green-registry-project",
  path: GREEN_REGISTRY_PROJECT_ROUTE,
  title: "Fiche projet registre | AUROS Green",
  description:
    "Détail projet labellisé AUROS Green — statut RTMS, localisation, description et lien verify.",
  summary:
    "Pages détail des projets du registre public AUROS Green : Verified ou cas pilote RTMS, avec synthèse localisée FR/EN/ES.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-03",
  keywords: ["projet Auros Green Verified", "registre RWA vert détail"],
  intents: ["Consulter un projet labellisé AUROS Green"],
  audience: ["investisseurs", "presse", "promoteurs"],
  facts: [{ key: "URL", value: `${GREEN_REGISTRY_PROJECT_ROUTE}/{id}` }],
  relatedPaths: [GREEN_REGISTRY_ROUTE, GREEN_LABEL_ROUTE, GREEN_ROUTE],
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

export const greenCsrdCheckPage = enrichPage({
  id: "green-csrd-check",
  path: GREEN_CSRD_CHECK_ROUTE,
  title: "CSRD Checker — scope et préparation | AUROS Green",
  description:
    "Six questions pour estimer votre scope CSRD et score de préparation — gratuit, indicatif, ~2 min.",
  summary:
    "CSRD Checker AUROS Green : estimation du scope Corporate Sustainability Reporting Directive, score de préparation et CTA wizard actifs verts.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-01",
  keywords: ["CSRD checker", "scope CSRD", "ESRS préparation", "EU Taxonomy entreprise"],
  intents: [
    "Savoir si mon entreprise est en scope CSRD",
    "Préparer mon rapport de durabilité ESRS",
    "Lier CSRD et actifs verts tokenisés",
  ],
  audience: ["CFO", "responsables ESG", "PME cotées", "family office"],
  facts: [
    { key: "Durée", value: "~2 minutes — 6 questions" },
    { key: "Suite", value: "/wizard?type=green&asset=renewable — Green Score EU Taxonomy" },
    { key: "Impact Report", value: `${GREEN_IMPACT_REPORT_ROUTE} — PDF EU Taxonomy + RTMS` },
  ],
  faq: [
    {
      question: "Qu'est-ce que la CSRD ?",
      answer:
        "La Corporate Sustainability Reporting Directive (CSRD) impose à de nombreuses entreprises de l'UE de publier un rapport de durabilité audité selon les standards ESRS.",
    },
    {
      question: "Ce checker remplace-t-il un conseil juridique ?",
      answer:
        "Non. Il estime si votre entreprise est probablement en scope CSRD et votre niveau de préparation — validez avec un auditeur ou conseil ESG.",
    },
    {
      question: "Que faire après le test CSRD ?",
      answer:
        "Utilisez le wizard AUROS Green pour scorer l'alignement EU Taxonomy de vos actifs verts, puis commandez un Impact Report PDF sur /green/impact-report.",
    },
  ],
  relatedPaths: [GREEN_ROUTE, GREEN_STANDARDS_ROUTE, GREEN_IMPACT_REPORT_ROUTE, "/wizard", "/developers"],
});

export const greenImpactReportPage = enrichPage({
  id: "green-impact-report",
  path: GREEN_IMPACT_REPORT_ROUTE,
  title: "Rapport d'impact Green — PDF EU Taxonomy + RTMS | AUROS Green",
  description:
    "Commandez un rapport PDF institutionnel EU Taxonomy + RTMS depuis votre dossier Green — indicatif, prêt à partager.",
  summary:
    "Rapport d'impact AUROS Green : synthèse PDF EU Taxonomy et RTMS depuis wizard ou CSRD Checker — téléchargement immédiat après paiement Stripe.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-13",
  keywords: [
    "rapport impact green",
    "EU Taxonomy PDF",
    "RTMS report",
    "green impact report",
  ],
  intents: [
    "Commander un rapport d'impact EU Taxonomy",
    "Obtenir un PDF RTMS pour mon dossier vert",
    "Partager un rapport ESG interne",
  ],
  audience: ["CFO", "responsables ESG", "family office", "promoteurs"],
  facts: [
    { key: "Formats", value: "Standard 49 € · Institutionnel 199 €" },
    { key: "Livraison", value: "Téléchargement PDF immédiat après paiement" },
    { key: "Entrée", value: `${GREEN_CSRD_CHECK_ROUTE} ou wizard Green` },
  ],
  faq: [
    {
      question: "Que contient le rapport d'impact Green ?",
      answer:
        "Une synthèse PDF EU Taxonomy + RTMS depuis votre dossier wizard ou CSRD Checker — indicatif, prêt à partager en interne avec votre conseil ESG.",
    },
    {
      question: "Quelle différence entre Standard et Institutionnel ?",
      answer:
        "Standard 49 € : synthèse concise pour équipes opérationnelles. Institutionnel 199 € : format étendu pour comités ESG et documentation externe.",
    },
    {
      question: "Le rapport remplace-t-il un audit CSRD ?",
      answer:
        "Non. Document indicatif — validez avec votre auditeur ou conseil ESG avant toute publication réglementaire CSRD/ESRS.",
    },
  ],
  relatedPaths: [GREEN_CSRD_CHECK_ROUTE, GREEN_ROUTE, "/wizard?type=green", "/developers"],
});

export const greenImpactReportReadyPage = enrichPage({
  id: "green-impact-report-ready",
  path: GREEN_IMPACT_REPORT_READY_ROUTE,
  title: "Télécharger votre rapport d'impact | AUROS Green",
  description: "Page post-paiement — téléchargement du rapport d'impact Green PDF.",
  summary:
    "Confirmation paiement rapport d'impact AUROS Green — génération et téléchargement PDF EU Taxonomy + RTMS.",
  contentType: "landing",
  language: "multi",
  indexable: false,
  lastUpdated: "2026-06-13",
  keywords: ["télécharger rapport impact green"],
  intents: ["Télécharger mon rapport d'impact après paiement"],
  audience: ["acheteurs rapport impact"],
  facts: [{ key: "Accès", value: "Session Stripe confirmée requise" }],
  relatedPaths: [GREEN_IMPACT_REPORT_ROUTE, GREEN_CSRD_CHECK_ROUTE],
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

export const greenAssistantPage = enrichPage({
  id: "green-assistant",
  path: GREEN_ASSISTANT_ROUTE,
  title: "Assistant Green personnalisé | AUROS",
  description:
    "Chatbot Green gratuit et personnalisé — rôle, actif, région. Aide clients RWA eau/énergie ; pas de conseil financier.",
  summary:
    "Assistant IA AUROS Green (freemium) : profil court + chat RAG pour questions Green/RWA. Brochures et mails en brouillon humain ; API Growth et desk entreprise en option payante.",
  contentType: "landing",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-21",
  keywords: ["assistant Green IA", "chatbot RWA vert", "aide client AUROS Green"],
  intents: ["Poser une question Green", "Comprendre RTMS / label", "Personnaliser mon parcours"],
  audience: ["promoteurs", "consultants ESG", "particuliers", "fonds impact"],
  facts: [
    { key: "Accès", value: "Gratuit — profil local navigateur" },
    { key: "Limite", value: "Indicatif — pas de certification auto ni envoi mail auto" },
  ],
  relatedPaths: [GREEN_ROUTE, GREEN_RTMS_ASSISTANT_ROUTE, GREEN_STANDARDS_ROUTE, "/copilot"],
});

export const greenProducersPage = enrichPage({
  id: "green-producers",
  path: GREEN_PRODUCERS_ROUTE,
  title: "Producteurs solaire & éolien | AUROS Green Marketplace",
  description:
    "Annuaire producteurs solaire, éolien et hydro sur la carte mondiale AUROS Green — filtres pays, capacité et statut label RTMS.",
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
  title: "Stockeurs BESS & batteries | AUROS Green Marketplace",
  description:
    "Acteurs stockage batterie (BESS) référencés sur la marketplace AUROS Green — capacité, localisation et annonces achat/vente.",
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
  title: "Bornes recharge VE | AUROS Green Marketplace",
  description:
    "Infrastructure recharge véhicule électrique sur la carte AUROS Green — flottes, collectivités et sites tertiaires.",
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
  title: "Consommateurs énergie locale | AUROS Green Marketplace",
  description:
    "Sites industriels et tertiaires acheteurs d'énergie renouvelable — demande locale sur la marketplace AUROS Green.",
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
  greenCsrdCheckPage,
  greenImpactReportPage,
  greenImpactReportReadyPage,
  greenRtmsAssistantPage,
  greenAssistantPage,
  greenLabelPage,
  greenCertificationPage,
  greenPraticienPage,
  greenPraticienExamPage,
  greenRegistryPage,
  greenRegistryProjectPage,
  greenGuidePage,
];
