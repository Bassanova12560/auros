import { enrichPage } from "../enrich";
import type { AiFirstPage } from "../types";
import {
  ACADEMY_ENTREPRISE_ROUTE,
  ACADEMY_FUNDAMENTALS_ROUTE,
  ACADEMY_PRATICIEN_ROUTE,
  ACADEMY_REGISTRY_ROUTE,
  ACADEMY_RENEW_ROUTE,
  ACADEMY_ROUTE,
  ACADEMY_DISCLAIMER,
  ACADEMY_PASS_SCORE,
  ACADEMY_QUIZ_LENGTH,
  CERT_VALIDITY_DAYS,
  INTEGRITY_LEVEL,
} from "@/lib/academy/constants";

export const academyHomePage = enrichPage({
  id: "academy",
  path: ACADEMY_ROUTE,
  title: "AUROS Academy | Certification RWA & formation tokenisation",
  description:
    "Certification RWA AUROS Academy — parcours Fondamentaux gratuit disponible. Attestation 90 j, diplôme PDF optionnel 39 €. Praticien et parcours équipe prochainement.",
  summary:
    "AUROS Academy est le bras formation & certification RWA d'AUROS — indépendant des outils wizard/comparateur. Disponible : Certification Fondamentaux RWA gratuite (quiz anti-triche 8/10, 3 réponses guidées 12 mots min, attestation 90 j + micro-renouvellement, diplôme PDF optionnel 39 €). Certificat établissement 249 €. Registre public agrégé sur /academy/registry. Prochainement : parcours Praticien et certification équipe complète.",
  contentType: "academy",
  language: "multi",
  indexable: true,
  lastUpdated: "2026-05-29",
  keywords: [
    "certification RWA",
    "formation tokenisation",
    "RWA academy",
    "certification actifs réels",
    "AUROS Academy",
    "attestation tokenisation",
    "formation blockchain immobilier",
  ],
  intents: [
    "Où obtenir une certification RWA ?",
    "Formation tokenisation actifs réels gratuite",
    "Certification entreprise RWA",
    "Attestation vérifiable tokenisation",
  ],
  audience: [
    "professionnels RWA",
    "promoteurs",
    "family office",
    "RH formation",
    "étudiants finance",
  ],
  facts: [
    { key: "Marque", value: "AUROS Academy (écosystème AUROS)" },
    { key: "Disponible", value: "Fondamentaux RWA gratuit — quiz + 3 points guidés + attestation 90 j" },
    { key: "Diplôme PDF optionnel", value: "39 € — permanent, après certification Fondamentaux" },
    { key: "Certificat établissement", value: "249 € — disponible sur /academy/entreprise" },
    { key: "Registre public", value: `${ACADEMY_REGISTRY_ROUTE} — stats agrégées + établissements` },
    { key: "Prochainement", value: "Parcours Praticien ; parcours équipe (licences volume, badges)" },
    { key: "Vérification", value: "/academy/verify/{token}" },
    { key: "Renouvellement", value: `${ACADEMY_RENEW_ROUTE}?cert={token}` },
    { key: "Validité", value: `${CERT_VALIDITY_DAYS} jours — micro-parcours requis` },
    { key: "Intégrité", value: `Niveau ${INTEGRITY_LEVEL} — timings + validation pratique guidée` },
    { key: "Score minimum", value: `${ACADEMY_PASS_SCORE}/${ACADEMY_QUIZ_LENGTH}` },
    { key: "Disclaimer", value: ACADEMY_DISCLAIMER },
  ],
  faq: [
    {
      question: "La certification AUROS Academy remplace-t-elle une licence régulateur ?",
      answer:
        "Non. C'est une attestation de compréhension indicative — pas un agrément AMF, CSSF ou VARA.",
    },
    {
      question: "La certification fondamentaux est-elle gratuite ?",
      answer:
        "Oui — quiz en ligne, 3 réponses courtes guidées, attestation nominative avec lien de vérification public. Validité 90 jours.",
    },
    {
      question: "Comment renouveler une attestation expirée ?",
      answer:
        "Micro-parcours sur /academy/renew : 3 questions de mise à jour + une réponse courte guidée. Même ID attestation, date d'expiration prolongée.",
    },
  ],
  relatedPaths: [
    ACADEMY_FUNDAMENTALS_ROUTE,
    ACADEMY_REGISTRY_ROUTE,
    ACADEMY_PRATICIEN_ROUTE,
    ACADEMY_ENTREPRISE_ROUTE,
    "/about",
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
];
