import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";
import {
  GREEN_BLOG_ROUTE,
  GREEN_FAQ_ROUTE,
  GREEN_HOW_IT_WORKS_ROUTE,
  GREEN_LABEL_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_REGISTER_ROUTE,
  GREEN_ROUTE,
  GREEN_RTMS_ASSISTANT_ROUTE,
  GREEN_STANDARDS_ROUTE,
  AUROS_FAQ_ROUTE,
  AUROS_RESOURCES_ROUTE,
  AUROS_WIZARD_ROUTE,
} from "@/lib/green/constants";
import { GREEN_FAQ_ITEMS } from "@/lib/seo/content/green-faq";
import { MAIN_FAQ_ITEMS } from "@/lib/seo/content/main-faq";
import { BLOG_ARTICLES, blogArticlePath, BLOG_ROUTE } from "@/lib/blog";
import {
  GREEN_BLOG_ARTICLES,
  greenBlogArticlePath,
} from "@/lib/green/blog/articles";

export const mainFaqPage = enrichPage({
  id: "faq",
  path: AUROS_FAQ_ROUTE,
  title: "FAQ | AUROS — Tokenisation RWA",
  description:
    "Questions fréquentes sur AUROS : wizard gratuit, score admission, juridictions, Starter Kit, confidentialité RGPD et lien avec AUROS Green.",
  summary:
    "FAQ AUROS principale — wizard, dossier actif, comparateur juridictions, Starter Kit 5 000 €, RGPD, différences avec AUROS Green.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: [
    "FAQ AUROS",
    "tokenisation RWA questions",
    "wizard gratuit",
    "Starter Kit juridiction",
    "score admission",
  ],
  intents: [
    "AUROS est-il gratuit ?",
    "Différence wizard et Starter Kit",
    "Confidentialité données AUROS",
  ],
  audience: ["émetteurs B2B", "promoteurs", "CFO", "family office"],
  facts: [
    { key: "Wizard", value: "Gratuit — /wizard" },
    { key: "Starter Kit", value: "5 000 € HT — /jurisdictions/starter-kit" },
    { key: "Juridictions", value: "8 comparées" },
  ],
  faq: MAIN_FAQ_ITEMS,
  breadcrumbs: [],
  relatedPaths: ["/", AUROS_RESOURCES_ROUTE, "/how-it-works", "/wizard", GREEN_ROUTE],
});

export const resourcesPage = enrichPage({
  id: "ressources",
  path: AUROS_RESOURCES_ROUTE,
  title: "Ressources | Guides et FAQ AUROS",
  description:
    "Hub ressources AUROS : FAQ, guides tokenisation, comparateurs RWA, Academy et écosystème Green — contenus éducatifs FR/EN/ES.",
  summary:
    "Page hub liens vers FAQ AUROS, how-it-works, discover, trust, Academy, Green FAQ, blog Green et comparateurs live.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: [
    "ressources RWA",
    "guides tokenisation",
    "AUROS documentation",
    "apprendre tokenisation actifs réels",
  ],
  intents: ["Où trouver de l'aide AUROS", "Guides tokenisation RWA"],
  audience: ["émetteurs", "consultants", "investisseurs"],
  facts: [
    { key: "FAQ", value: AUROS_FAQ_ROUTE },
    { key: "Outils Pilier 1", value: "/tools — MiCA · Rendement · Juridiction · Coût" },
    { key: "Comparateur", value: "/compare — 120+ produits RWA" },
    { key: "RWA Index", value: "/data/rwa-index — indice mensuel rendements" },
    { key: "Green Index", value: "/data/green-index — top actifs climatiques CQS + Watt" },
    { key: "Rapport trimestriel", value: "/data/state-of-rwa-issuers — State of RWA Issuers PDF" },
    { key: "Machine-readable", value: "/llms.txt · /ai-first/index.json" },
  ],
  relatedPaths: [
    AUROS_FAQ_ROUTE,
    "/glossary",
    BLOG_ROUTE,
    "/tools",
    "/data/rwa-index",
    "/data/green-index",
    "/data/state-of-rwa-issuers",
    "/how-it-works",
    "/discover",
    "/trust",
    "/academy",
    GREEN_ROUTE,
    GREEN_FAQ_ROUTE,
    GREEN_BLOG_ROUTE,
  ],
});

export const howItWorksPage = enrichPage({
  id: "how-it-works",
  path: "/how-it-works",
  title: "Comment ça marche | AUROS",
  description:
    "Trois étapes jusqu'au dossier RWA : décrire l'actif, score & dossier IA, soumission à l'équipe AUROS.",
  summary:
    "Parcours AUROS en trois étapes — wizard 4 parties, score admission, data room 15 documents, studio réglementaire.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: ["comment tokeniser actif", "processus RWA AUROS", "wizard étapes"],
  intents: ["Comment fonctionne AUROS", "Étapes tokenisation"],
  audience: ["émetteurs", "promoteurs"],
  facts: [
    { key: "Étapes", value: "3 visibles — 4 parties wizard" },
    { key: "Durée", value: "~15 minutes indicatif" },
  ],
  relatedPaths: ["/wizard", "/estimate", AUROS_FAQ_ROUTE],
});

