import type { QuizQuestion } from "./types";
import type { AcademyLocale } from "./i18n";
import { RENEWAL_QUIZ_EN, RENEWAL_QUIZ_ES } from "./renewal-content-locale";

/** Micro-updates for renewal — regulatory & product changes. */
export const RENEWAL_UPDATE_VERSION = "2026.05";

export const RENEWAL_QUIZ: QuizQuestion[] = [
  {
    id: "r1",
    prompt: "[Màj 2026] Pourquoi AUROS Academy exige un défi pratique guidé après le quiz ?",
    options: [
      { id: "a", label: "Vérifier la compréhension avec critères objectifs, pas seulement le QCM" },
      { id: "b", label: "Remplacer un avocat" },
      { id: "c", label: "Éviter toute data room" },
      { id: "d", label: "Garantir un rendement fixe" },
    ],
    correctOptionId: "a",
  },
  {
    id: "r2",
    prompt: "[Màj 2026] Durée de validité d'une attestation Fondamentaux AUROS Academy ?",
    options: [
      { id: "a", label: "90 jours — renouvellement micro-parcours requis" },
      { id: "b", label: "Illimitée sans mise à jour" },
      { id: "c", label: "24 heures" },
      { id: "d", label: "10 ans agrément État" },
    ],
    correctOptionId: "a",
  },
  {
    id: "r3",
    prompt: "[Màj 2026] MiCA et émissions RWA en UE — posture prudente ?",
    options: [
      { id: "a", label: "Analyser qualification token + statut émetteur/CASP avec counsel" },
      { id: "b", label: "MiCA ne s'applique jamais aux RWA" },
      { id: "c", label: "Déployer sans KYC si whitepaper en anglais" },
      { id: "d", label: "Ignorer la juridiction du SPV" },
    ],
    correctOptionId: "a",
  },
];

export function getRenewalQuiz(locale: AcademyLocale = "fr"): QuizQuestion[] {
  if (locale === "en") return RENEWAL_QUIZ_EN;
  if (locale === "es") return RENEWAL_QUIZ_ES;
  return RENEWAL_QUIZ;
}

/** @deprecated Use RENEWAL_STRUCTURED_CHALLENGE — kept for copy reference only. */
export const RENEWAL_BRIEF = {
  title: "Micro-mise à jour — maintien attestation",
  summary:
    "Expliquez en 80–200 mots pourquoi un émetteur RWA doit renouveler sa veille réglementaire et juridictionnelle tous les 90 jours, et citez un risque concret si cette veille est absente.",
  minWords: 80,
  maxWords: 220,
  requiredConcepts: [
    "veille",
    "juridiction",
    "réglement",
    "conform",
    "mise à jour",
    "renouvel",
    "risque",
    "compliance",
    "miCA",
    "due diligence",
  ],
};
