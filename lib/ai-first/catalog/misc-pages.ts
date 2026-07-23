import { WATTS_FAQ_ITEMS } from "@/lib/seo/content/watts-faq";

import { enrichPage } from "../enrich";

export const partnersPage = enrichPage({
  id: "partners",
  path: "/partners",
  title: "Partenaires plateformes | Intégrations RWA AUROS",
  description:
    "Programme partenaires AUROS pour plateformes RWA — dossiers pré-formatés, onboarding qualifié, intégrations counsel et custodians.",
  summary:
    "Programme partenaires AUROS pour acteurs RWA : plateformes d'émission, cabinets, custodians, intégrations tech. Contact via formulaire.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-06-09",
  keywords: ["AUROS partners", "RWA ecosystem", "tokenization platform partner"],
  intents: ["Devenir partenaire AUROS", "Intégration plateforme RWA"],
  audience: ["plateformes RWA", "cabinet avocats", "custodians", "tech providers"],
  facts: [{ key: "Contact", value: "Formulaire /partners#contact" }],
  relatedPaths: ["/", "/jurisdictions"],
});

export const legalPage = enrichPage({
  id: "legal",
  path: "/legal",
  title: "Mentions légales | AUROS",
  description: "Mentions légales du site AUROS.",
  summary: "Informations légales éditeur AUROS — tokenisation RWA B2B.",
  contentType: "legal",
  language: "fr",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["mentions légales AUROS"],
  intents: ["Éditeur legal AUROS"],
  audience: ["tous"],
  facts: [{ key: "Type", value: "Mentions légales" }],
  relatedPaths: ["/privacy", "/terms"],
});

export const privacyPage = enrichPage({
  id: "privacy",
  path: "/privacy",
  title: "Politique de confidentialité | AUROS",
  description: "RGPD et traitement des données AUROS.",
  summary:
    "Politique confidentialité AUROS : hébergement UE, RGPD, données leads juridictions chiffrées, pas de revente de leads.",
  contentType: "legal",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["RGPD AUROS", "privacy RWA platform"],
  intents: ["Données personnelles AUROS", "RGPD tokenisation"],
  audience: ["utilisateurs", "DPO"],
  facts: [
    { key: "Hébergement", value: "UE" },
    { key: "Cadre", value: "RGPD" },
  ],
  relatedPaths: ["/legal", "/terms", "/security"],
});

export const securityPage = enrichPage({
  id: "security",
  path: "/security",
  title: "Sécurité | AUROS",
  description:
    "AUROS protège les comptes et données utilisateurs. Signalement : security@getauros.com.",
  summary:
    "Posture sécurité utilisateurs-first. Détails techniques non publiés. Contact security@getauros.com.",
  contentType: "legal",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-21",
  keywords: ["sécurité AUROS", "confidentialité"],
  intents: ["Sécurité plateforme AUROS", "Signaler une faille AUROS"],
  audience: ["utilisateurs", "security researchers", "DPO"],
  facts: [
    { key: "Contact", value: "security@getauros.com" },
  ],
  relatedPaths: ["/privacy", "/status"],
});

export const termsPage = enrichPage({
  id: "terms",
  path: "/terms",
  title: "Conditions d'utilisation | AUROS",
  description: "CGU AUROS — comparateur et outils RWA indicatifs.",
  summary:
    "Conditions d'utilisation AUROS. Analyses indicatives — non conseil juridique. Validation counsel requise avant toute émission.",
  contentType: "legal",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["CGU AUROS", "terms of service"],
  intents: ["Conditions utilisation AUROS"],
  audience: ["utilisateurs"],
  facts: [{ key: "Disclaimer", value: "Analyse indicative — pas conseil juridique" }],
  relatedPaths: ["/legal", "/privacy"],
});

export const aboutPage = enrichPage({
  id: "about",
  path: "/about",
  title: "À propos d'AUROS | Tokenisation RWA B2B",
  description:
    "AUROS — plateforme B2B comparateur juridictions RWA, wizard admission actif gratuit, Starter Kit phase 0. Fondée par Adrien Balitrand.",
  summary:
    "AUROS aide les émetteurs B2B à arbitrer où structurer une émission RWA (8 juridictions) et à préparer l'admission de leur actif (wizard + data room). Produit gratuit phase 1 ; memo juridiction Starter Kit 5 000 € phase 0. Analyses indicatives — counsel requis avant émission.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: [
    "AUROS about",
    "RWA tokenization platform",
    "jurisdiction comparator",
    "Adrien Balitrand",
  ],
  intents: [
    "Qui est AUROS ?",
    "Qui a créé AUROS ?",
    "Plateforme tokenisation RWA B2B",
  ],
  audience: ["investisseurs", "presse", "partenaires", "IA crawlers"],
  facts: [
    { key: "Fondateur", value: "Adrien Balitrand" },
    { key: "Contact", value: "adrien.balitrand@gmail.com" },
    { key: "Produit gratuit", value: "Wizard + dossier actif (/wizard)" },
    { key: "Produit payant", value: "Starter Kit juridiction 5 000 €" },
    { key: "Juridictions", value: "8 comparées (Luxembourg, DIFC, Singapour…)" },
    { key: "Machine-readable", value: "/ai-first/index.json, /llms.txt, /ai-first/rag" },
    { key: "Disclaimer", value: "Analyses indicatives — pas conseil juridique" },
  ],
  relatedPaths: ["/", "/jurisdictions", "/partners", "/legal"],
});