export const discoverPage = enrichPage({
  id: "discover",
  path: "/discover",
  title: "Découvrir AUROS | Plateforme RWA",
  description:
    "Univers d'actifs, conformité, livrables dossier — approfondissez AUROS avant de lancer votre wizard.",
  summary:
    "Page discover : univers actifs RWA, conformité MiCA, livrables dossier — profondeur avant wizard.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: ["découvrir AUROS", "plateforme RWA", "actifs tokenisables"],
  intents: ["Explorer AUROS avant de commencer"],
  audience: ["curieux", "émetteurs"],
  facts: [{ key: "CTA", value: "/wizard" }],
  relatedPaths: ["/", "/how-it-works", "/trust"],
});

export const trustPage = enrichPage({
  id: "trust",
  path: "/trust",
  title: "Confiance & conformité | AUROS",
  description:
    "AUROS — Sécurité, conformité RGPD et vérification humaine pour vos dossiers RWA institutionnels.",
  summary:
    "Transparence réglementaire AUROS : MiCA, RGPD UE, KYC/AML, processus diagnostic → juridiction → revue humaine, analyses indicatives — counsel requis avant émission.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-09",
  keywords: ["MiCA RWA", "RGPD tokenisation", "conformité AUROS"],
  intents: ["AUROS est-il conforme MiCA", "Sécurité données RWA"],
  audience: ["compliance", "CFO", "investisseurs"],
  facts: [
    { key: "Hébergement", value: "UE" },
    { key: "Processus", value: "3 étapes — diagnostic, juridiction, revue" },
    { key: "Disclaimer", value: "Analyses indicatives — pas conseil juridique" },
  ],
  relatedPaths: ["/privacy", "/legal", "/jurisdictions", "/pricing"],
});

export const estimatePage = enrichPage({
  id: "estimate",
  path: "/estimate",
  title: "Score de préparation | AUROS",
  description:
    "Estimez en une phrase si votre actif est prêt pour la tokenisation — score indicatif instantané, sans compte.",
  summary:
    "Widget score readiness AUROS — une phrase, résultat indicatif immédiat, sans inscription.",
  contentType: "tool",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: ["score tokenisation", "readiness RWA", "test actif tokenisable"],
  intents: ["Mon actif est-il prêt à tokeniser"],
  audience: ["émetteurs", "curieux"],
  facts: [{ key: "Compte", value: "Non requis" }],
  relatedPaths: ["/wizard", "/how-it-works"],
});

export const rwaIndexPage = enrichPage({
  id: "rwa-index",
  path: "/data/rwa-index",
  title: "AUROS RWA Index — Rendements RWA Europe | Monthly yields",
  description:
    "Indice mensuel AUROS : APY moyens par classe d'actif tokenisé (obligations, stablecoins, immo, private credit), volume produits et juridictions actives — source indicative pour presse et analystes.",
  summary:
    "Pilier SEO 4 — AUROS RWA Index mensuel : dashboard rendements par catégorie depuis /compare, 8 juridictions, export CSV, méthodologie transparente, FAQ et Dataset JSON-LD.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-11",
  keywords: [
    "AUROS RWA Index",
    "RWA yields Europe",
    "tokenized asset returns index",
    "indice rendements RWA",
    "rendements actifs tokenisés Europe",
    "monthly RWA yields",
  ],
  intents: [
    "Quels sont les rendements RWA en Europe",
    "Indice mensuel tokenisation actifs réels",
    "RWA yield index Europe",
  ],
  audience: ["journalistes", "analystes", "family office", "émetteurs", "LLM crawlers"],
  facts: [
    { key: "Fréquence", value: "Mensuel — édition du mois en cours" },
    { key: "Sources", value: "Hub /compare (120+ produits) + /jurisdictions (8 places)" },
    { key: "Export", value: "CSV gratuit depuis la page" },
    { key: "Schema", value: "Dataset + FAQPage JSON-LD" },
    { key: "Pilier SEO", value: "Données Pilier 4 — citation presse" },
  ],
  faq: [
    {
      question: "Qu'est-ce que l'AUROS RWA Index ?",
      answer:
        "Indice mensuel agrégant APY par classe d'actif tokenisé depuis le comparateur AUROS — source indicative, pas conseil en investissement.",
    },
    {
      question: "Comment télécharger les données ?",
      answer: "Export CSV gratuit sur /data/rwa-index avec date d'édition et statistiques par classe.",
    },
  ],
  relatedPaths: [
    "/compare",
    "/data/state-of-rwa-issuers",
    "/data/green-index",
    "/tools",
    "/tools/yield-calculator",
    "/blog",
    "/glossary",
    "/jurisdictions",
    AUROS_RESOURCES_ROUTE,
    "/wizard",
  ],
});

