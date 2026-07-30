import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";
import {
  ACADEMY_ENTREPRISE_ROUTE,
  ACADEMY_FUNDAMENTALS_ROUTE,
  ACADEMY_PRATICIEN_ROUTE,
  ACADEMY_REGISTRY_ROUTE,
  ACADEMY_ROUTE,
  ACADEMY_DISCLAIMER,
  ACADEMY_PASS_SCORE,
  ACADEMY_QUIZ_LENGTH,
} from "@/lib/academy/constants";

export const academyHomePage = enrichPage({
  id: "academy",
  path: ACADEMY_ROUTE,
  title: "AUROS Academy | Écoles RWA ressources & certification",
  description:
    "AUROS Academy — trois écoles (RWA ressources, trading, agents IA), modules 101–301, filtres métier, certification Fondamentaux gratuite.",
  summary:
    "AUROS Academy est le hub formation RWA ressources d'AUROS : écoles Tokenized Resources, Resource Trading & Liquidity, Machine Economy & AI Agents (modules 101/201/301, ≥2 leçons, quiz, progression Clerk). Certification Fondamentaux gratuite (attestation 90 j, diplôme PDF 39 €). Certificat établissement 249 €. Pas de Qualiopi / agrément / NFT cert live dans le MVP. Contenu éducatif — pas un conseil d'investissement.",
  contentType: "academy",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-07-30",
  keywords: [
    "certification RWA",
    "formation tokenisation",
    "RWA academy",
    "tokenized resources",
    "energy RWA training",
    "AUROS Academy",
    "machine economy agents",
  ],
  intents: [
    "Où se former aux RWA énergie / eau ?",
    "Formation tokenisation ressources réelles",
    "Certification RWA gratuite",
    "Parcours agents IA et énergie",
  ],
  audience: [
    "producteurs énergie",
    "utilities eau",
    "banques / desks risque",
    "counsel / émetteurs",
    "builders plateforme",
    "ingénieurs agents IA",
  ],
  facts: [
    { key: "Marque", value: "AUROS Academy (écosystème AUROS)" },
    {
      key: "Écoles MVP",
      value:
        "/academy/tokenized-resources · /academy/resource-trading · /academy/machine-economy",
    },
    { key: "Modules", value: "101 / 201 / 301 par école — ≥2 leçons + quiz" },
    { key: "Métiers", value: "Filtres producteur, utility, banque, counsel, builder, agent" },
    { key: "Certification", value: "Fondamentaux gratuit — attestation 90 j + diplôme PDF 39 €" },
    { key: "Entreprise PDF", value: "249 € sur /academy/entreprise" },
    { key: "Différé", value: "Qualiopi · NFT cert live · Fellow · white-label B2B · présentiel" },
    { key: "Disclaimer", value: ACADEMY_DISCLAIMER },
  ],
  faq: [
    {
      question: "La certification AUROS Academy remplace-t-elle une licence régulateur ?",
      answer:
        "Non. C'est une attestation de compréhension indicative — pas un agrément AMF, CSSF ou VARA, ni Qualiopi.",
    },
    {
      question: "Les trois écoles sont-elles ouvertes ?",
      answer:
        "Oui en MVP : contenu 101–301, quiz et progression authentifiée. Le parcours Fellow (projet) n'est pas encore ouvert.",
    },
    {
      question: "Y a-t-il un NFT de certificat on-chain live ?",
      answer:
        "Non dans ce MVP — différé / lab. Le diplôme PDF optionnel (39 €) et l'attestation vérifiable existent.",
    },
  ],
  relatedPaths: [
    ACADEMY_FUNDAMENTALS_ROUTE,
    "/academy/tokenized-resources",
    "/academy/resource-trading",
    "/academy/machine-economy",
    ACADEMY_REGISTRY_ROUTE,
    ACADEMY_PRATICIEN_ROUTE,
    ACADEMY_ENTREPRISE_ROUTE,
    "/start",
    "/lab",
    "/compare",
  ],
});

export const academyFundamentalsPage = enrichPage({
  id: "academy-fondamentaux",
  path: ACADEMY_FUNDAMENTALS_ROUTE,
  title: "Certification RWA gratuite | AUROS Academy Fondamentaux",
  description:
    "Certification RWA gratuite — quiz anti-triche, 3 points guidés, attestation 90 jours. Formation tokenisation, data room, juridictions, MiCA.",
  summary:
    "Parcours gratuit AUROS Academy : 10 questions aléatoires (réponses jamais côté client), 3 réponses courtes guidées (12 mots min, critères visibles), score minimum 8/10. Attestation nominative valide 90 jours + micro-renouvellement. Livrable : URL /academy/verify.",
  contentType: "academy",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: [
    "certification RWA gratuite",
    "quiz tokenisation",
    "formation RWA gratuite",
    "attestation RWA",
  ],
  intents: [
    "Certification RWA gratuite en ligne",
    "Quiz tokenisation actifs réels",
  ],
  audience: ["débutants RWA", "professionnels en reconversion", "étudiants"],
  facts: [
    { key: "Prix", value: "Gratuit" },
    { key: "Durée", value: "~15 minutes (quiz + validation pratique)" },
    { key: "Format", value: "Quiz 10 QCM aléatoires + 3 points guidés + attestation 90 j" },
    { key: "Seuil", value: `${ACADEMY_PASS_SCORE}/${ACADEMY_QUIZ_LENGTH} bonnes réponses` },
  ],
  relatedPaths: [ACADEMY_ROUTE, ACADEMY_PRATICIEN_ROUTE],
});

