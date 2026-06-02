export const ACADEMY_ROUTE = "/academy";
export const ACADEMY_FUNDAMENTALS_ROUTE = "/academy/fondamentaux";
export const ACADEMY_PRATICIEN_ROUTE = "/academy/praticien";
export const ACADEMY_ENTREPRISE_ROUTE = "/academy/entreprise";
export const ACADEMY_VERIFY_ROUTE = "/academy/verify";
export const ACADEMY_RENEW_ROUTE = "/academy/renew";
export const ACADEMY_DIPLOMA_SUCCESS_ROUTE = "/academy/diploma/success";
export const ACADEMY_REGISTRY_ROUTE = "/academy/registry";

export type AcademyTierId = "fundamentals" | "praticien" | "entreprise";

export type AcademyTierStatus = "available" | "partial" | "soon";

export type AcademyTier = {
  id: AcademyTierId;
  path: string;
  name: string;
  priceLabel: string;
  status: AcademyTierStatus;
  headline: string;
  description: string;
  ctaLabel: string;
};

export const ACADEMY_TIERS: AcademyTier[] = [
  {
    id: "fundamentals",
    path: ACADEMY_FUNDAMENTALS_ROUTE,
    name: "Certification Fondamentaux RWA",
    priceLabel: "Gratuit",
    status: "available",
    headline: "Les bases de la tokenisation d'actifs réels",
    description:
      "Quiz + 3 réponses courtes guidées — vocabulaire RWA, data room, juridictions. Attestation vérifiable 90 jours. Diplôme PDF optionnel 39 €.",
    ctaLabel: "Obtenir la certification",
  },
  {
    id: "praticien",
    path: ACADEMY_PRATICIEN_ROUTE,
    name: "Certification Praticien RWA",
    priceLabel: "Liste d'attente",
    status: "soon",
    headline: "Parcours émetteur — cas pratiques par type d'actif",
    description:
      "Immobilier, obligations, fonds — arbitrage juridiction et checklist émission. Parcours en préparation, pas encore ouvert.",
    ctaLabel: "Me prévenir à l'ouverture",
  },
  {
    id: "entreprise",
    path: ACADEMY_ENTREPRISE_ROUTE,
    name: "Certification Entreprise",
    priceLabel: "249 €",
    status: "partial",
    headline: "Équipes et organisations RWA",
    description:
      "Certificat établissement PDF disponible. Parcours équipe complet (licences, registre, badges) pas encore ouvert.",
    ctaLabel: "Commander le certificat",
  },
];

export const ACADEMY_PASS_SCORE = 8;
export const ACADEMY_QUIZ_LENGTH = 10;
export const ACADEMY_QUESTION_BANK_SIZE = 15;

/** Minimum words per structured challenge field (fundamentals). */
export const CHALLENGE_MIN_FIELD_WORDS = 12;
/** Minimum words for renewal micro-challenge. */
export const RENEWAL_MIN_FIELD_WORDS = 10;

/** Attestation validity — micro-renewal required after. */
export const CERT_VALIDITY_DAYS = 90;
export const RENEWAL_DUE_DAYS = 14;
export const CURRICULUM_VERSION = "2026.05";
export const INTEGRITY_LEVEL = 2 as const;

/** Anti-cheat timing thresholds — calibrated for real readers, blocks instant bots */
export const MIN_QUESTION_MS = 800;
export const MIN_QUIZ_TOTAL_MS = 20_000;
export const MIN_CHALLENGE_MS = 12_000;
export const MAX_QUIZ_SESSION_MINUTES = 45;
export const CHALLENGE_SESSION_MINUTES = 60;

export const ACADEMY_DISCLAIMER =
  "Formation indicative AUROS Academy — non agréée État, AMF ou CSSF. Ne remplace pas un conseil juridique ou réglementaire. Validité 90 jours — renouvellement micro-parcours requis.";