export const greenIndexPage = enrichPage({
  id: "green-index",
  path: "/data/green-index",
  title: "AUROS Green RWA Index — Top actifs climatiques tokenisés EU",
  description:
    "Indice mensuel AUROS : top 20 actifs Green RWA en Europe — Taxonomy EU, Carbon Quality Score (CQS) et Watt Score. Export CSV gratuit, méthodologie transparente.",
  summary:
    "Pilier SEO Green — AUROS Green RWA Index mensuel : classement composite CQS + Taxonomy + Watt, segments par type, export CSV, FAQ et Dataset JSON-LD.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-27",
  keywords: [
    "AUROS Green Index",
    "Green RWA Index Europe",
    "Carbon Quality Score",
    "Watt Score",
    "tokenized climate assets index",
    "indice actifs climatiques tokenisés",
  ],
  intents: [
    "Quels sont les meilleurs actifs Green RWA en Europe",
    "Indice mensuel tokenisation climat",
    "Carbon Quality Score crédits carbone",
  ],
  audience: ["journalistes", "analystes", "family office", "émetteurs", "LLM crawlers"],
  facts: [
    { key: "Fréquence", value: "Mensuel — édition du mois en cours" },
    { key: "Sources", value: "Comparateur Green AUROS + profils CQS/Watt indicatifs" },
    { key: "Export", value: "CSV gratuit depuis la page · API /api/green/index" },
    { key: "CQS API", value: "GET /api/green/carbon-quality/[id] — lecture gratuite" },
    { key: "Schema", value: "Dataset + FAQPage JSON-LD" },
  ],
  faq: [
    {
      question: "Qu'est-ce que l'AUROS Green RWA Index ?",
      answer:
        "Classement mensuel indicatif des actifs climatiques tokenisés en Europe, basé sur Taxonomy EU, Carbon Quality Score et Watt Score — pas un conseil en investissement.",
    },
    {
      question: "Comment télécharger les données ?",
      answer: "Export CSV gratuit sur /data/green-index ou feed JSON sur /api/green/index.",
    },
  ],
  relatedPaths: [
    GREEN_ROUTE,
    "/green/compare",
    "/data/rwa-index",
    AUROS_RESOURCES_ROUTE,
    "/wizard",
  ],
});

export const stateOfRwaIssuersPage = enrichPage({
  id: "state-of-rwa-issuers",
  path: "/data/state-of-rwa-issuers",
  title: "State of RWA Issuers — Rapport trimestriel AUROS | Quarterly report",
  description:
    "Rapport trimestriel AUROS sur les émetteurs RWA en Europe : mix d'actifs, signaux MiCA indicatifs, blocages courants et juridictions étudiées. PDF gratuit avec email — Q2 2026.",
  summary:
    "Pilier SEO 4 — State of RWA Issuers trimestriel : stats RWA Index + tendances wizard indicatives, email gate PDF, Report + FAQPage JSON-LD, angle propriétaire AUROS.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-11",
  keywords: [
    "State of RWA Issuers",
    "rapport émetteurs RWA",
    "RWA issuer report Europe",
    "tokenization quarterly report",
    "MiCA readiness report",
    "rapport trimestriel tokenisation",
  ],
  intents: [
    "Rapport émetteurs RWA Europe",
    "State of RWA issuers quarterly",
    "Télécharger rapport tokenisation PDF",
  ],
  audience: ["émetteurs", "journalistes", "analystes", "CFO", "compliance", "family office"],
  facts: [
    { key: "Édition", value: "Q2 2026 — trimestriel" },
    { key: "Sources", value: "RWA Index + estimations wizard AUROS" },
    { key: "Accès", value: "PDF gratuit — email gate (nom + email)" },
    { key: "Schema", value: "Report + FAQPage JSON-LD" },
    { key: "Pilier SEO", value: "Données Pilier 4 — leads + backlinks" },
  ],
  faq: [
    {
      question: "Comment obtenir le PDF ?",
      answer:
        "Renseignez nom et email sur /data/state-of-rwa-issuers — le téléchargement se débloque immédiatement.",
    },
    {
      question: "Les stats wizard sont-elles auditées ?",
      answer:
        "Non — estimations internes indicatives, clairement étiquetées. Seul le RWA Index provient du comparateur public.",
    },
  ],
  relatedPaths: [
    "/data/rwa-index",
    "/compare",
    "/tools/mica-checker",
    "/tools/jurisdiction-picker",
    "/wizard",
    "/blog",
    AUROS_RESOURCES_ROUTE,
  ],
});