export const academyPraticienPage = enrichPage({
  id: "academy-praticien",
  path: ACADEMY_PRATICIEN_ROUTE,
  title: "Certification Praticien RWA | AUROS Academy",
  description:
    "Parcours praticien RWA payant — cas par actif, arbitrage juridiction. AUROS Academy.",
  summary:
    "Certification Praticien RWA AUROS Academy : parcours avancé émetteur — immobilier, obligations, fonds, crédit privé, checklist émission. Pas encore ouvert — liste d'attente email.",
  contentType: "academy",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["certification praticien RWA", "formation émetteur tokenisation"],
  intents: ["Formation avancée tokenisation RWA"],
  audience: ["émetteurs", "CFO", "asset managers"],
  facts: [{ key: "Statut", value: "Pas encore ouvert — liste d'attente email" }],
  relatedPaths: [ACADEMY_ROUTE, ACADEMY_FUNDAMENTALS_ROUTE],
});

export const academyEntreprisePage = enrichPage({
  id: "academy-entreprise",
  path: ACADEMY_ENTREPRISE_ROUTE,
  title: "Certification Entreprise RWA | AUROS Academy",
  description:
    "Certification équipe RWA — registre entreprise, badges collaborateurs. AUROS Academy B2B.",
  summary:
    "Certification Entreprise AUROS Academy — certificat établissement PDF 249 € disponible. Parcours équipe complet, registre public et badges collaborateurs prochainement.",
  contentType: "academy",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: [
    "certification entreprise RWA",
    "formation équipe tokenisation",
    "entreprise certifiée RWA",
  ],
  intents: ["Certifier mon équipe RWA", "Formation B2B tokenisation"],
  audience: ["RH", "compliance", "direction", "plateformes RWA"],
  facts: [
    { key: "Certificat établissement", value: "249 € — disponible (PDF permanent)" },
    { key: "Parcours équipe", value: "Prochainement — contact commercial" },
  ],
  relatedPaths: [ACADEMY_ROUTE, "/partners"],
});

export const academyRegistryPage = enrichPage({
  id: "academy-registry",
  path: ACADEMY_REGISTRY_ROUTE,
  title: "Registre public | AUROS Academy",
  description:
    "Statistiques agrégées des certifications AUROS Academy et établissements certifiés — sans noms personnels.",
  summary:
    "Registre public AUROS Academy : compteurs attestations délivrées/actives et liste des établissements ayant commandé le certificat institution 249 €. Conforme RGPD — pas de liste nominative individuelle.",
  contentType: "academy",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: ["registre certification RWA", "AUROS Academy registry"],
  intents: ["Voir les certifications AUROS Academy", "Établissements certifiés RWA"],
  audience: ["investisseurs", "RH", "partenaires"],
  facts: [
    { key: "Données", value: "Stats agrégées + établissements PDF institution uniquement" },
    { key: "Vie privée", value: "Aucun nom personnel publié" },
  ],
  relatedPaths: [ACADEMY_ROUTE, ACADEMY_ENTREPRISE_ROUTE],
});

export const academyPages: AiFirstPage[] = [
  academyHomePage,
  academyFundamentalsPage,
  academyPraticienPage,
  academyEntreprisePage,
  academyRegistryPage,
  enrichPage({
    id: "academy-tokenized-resources",
    path: "/academy/tokenized-resources",
    title: "École Ressources tokenisées (RWA) | AUROS Academy",
    description:
      "Modules 101–301 : droits tokenisés, oracles, gouvernance — énergie / eau / environnement.",
    summary:
      "École Tokenized Resources : vocabulaire RWA ressources, smart contracts & oracles, gouvernance juridique. Contenu éducatif FR/EN.",
    contentType: "academy",
    language: "multi",
    indexable: true,
    lastUpdated: "2026-07-30",
    keywords: ["tokenized resources", "RWA energy", "oracle ressources"],
    intents: ["Formation RWA énergie eau"],
    audience: ["producteurs", "utilities", "counsel"],
    facts: [{ key: "Modules", value: "101 · 201 · 301" }],
    relatedPaths: [ACADEMY_ROUTE, "/academy/tokenized-resources/101", "/lab", "/green"],
  }),
  enrichPage({
    id: "academy-resource-trading",
    path: "/academy/resource-trading",
    title: "École Trading & liquidité ressources | AUROS Academy",
    description:
      "Marchés power/eau, market-making algo, desk énergie — sans exécution de deals.",
    summary:
      "École Resource Trading & Liquidity : horizons de marché, liquidité réelle vs affichée, MM algo, desk plateforme. AUROS n'est pas un broker.",
    contentType: "academy",
    language: "multi",
    indexable: true,
    lastUpdated: "2026-07-30",
    keywords: ["energy trading education", "RWA liquidity", "market making"],
    intents: ["Comprendre liquidité RWA ressources"],
    audience: ["banques", "desks", "builders"],
    facts: [{ key: "Modules", value: "101 · 201 · 301" }],
    relatedPaths: [ACADEMY_ROUTE, "/compare", "/liquidity"],
  }),
  enrichPage({
    id: "academy-machine-economy",
    path: "/academy/machine-economy",
    title: "École Économie machine & agents IA | AUROS Academy",
    description:
      "IA et énergie, lab agent acheteur, settlement M2M — labs pédagogiques, pas trading live.",
    summary:
      "École Machine Economy & AI Agents : coût énergétique du compute, politiques avant autonomie, limites du settlement M2M. NFT cert live différé.",
    contentType: "academy",
    language: "multi",
    indexable: true,
    lastUpdated: "2026-07-30",
    keywords: ["AI energy agents", "M2M settlement", "buyer agent lab"],
    intents: ["Former des agents acheteurs énergie"],
    audience: ["ingénieurs agents", "builders", "risk"],
    facts: [{ key: "Modules", value: "101 · 201 · 301" }],
    relatedPaths: [ACADEMY_ROUTE, "/builders", "/start"],
  }),
];