export const copilotPage = enrichPage({
  id: "copilot",
  path: "/copilot",
  title: "AUROS Copilot | Assistant RWA",
  description:
    "Assistant AUROS pour le comparateur RWA, juridictions, Protocol API et ChargeFlow — réponses sourcées, indicatives. Validation humaine pour tout draft catalogue/contenu.",
  summary:
    "Copilot public + inbox ops. Tools lecture seule (RAG ai-first, products, compare, ChargeFlow). Les agents catalogue/contenu créent des drafts à approuver — jamais d'auto-publish des scores ou CFU.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "AUROS Copilot",
    "RWA assistant",
    "comparateur AI",
    "ChargeFlow assistant",
    "Watts Reserve assistant",
    "assistant tokenisation",
  ],
  intents: [
    "Assistant AUROS",
    "Comparer produits RWA avec IA",
    "Expliquer ChargeFlow",
    "Expliquer Watts Reserve",
  ],
  audience: ["émetteurs", "analystes", "développeurs", "ops"],
  facts: [
    { key: "Chat", value: "POST /api/v1/copilot/chat" },
    { key: "Garde-fou", value: "Pas d'écriture scores / attest / CFU" },
    { key: "RAG", value: "/ai-first/rag" },
  ],
  faq: [
    {
      question: "Le Copilot AUROS peut-il publier des scores ou mint des CFU ?",
      answer:
        "Non. Les tools sont en lecture seule (RAG, products, compare, ChargeFlow/Watts explain). Les drafts catalogue/contenu passent par une revue humaine authentifiée — jamais d'auto-publish des scores, attestations ou CFU.",
    },
    {
      question: "Comment cibler Watts ou ChargeFlow dans le Copilot ?",
      answer:
        "Ouvrez /copilot?context=watts ou /copilot?context=chargeflow. Les suggestions et tools s'adaptent à la surface (Green, RTMS, juridictions, compare).",
    },
    {
      question: "Les réponses Copilot remplacent-elles un counsel ?",
      answer:
        "Non. Réponses indicatives et sourcées sur le catalogue AUROS. Validation humaine et counsel requis avant toute décision d'émission ou d'investissement.",
    },
  ],
  relatedPaths: [
    "/compare",
    "/jurisdictions",
    "/green/chargeflow",
    "/green/watts",
    "/developers",
    "/ai-first/rag",
  ],
});

export const wattsHubPage = enrichPage({
  id: "watts-hub",
  path: "/green/watts",
  title: "AUROS Watts | Booking engine des watts",
  description:
    "Réserver, prouver et préparer la finance des watts critiques — matching, CFU, inventaire, secondaire. Indicatif, pas un marché réglementé.",
  summary:
    "AUROS Watts est le booking engine des watts critiques : matching déterministe, confirm → mint CFU, settle → retire, inventaire producteur et secondaire lié au comparateur RWA. Hub produit /green/watts.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "AUROS Watts",
    "watts reserve",
    "booking engine watts",
    "réserver watts",
    "CFU-E",
    "CFU-F",
    "hourly matching énergie",
    "inventaire capacité producteur",
    "secondaire watts RWA",
    "ChargeFlow booking",
  ],
  intents: [
    "Qu'est-ce qu'AUROS Watts ?",
    "Réserver des watts critiques",
    "Booking engine énergie flottes CPO",
  ],
  audience: ["flottes", "CPO", "producteurs", "équipes RWA", "acheteurs corporate"],
  facts: [
    { key: "Hub", value: "/green/watts" },
    { key: "API", value: "POST /api/v1/watts/reserve" },
    { key: "Docs", value: "/developers/docs/endpoint-watts-reserve" },
    { key: "Machine", value: "/ai-first/page.json?path=/green/watts" },
  ],
  faq: WATTS_FAQ_ITEMS,
  breadcrumbs: [
    { name: "Green", path: "/green" },
  ],
  relatedPaths: [
    "/green/chargeflow/reserve",
    "/green/chargeflow/inventory",
    "/green/chargeflow/secondary",
    "/green/chargeflow",
    "/copilot",
  ],
});