export const developersPage = enrichPage({
  id: "developers",
  path: "/developers",
  title: "AUROS Protocol API | The RWA Intelligence Layer",
  description:
    "API publique AUROS Protocol v1 sur getauros.com et api.getauros.com — score MiCA, catalogue RWA, compare, juridictions et checklist. Clé gratuite 100 req/mois, playground intégré.",
  summary:
    "Hub développeurs AUROS Protocol — quickstart curl, endpoints /api/v1/score, products, compare, jurisdictions, checklist ; base URL api.getauros.com/v1 ou getauros.com/api/v1.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-13",
  keywords: [
    "AUROS Protocol API",
    "api.getauros.com",
    "RWA intelligence API",
    "MiCA scoring API",
    "tokenisation API",
  ],
  intents: [
    "Comment intégrer le score MiCA AUROS",
    "API catalogue RWA tokenisés",
    "Base URL api.getauros.com",
  ],
  audience: ["développeurs", "fintech", "émetteurs", "intégrateurs"],
  facts: [
    { key: "Version", value: "1.0" },
    { key: "Base URL", value: "https://api.getauros.com/v1/* (alias getauros.com/api/v1/*)" },
    { key: "Hub", value: "api.getauros.com/ → /developers" },
    { key: "Tier gratuit", value: "100 requêtes/mois" },
    { key: "Playground", value: "/developers#playground" },
    { key: "Postman", value: "/auros-postman.json" },
    { key: "OpenAPI", value: "/auros-openapi.yaml" },
  ],
  relatedPaths: [
    "/developers/docs",
    "/developers/changelog",
    "/green/csrd-check",
    "/green/impact-report",
    "/tools/mica-checker",
    "/compare",
    "/wizard",
    AUROS_RESOURCES_ROUTE,
    "/status",
  ],
});

export const statusPage = enrichPage({
  id: "status",
  path: "/status",
  title: "AUROS API Status | System health",
  description:
    "Public status page for AUROS Protocol API — uptime checks for scoring, catalog, jurisdictions, and key storage.",
  summary:
    "Page statut AUROS — santé API Protocol, version, commit déployé, endpoint JSON /api/v1/status.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-12",
  keywords: ["AUROS status", "API uptime", "system health"],
  intents: ["Is AUROS API up", "AUROS API status page"],
  audience: ["développeurs", "intégrateurs"],
  facts: [
    { key: "JSON endpoint", value: "/api/v1/status" },
    { key: "Refresh", value: "60 seconds" },
  ],
  relatedPaths: ["/developers", "/developers/docs"],
});

export const toolsHubPage = enrichPage({
  id: "tools",
  path: "/tools",
  title: "Outils tokenisation RWA | AUROS — RWA tools",
  description:
    "Hub outils gratuits AUROS : test MiCA, calculateur rendement, sélecteur juridiction et estimateur coût tokenisation — indicatifs, sans compte, FR/EN/ES.",
  summary:
    "Page hub Pilier SEO — 4 outils tokenisation RWA gratuits : MiCA checker, yield calculator, jurisdiction picker, cost estimator ; liens /compare, /glossary, /wizard.",
  contentType: "tool",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-11",
  keywords: [
    "outils tokenisation",
    "RWA tools",
    "outils RWA gratuits",
    "tokenization tools",
    "herramientas tokenización RWA",
    "MiCA checker",
    "calculateur rendement RWA",
  ],
  intents: [
    "Quels outils pour préparer une tokenisation RWA",
    "Outils gratuits tokenisation actifs réels",
    "RWA tokenization tools free",
  ],
  audience: ["émetteurs", "CFO", "compliance", "investisseurs", "promoteurs"],
  facts: [
    { key: "Outils", value: "4 — MiCA · Rendement · Juridiction · Coût" },
    { key: "Données", value: "/data/rwa-index mensuel · /data/state-of-rwa-issuers trimestriel" },
    { key: "Compte", value: "Non requis" },
    { key: "Nature", value: "Indicatif — counsel requis avant émission" },
    { key: "Pilier SEO", value: "Hub outils Pilier 1" },
  ],
  relatedPaths: [
    "/tools/mica-checker",
    "/tools/yield-calculator",
    "/tools/jurisdiction-picker",
    "/tools/cost-estimator",
    "/data/rwa-index",
    "/data/state-of-rwa-issuers",
    "/compare",
    "/glossary",
    "/wizard",
    AUROS_RESOURCES_ROUTE,
    "/jurisdictions",
  ],
});

