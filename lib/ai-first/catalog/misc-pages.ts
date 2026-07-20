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
  relatedPaths: ["/legal", "/terms"],
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
  ],
  intents: [
    "Assistant AUROS",
    "Comparer produits RWA avec IA",
    "Expliquer ChargeFlow",
  ],
  audience: ["émetteurs", "analystes", "développeurs", "ops"],
  facts: [
    { key: "Chat", value: "POST /api/v1/copilot/chat" },
    { key: "Ops inbox", value: "/ops/copilot" },
    { key: "Garde-fou", value: "Pas d'écriture scores / attest / CFU" },
  ],
  relatedPaths: ["/compare", "/jurisdictions", "/green/chargeflow", "/developers"],
});

export const wattsReservePage = enrichPage({
  id: "watts-reserve",
  path: "/green/chargeflow/reserve",
  title: "AUROS Watts Reserve | Réserver des watts",
  description:
    "Réservation d’un profil énergétique, matching déterministe, confirm explicite → mint CFU-E ou CFU-F. Pas de livraison réseau garantie.",
  summary:
    "Booking engine des watts : intent + match_score, puis confirm → CFU liée à reservation_id. Wedge flottes/CPO/flex.",
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
  ],
  intents: [
    "Réserver des watts",
    "Matching horaire carbone",
    "Confirmer mint CFU",
  ],
  audience: ["flottes", "CPO", "acheteurs corporate", "développeurs"],
  facts: [
    { key: "API", value: "POST /api/v1/watts/reserve" },
    { key: "Confirm", value: "POST /api/v1/watts/reserve/:id/confirm" },
    { key: "Garde-fou", value: "Pas d’auto-mint — confirm explicite" },
  ],
  relatedPaths: [
    "/green/chargeflow",
    "/green/chargeflow/fleets",
    "/green/chargeflow/flex",
    "/copilot",
  ],
});

export const miscPages = [
  partnersPage,
  aboutPage,
  legalPage,
  privacyPage,
  termsPage,
  copilotPage,
  wattsReservePage,
];