export const wattsReservePage = enrichPage({
  id: "watts-reserve",
  path: "/green/chargeflow/reserve",
  title: "AUROS Watts Reserve | Réserver des watts",
  description:
    "Réservation d’un profil énergétique : matching, confirm → mint CFU, settle → retire. Pas de livraison réseau garantie.",
  summary:
    "Booking engine des watts : match → confirm → settle. Inventaire producteur en parallèle.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "watts reserve",
    "hourly matching",
    "CFU",
    "ChargeFlow",
    "profil énergétique",
    "mint CFU confirm",
    "settle retire watts",
  ],
  intents: [
    "Réserver des watts",
    "Confirmer mint CFU",
    "Settle retire livraison",
  ],
  audience: ["flottes", "CPO", "acheteurs corporate", "développeurs"],
  facts: [
    { key: "API", value: "POST /api/v1/watts/reserve" },
    { key: "Confirm", value: "POST /api/v1/watts/reserve/:id/confirm" },
    { key: "Settle", value: "POST /api/v1/watts/reserve/:id/settle" },
  ],
  faq: WATTS_FAQ_ITEMS.slice(0, 4),
  breadcrumbs: [
    { name: "Green", path: "/green" },
    { name: "Watts", path: "/green/watts" },
  ],
  relatedPaths: [
    "/green/watts",
    "/green/chargeflow",
    "/green/chargeflow/inventory",
    "/green/chargeflow/fleets",
    "/copilot",
  ],
});

export const wattsInventoryPage = enrichPage({
  id: "watts-inventory",
  path: "/green/chargeflow/inventory",
  title: "AUROS Watts Inventory | Capacité producteur",
  description:
    "Inventaire de fenêtres de capacité producteur — publier, parcourir, matcher un profil acheteur. Indicatif, pas un PPA.",
  summary:
    "Étape 4 Watts Reserve : offres open/withdrawn + matching déterministe profil × inventaire.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "capacity inventory",
    "watts offers",
    "flex kW",
    "ChargeFlow",
    "offre capacité producteur",
    "matching inventaire énergie",
  ],
  intents: [
    "Publier capacité",
    "Parcourir inventaire watts",
    "Matcher offres producteur",
  ],
  audience: ["producteurs", "CPO", "acheteurs corporate", "développeurs"],
  facts: [
    { key: "API", value: "POST /api/v1/watts/offers" },
    { key: "Match", value: "POST /api/v1/watts/offers/match" },
    { key: "Garde-fou", value: "Pas d’auto-reserve" },
  ],
  faq: [
    {
      question: "L'inventaire Watts est-il un engagement PPA ?",
      answer:
        "Non. Les offres sont des fenêtres de capacité indicatives. Le matching classe les offres sans auto-réserver. Voir /green/chargeflow/inventory.",
    },
    {
      question: "Comment matcher mon profil acheteur à l'inventaire ?",
      answer:
        "Depuis la réserve (/green/chargeflow/reserve) via « Voir capacité ouverte », ou POST /api/v1/watts/offers/match avec votre fenêtre, zone et firmness.",
    },
  ],
  breadcrumbs: [
    { name: "Green", path: "/green" },
    { name: "Watts", path: "/green/watts" },
  ],
  relatedPaths: [
    "/green/watts",
    "/green/chargeflow/reserve",
    "/green/chargeflow/secondary",
    "/green/chargeflow",
    "/green/chargeflow/fleets",
    "/copilot",
  ],
});

export const wattsSecondaryPage = enrichPage({
  id: "watts-secondary",
  path: "/green/chargeflow/secondary",
  title: "AUROS Watts Secondary | Positions & RWA prep",
  description:
    "Listings secondaires indicatifs de positions watts, lien compare_ref_id vers le comparateur RWA. Pas un marché réglementé.",
  summary:
    "Étape 5 Watts Reserve : livre secondaire indicatif + intérêt non liant + hook /compare.",
  contentType: "guide",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-20",
  keywords: [
    "watts secondary",
    "RWA prep",
    "CFU listing",
    "compare",
    "marché secondaire watts",
    "listing indicatif énergie",
  ],
  intents: [
    "Lister position watts",
    "Lier RWA compare",
    "Exprimer intérêt secondaire",
  ],
  audience: ["acheteurs corporate", "producteurs", "équipes RWA", "développeurs"],
  facts: [
    { key: "API", value: "POST /api/v1/watts/secondary" },
    { key: "Interest", value: "POST /api/v1/watts/secondary/:id/interest" },
    { key: "Garde-fou", value: "Pas d’auto-transfer ni marché réglementé" },
  ],
  faq: [
    {
      question: "Le secondaire Watts est-il un marché réglementé ?",
      answer:
        "Non. Listings et intérêts sont indicatifs, non liants. compare_ref_id peut pointer vers /compare pour la prep RWA — pas d'exécution titres.",
    },
    {
      question: "Quand lister une position ?",
      answer:
        "Après settle d'une réservation confirmée, ou en listing libre avec zone/firmness. CTA settle → secondaire avec ?reservation_id=.",
    },
  ],
  breadcrumbs: [
    { name: "Green", path: "/green" },
    { name: "Watts", path: "/green/watts" },
  ],
  relatedPaths: [
    "/green/watts",
    "/green/chargeflow/reserve",
    "/green/chargeflow/inventory",
    "/compare",
    "/copilot",
  ],
});

export const miscPages = [
  partnersPage,
  aboutPage,
  legalPage,
  privacyPage,
  securityPage,
  termsPage,
  copilotPage,
  wattsHubPage,
  wattsReservePage,
  wattsInventoryPage,
  wattsSecondaryPage,
];