export const micaCheckerPage = enrichPage({
  id: "mica-checker",
  path: "/tools/mica-checker",
  title: "Test MiCA — Suis-je prêt ? | AUROS",
  description:
    "Vérifiez en 5 questions votre maturité MiCA avant une tokenisation RWA en Europe — score indicatif 0-100, sans compte.",
  summary:
    "Outil SEO Pilier 1 — test MiCA gratuit : émetteur, classe d'actif, lien UE, livre blanc, profil investisseur → score indicatif et CTA wizard/estimate.",
  contentType: "tool",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-11",
  keywords: [
    "MiCA compliance check",
    "am I MiCA ready",
    "test MiCA RWA",
    "conformité crypto actifs UE",
  ],
  intents: [
    "Suis-je prêt pour MiCA",
    "Test conformité MiCA gratuit",
    "MiCA readiness score",
  ],
  audience: ["émetteurs", "compliance", "CFO", "promoteurs RWA"],
  facts: [
    { key: "Durée", value: "~2 min · 5 questions" },
    { key: "Score", value: "0–100 indicatif — non juridique" },
    { key: "Dimensions", value: "Émetteur, classe d'actif, lien UE, livre blanc, profil investisseur" },
    { key: "Pilier SEO", value: "Outils gratuits Pilier 1 #1" },
    { key: "Complément", value: "/wizard (partie Conformité) · /tools/jurisdiction-picker" },
  ],
  faq: [
    {
      question: "Qu'est-ce que le test MiCA AUROS ?",
      answer:
        "Cinq questions sur structure, actif, UE, livre blanc et investisseurs — score indicatif pour prioriser la préparation MiCA.",
    },
    {
      question: "Ce score remplace-t-il un avis juridique ?",
      answer:
        "Non — counsel spécialisé requis avant toute offre. Le test oriente uniquement la préparation.",
    },
  ],
  relatedPaths: [
    "/tools",
    "/wizard",
    "/estimate",
    "/jurisdictions",
    "/trust",
    "/compare",
    "/tools/yield-calculator",
    "/tools/jurisdiction-picker",
    "/tools/cost-estimator",
  ],
});

export const yieldCalculatorPage = enrichPage({
  id: "yield-calculator",
  path: "/tools/yield-calculator",
  title: "Calculateur rendement RWA — Tokenized asset return | AUROS",
  description:
    "Estimez le rendement annuel indicatif d'un actif tokenisé (T-Bills, stablecoins, immobilier, private credit) vs inflation UE — gratuit, basé sur le comparateur AUROS.",
  summary:
    "Outil SEO Pilier 1 — calculateur de rendement RWA : montant EUR, classe d'actif, durée → fourchette APY hub /compare, barre vs inflation, CTA compare/wizard/estimate.",
  contentType: "tool",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-11",
  keywords: [
    "RWA yield calculator",
    "tokenized asset return",
    "calculateur rendement RWA",
    "rendement actif tokenisé",
    "APY stablecoin immobilier",
  ],
  intents: [
    "Quel rendement pour un RWA tokenisé",
    "Calculateur rendement actif réel",
    "Comparer rendement RWA et inflation",
  ],
  audience: ["investisseurs", "family office", "CFO", "curieux RWA"],
  facts: [
    { key: "Données", value: "Moyennes hub /compare — 120+ produits RWA live" },
    { key: "Classes", value: "T-Bills, stablecoins, immo, private credit, commodities, green" },
    { key: "Inflation", value: "Benchmark UE ~2,5 % illustratif" },
    { key: "Pilier SEO", value: "Outils gratuits Pilier 1 #2" },
    { key: "Complément", value: "/compare · /tools/jurisdiction-picker · /tools/mica-checker" },
  ],
  faq: [
    {
      question: "Qu'est-ce que le calculateur de rendement RWA AUROS ?",
      answer:
        "Estimation indicative par classe d'actif tokenisée et montant EUR — fourchettes issues du comparateur AUROS.",
    },
    {
      question: "Les rendements affichés sont-ils garantis ?",
      answer:
        "Non — APY variables selon plateforme et marché. Pas un conseil en investissement.",
    },
  ],
  relatedPaths: [
    "/tools",
    "/compare",
    "/tools/mica-checker",
    "/jurisdictions",
    "/wizard",
    "/estimate",
    "/tools/jurisdiction-picker",
  ],
});

export const jurisdictionPickerPage = enrichPage({
  id: "jurisdiction-picker",
  path: "/tools/jurisdiction-picker",
  title: "Meilleure juridiction pour tokeniser | AUROS",
  description:
    "Où tokeniser en Europe et au-delà ? Curseurs délai, coût et fiscalité → top 3 juridictions indicatives (DIFC, Luxembourg, Singapour, Suisse…) — gratuit.",
  summary:
    "Outil SEO Pilier 1 #3 — sélecteur juridiction RWA : 3 curseurs (rapidité, budget, fiscalité) + filtre actif → top 3 parmi 8 juridictions AUROS avec rationale une ligne ; CTA /jurisdictions, /wizard, /estimate, /tools/mica-checker.",
  contentType: "tool",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-11",
  keywords: [
    "best jurisdiction tokenization",
    "where to tokenize EU",
    "meilleure juridiction tokenisation",
    "où tokeniser RWA",
    "jurisdiction picker RWA",
    "DIFC Luxembourg Singapour comparateur",
  ],
  intents: [
    "Quelle juridiction pour tokeniser mon actif",
    "Où tokeniser en Europe",
    "Comparer délai coût fiscalité tokenisation",
  ],
  audience: ["émetteurs", "CFO", "promoteurs", "family office", "compliance"],
  facts: [
    { key: "Juridictions", value: "8 — Luxembourg, DIFC, Singapour, Suisse, France, Irlande, Bahreïn, Gibraltar" },
    { key: "Critères", value: "Délai licence, coût setup, fiscalité investisseur, type d'actif" },
    { key: "Données", value: "lib/jurisdictions/data.ts — aligné /jurisdictions" },
    { key: "Pilier SEO", value: "Outils gratuits Pilier 1 #3" },
    { key: "Complément", value: "/jurisdictions/starter-kit 5 000 € · /tools/mica-checker" },
  ],
  faq: [
    {
      question: "Comment fonctionne le sélecteur de juridiction AUROS ?",
      answer:
        "Trois curseurs pondèrent délai, coût et fiscalité sur les 8 juridictions du comparateur — top 3 indicatif.",
    },
    {
      question: "Quelle est la meilleure juridiction pour tokeniser en Europe ?",
      answer:
        "Variable selon actif et investisseurs — Irlande/Luxembourg pour fonds EU, DIFC/Gibraltar pour rapidité hors UE.",
    },
  ],
  relatedPaths: [
    "/tools",
    "/jurisdictions",
    "/compare",
    "/wizard",
    "/estimate",
    "/tools/mica-checker",
    "/tools/yield-calculator",
    "/tools/cost-estimator",
    "/jurisdictions/starter-kit",
  ],
});

export const costEstimatorPage = enrichPage({
  id: "cost-estimator",
  path: "/tools/cost-estimator",
  title: "Estimateur coût tokenisation RWA | AUROS",
  description:
    "Estimez la fourchette indicative en euros d'une tokenisation RWA : setup juridique, licence, audit et frais annuels — par actif, taille de deal et juridiction (8 places AUROS).",
  summary:
    "Outil SEO Pilier 1 #4 — estimateur coût tokenisation : type d'actif, AUM, juridiction ou recommandation auto → fourchette setup + récurrent EUR, CTA wizard/estimate/jurisdictions/jurisdiction-picker.",
  contentType: "tool",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-11",
  keywords: [
    "tokenization cost estimator",
    "RWA tokenization cost",
    "coût tokenisation actif réel",
    "estimateur coût tokenisation",
    "frais licence crypto RWA",
    "budget tokenisation immobilier",
  ],
  intents: [
    "Combien coûte une tokenisation RWA",
    "Estimer budget setup juridiction tokenisation",
    "Fourchette frais licence audit tokenisation",
  ],
  audience: ["émetteurs", "CFO", "promoteurs", "family office", "compliance"],
  facts: [
    { key: "Postes", value: "Juridique/setup · Licence · Audit · Récurrent annuel" },
    { key: "Juridictions", value: "8 — données lib/jurisdictions/data.ts" },
    { key: "Tailles deal", value: "< 500 k€ · 500 k–2 M€ · 2–10 M€ · 10 M€+" },
    { key: "Pilier SEO", value: "Outils gratuits Pilier 1 #4" },
    { key: "Complément", value: "/tools/jurisdiction-picker · /jurisdictions · /wizard" },
  ],
  faq: [
    {
      question: "Qu'est-ce que l'estimateur de coût de tokenisation AUROS ?",
      answer:
        "Fourchette indicative EUR par poste — setup, licence, audit et récurrent — selon actif, AUM et juridiction.",
    },
    {
      question: "Ces montants constituent-ils un devis ?",
      answer:
        "Non — estimation pédagogique. Counsel et auditeurs chiffrent le dossier réel.",
    },
  ],
  relatedPaths: [
    "/tools",
    "/wizard",
    "/estimate",
    "/jurisdictions",
    "/tools/jurisdiction-picker",
    "/tools/mica-checker",
    "/tools/yield-calculator",
    "/jurisdictions/starter-kit",
  ],
});

export const pricingPage = enrichPage({
  id: "pricing",
  path: "/pricing",
  title: "Tarifs | AUROS — Gratuit, Starter Kit, Launch",
  description:
    "Trois offres AUROS : wizard et score gratuits, Starter Kit juridiction 5 000 €, accompagnement Launch sur devis.",
  summary:
    "Page tarifs AUROS — tier gratuit (wizard + score), Starter Kit 5 000 € (juridictions), Launch sur devis.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-08",
  keywords: [
    "tarifs AUROS",
    "Starter Kit prix",
    "wizard gratuit RWA",
    "tokenisation pricing",
  ],
  intents: ["Combien coûte AUROS", "Prix Starter Kit RWA"],
  audience: ["émetteurs", "CFO", "promoteurs"],
  facts: [
    { key: "Gratuit", value: "Wizard + score — /wizard" },
    { key: "Starter Kit", value: "5 000 € — /jurisdictions/starter-kit" },
    { key: "Launch", value: "Sur devis — /jurisdictions#quote-form" },
  ],
  relatedPaths: ["/wizard", "/jurisdictions", "/jurisdictions/starter-kit"],
  breadcrumbs: [{ name: "AUROS", path: "/" }],
});

export const greenFaqPage = enrichPage({
  id: "green-faq",
  path: GREEN_FAQ_ROUTE,
  title: "FAQ AUROS Green | RTMS, label, marketplace",
  description:
    "14 questions-réponses sur RTMS, label Verified, marketplace mondiale, registre et candidature producteur — AUROS Green.",
  summary:
    "FAQ AUROS Green complète : standard RTMS, label Verified, marketplace, producteurs vs stockeurs, assistant RTMS, Praticien.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: [
    "FAQ AUROS Green",
    "RTMS questions",
    "label Verified green",
    "marketplace énergie verte FAQ",
  ],
  intents: [
    "Comment obtenir label Green",
    "Différence producteur stockeur",
    "Assistant RTMS vs label",
  ],
  audience: ["producteurs", "investisseurs impact", "consultants ESG"],
  facts: [
    { key: "Grille", value: GREEN_STANDARDS_ROUTE },
    { key: "Label", value: GREEN_LABEL_ROUTE },
    { key: "Marketplace", value: GREEN_MARKET_ROUTE },
  ],
  faq: GREEN_FAQ_ITEMS,
  breadcrumbs: [{ name: "Green", path: GREEN_ROUTE }],
  relatedPaths: [
    GREEN_ROUTE,
    GREEN_STANDARDS_ROUTE,
    GREEN_LABEL_ROUTE,
    GREEN_BLOG_ROUTE,
    GREEN_RTMS_ASSISTANT_ROUTE,
  ],
});

export const greenHowItWorksPage = enrichPage({
  id: "green-comment-ca-marche",
  path: GREEN_HOW_IT_WORKS_ROUTE,
  title: "Comment ça marche | AUROS Green",
  description:
    "Parcours AUROS Green en 4 étapes : découvrir RTMS, référencer ou trouver un acteur, candidater au label, vérifier au registre.",
  summary:
    "Guide parcours AUROS Green — RTMS, marketplace, label Verified, registre public. Une action principale par étape.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: [
    "comment fonctionne AUROS Green",
    "parcours label green",
    "RTMS étapes",
  ],
  intents: ["Comment utiliser AUROS Green", "Parcours label vert"],
  audience: ["producteurs", "promoteurs solaire", "investisseurs"],
  facts: [
    { key: "Étape 1", value: "Comprendre RTMS — /green/standards" },
    { key: "Étape 2", value: "Marketplace — /green/market" },
    { key: "Étape 3", value: "Label — /green/label" },
    { key: "Étape 4", value: "Registre — /green/registry" },
  ],
  breadcrumbs: [{ name: "Green", path: GREEN_ROUTE }],
  relatedPaths: [
    GREEN_ROUTE,
    GREEN_REGISTER_ROUTE,
    GREEN_LABEL_ROUTE,
    GREEN_FAQ_ROUTE,
    `${AUROS_WIZARD_ROUTE}?asset=renewable`,
  ],
});

export const greenBlogIndexPage = enrichPage({
  id: "green-blog",
  path: GREEN_BLOG_ROUTE,
  title: "Blog AUROS Green | RTMS, marketplace, label",
  description:
    "Articles éducatifs AUROS Green : standard RTMS, producteurs vs stockeurs, label Verified, PPA et traçabilité, marketplace énergie.",
  summary:
    "Index blog AUROS Green — articles long format sur tokenisation énergie, RTMS, label et marketplace. FR primary, contenu cité par moteurs et IA.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-04",
  keywords: [
    "blog RWA vert",
    "articles tokenisation énergie",
    "RTMS blog",
    "AUROS Green contenu",
  ],
  intents: ["Apprendre tokenisation énergie verte", "Lire sur RTMS"],
  audience: ["producteurs", "analystes ESG", "promoteurs"],
  facts: GREEN_BLOG_ARTICLES.map((a) => ({
    key: a.title,
    value: greenBlogArticlePath(a.slug),
  })),
  breadcrumbs: [{ name: "Green", path: GREEN_ROUTE }],
  relatedPaths: [GREEN_ROUTE, GREEN_FAQ_ROUTE, GREEN_STANDARDS_ROUTE],
});

export const blogIndexPage = enrichPage({
  id: "blog",
  path: BLOG_ROUTE,
  title: "Blog tokenisation RWA | AUROS — guides immobilier & MiCA",
  description:
    "Guides long format AUROS sur la tokenisation immobilière en Europe : MiCA, SPV, juridictions, coûts et parcours émetteur. Contenu éducatif FR, alternates EN/ES.",
  summary:
    "Index blog pilier SEO AUROS — articles approfondis RWA immobilier, régulation UE et outils gratuits. Piliers : tokenisation immobilière Europe et hub Luxembourg RWA.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-11",
  keywords: [
    "blog tokenisation RWA",
    "guide immobilier tokenisé Europe",
    "real estate tokenization blog",
    "MiCA immobilier guide",
  ],
  intents: [
    "Comment tokeniser un immeuble en Europe",
    "Guide tokenisation immobilière MiCA",
  ],
  audience: ["promoteurs", "family office", "CFO", "émetteurs immobilier"],
  facts: BLOG_ARTICLES.map((a) => ({
    key: a.title,
    value: blogArticlePath(a.slug),
  })),
  relatedPaths: [
    AUROS_RESOURCES_ROUTE,
    "/glossary",
    "/tools",
    "/jurisdictions",
    "/wizard",
    blogArticlePath("real-estate-tokenization-europe"),
    blogArticlePath("tokenisation-rwa-luxembourg"),
  ],
});

export function buildBlogCatalogPages(): AiFirstPage[] {
  return BLOG_ARTICLES.map((article) =>
    enrichPage({
      id: `blog-${article.slug}`,
      path: blogArticlePath(article.slug),
      title: `${article.title} | AUROS`,
      description: article.description,
      summary: article.excerpt,
      contentType: "article",
      language: "multi",
      indexable: true,
      lastUpdated: article.modifiedAt,
      keywords: article.keywords,
      intents: [article.title, "tokenisation immobilière Europe"],
      audience: ["promoteurs immobilier", "family office", "CFO", "compliance"],
      facts: [
        { key: "Lecture", value: `${article.readingTimeMinutes} min` },
        {
          key: "Pilier SEO",
          value:
            article.slug === "tokenisation-rwa-luxembourg"
              ? "Blog RWA #2 Luxembourg"
              : "Blog RWA #1 immobilier Europe",
        },
      ],
      faq: article.faq,
      breadcrumbs: [
        { name: "Ressources", path: AUROS_RESOURCES_ROUTE },
        { name: "Blog", path: BLOG_ROUTE },
      ],
      article: {
        slug: article.slug,
        publishedAt: article.publishedAt,
        modifiedAt: article.modifiedAt,
        author: "AUROS",
        readingTimeMinutes: article.readingTimeMinutes,
      },
      relatedPaths: [
        BLOG_ROUTE,
        "/glossary/spv",
        "/glossary/mica",
        "/glossary/cssf-luxembourg",
        "/glossary/erc-3643",
        "/glossary/passporting-europeen",
        "/tools/mica-checker",
        "/tools/cost-estimator",
        "/tools/jurisdiction-picker",
        "/tools/yield-calculator",
        "/real-estate",
        "/compare",
        "/jurisdictions",
        "/jurisdictions/luxembourg-real-estate",
        "/wizard",
        article.cta.href,
        ...BLOG_ARTICLES.filter((a) => a.slug !== article.slug).map((a) =>
          blogArticlePath(a.slug)
        ),
      ],
    })
  );
}

export function buildGreenBlogCatalogPages(): AiFirstPage[] {
  return GREEN_BLOG_ARTICLES.map((article) =>
    enrichPage({
      id: `green-blog-${article.slug}`,
      path: greenBlogArticlePath(article.slug),
      title: `${article.title} | AUROS Green`,
      description: article.description,
      summary: article.excerpt,
      contentType: "article",
      language: "multi",
      indexable: true,
      lastUpdated: article.modifiedAt,
      keywords: article.keywords,
      intents: [article.title],
      audience: ["producteurs", "investisseurs impact", "consultants ESG"],
      facts: [{ key: "Lecture", value: `${article.readingTimeMinutes} min` }],
      breadcrumbs: [
        { name: "Green", path: GREEN_ROUTE },
        { name: "Blog", path: GREEN_BLOG_ROUTE },
      ],
      article: {
        slug: article.slug,
        publishedAt: article.publishedAt,
        modifiedAt: article.modifiedAt,
        author: "AUROS Green",
        readingTimeMinutes: article.readingTimeMinutes,
      },
      relatedPaths: [
        GREEN_BLOG_ROUTE,
        GREEN_FAQ_ROUTE,
        GREEN_STANDARDS_ROUTE,
        article.cta.href,
      ],
    })
  );
}

export const contentPages: AiFirstPage[] = [
  mainFaqPage,
  resourcesPage,
  rwaIndexPage,
  greenIndexPage,
  stateOfRwaIssuersPage,
  howItWorksPage,
  discoverPage,
  trustPage,
  estimatePage,
  developersPage,
  statusPage,
  toolsHubPage,
  micaCheckerPage,
  yieldCalculatorPage,
  jurisdictionPickerPage,
  costEstimatorPage,
  pricingPage,
  greenFaqPage,
  greenHowItWorksPage,
  greenBlogIndexPage,
  ...buildGreenBlogCatalogPages(),
  blogIndexPage,
  ...buildBlogCatalogPages(),
];
