import type { AcademyLocale } from "./i18n";
import { FUNDAMENTALS_BANK_EN, FUNDAMENTALS_BANK_ES } from "./quiz-bank-locale";
import type { QuizQuestion } from "./types";

/** Expanded bank — server picks 10 at random per attempt (answers never sent to client). */
export const FUNDAMENTALS_BANK: QuizQuestion[] = [
  {
    id: "q1",
    prompt: "Que signifie RWA (Real-World Asset) ?",
    options: [
      { id: "a", label: "Un actif réel tokenisé on-chain (immobilier, dette, fonds…)" },
      { id: "b", label: "Une cryptomonnaie native d'un L1" },
      { id: "c", label: "Un NFT de collection art uniquement" },
      { id: "d", label: "Un stablecoin algorithmique" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q2",
    prompt: "Quel est le rôle principal d'une data room en tokenisation RWA ?",
    options: [
      { id: "a", label: "Stocker uniquement le smart contract" },
      { id: "b", label: "Rassembler les pièces due diligence pour investisseurs et régulateurs" },
      { id: "c", label: "Remplacer le KYC investisseur" },
      { id: "d", label: "Publier le whitepaper marketing" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q3",
    prompt: "En phase 0 d'un projet RWA, quelle décision est structurante ?",
    options: [
      { id: "a", label: "Le choix de la couleur du site web" },
      { id: "b", label: "La juridiction de structuration (SPV, régulateur, fiscalité)" },
      { id: "c", label: "Le nombre de followers Twitter" },
      { id: "d", label: "Le exchange CEX de listing obligatoire" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q4",
    prompt: "MiCA concerne principalement…",
    options: [
      { id: "a", label: "Le cadre crypto-assets dans l'UE (émetteurs, CASP)" },
      { id: "b", label: "Les permis de construire immobiliers" },
      { id: "c", label: "La TVA sur l'immobilier uniquement" },
      { id: "d", label: "Les retraits bancaires SWIFT" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q5",
    prompt: "Un token RWA « permissioned » signifie généralement…",
    options: [
      { id: "a", label: "Transferts restreints aux investisseurs éligibles / whitelist" },
      { id: "b", label: "Token sans blockchain" },
      { id: "c", label: "Token gratuit pour tout le public sans KYC" },
      { id: "d", label: "Token non transférable jamais" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q6",
    prompt: "Le DIFC (Dubai) est souvent cité pour la tokenisation RWA car…",
    options: [
      { id: "a", label: "Il interdit toute émission" },
      { id: "b", label: "Hub réglementé MENA avec cadre VARA/FSRA et délais compétitifs" },
      { id: "c", label: "Il remplace automatiquement MiCA en Europe" },
      { id: "d", label: "Zéro KYC obligatoire pour tout actif" },
    ],
    correctOptionId: "b",
  },
  {
    id: "q7",
    prompt: "Luxembourg est fréquent pour les émissions RWA institutionnelles car…",
    options: [
      { id: "a", label: "Écosystème fonds / véhicules (RAIF, CSSF) et place UE établie" },
      { id: "b", label: "Absence totale de supervision" },
      { id: "c", label: "Interdiction des investisseurs professionnels" },
      { id: "d", label: "Obligation de lister en retail uniquement" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q8",
    prompt: "Avant d'émettre, un promoteur doit typiquement…",
    options: [
      { id: "a", label: "Valider l'éligibilité de l'actif, la structuration et la conformité avec counsel" },
      { id: "b", label: "Déployer le token sans documentation" },
      { id: "c", label: "Ignorer la juridiction si le site est en anglais" },
      { id: "d", label: "Confondre marketing et prospectus réglementaire" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q9",
    prompt: "Une attestation AUROS Academy…",
    options: [
      { id: "a", label: "Atteste une compréhension indicative — ne remplace pas un agrément régulateur" },
      { id: "b", label: "Remplace une licence CSSF ou AMF" },
      { id: "c", label: "Garantit un rendement financier" },
      { id: "d", label: "Dispense de tout KYC investisseur" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q10",
    prompt: "Quels actifs sont couramment tokenisés en RWA ?",
    options: [
      { id: "a", label: "Immobilier, obligations, crédit privé, parts de fonds" },
      { id: "b", label: "Uniquement les memes internet" },
      { id: "c", label: "Uniquement le BTC natif" },
      { id: "d", label: "Uniquement les stablecoins algorithmiques" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q11",
    prompt: "Un SPV dans une émission RWA sert surtout à…",
    options: [
      { id: "a", label: "Isoler l'actif et canaliser flux / droits vers investisseurs tokenisés" },
      { id: "b", label: "Éviter toute comptabilité" },
      { id: "c", label: "Remplacer le KYC" },
      { id: "d", label: "Lister sur un DEX sans due diligence" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q12",
    prompt: "Pourquoi la juridiction influence-t-elle la fiscalité investisseur ?",
    options: [
      { id: "a", label: "Règles de retenue, traité fiscal et qualification du token varient par pays" },
      { id: "b", label: "La blockchain impose un taux unique mondial" },
      { id: "c", label: "Seul le pays du wallet compte, jamais le SPV" },
      { id: "d", label: "La fiscalité est toujours nulle partout" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q13",
    prompt: "Le KYC en RWA vise principalement à…",
    options: [
      { id: "a", label: "Identifier investisseurs et vérifier l'éligibilité (retail vs pro)" },
      { id: "b", label: "Fixer le prix du token" },
      { id: "c", label: "Remplacer l'audit smart contract" },
      { id: "d", label: "Supprimer le besoin de prospectus" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q14",
    prompt: "Un promoteur confond souvent « marketing » et…",
    options: [
      { id: "a", label: "Documentation réglementaire / prospectus — risque compliance majeur" },
      { id: "b", label: "Code couleur du logo" },
      { id: "c", label: "Nombre de slides PowerPoint" },
      { id: "d", label: "Version du wallet MetaMask" },
    ],
    correctOptionId: "a",
  },
  {
    id: "q15",
    prompt: "Pourquoi renouveler une attestation AUROS Academy ?",
    options: [
      { id: "a", label: "Cadre RWA et réglementation évoluent — maintien de crédibilité à jour" },
      { id: "b", label: "Obligation légale AMF" },
      { id: "c", label: "Pour recevoir des tokens gratuits" },
      { id: "d", label: "Pour éviter toute due diligence" },
    ],
    correctOptionId: "a",
  },
];

const banksByLocale: Record<AcademyLocale, QuizQuestion[]> = {
  fr: FUNDAMENTALS_BANK,
  en: FUNDAMENTALS_BANK_EN,
  es: FUNDAMENTALS_BANK_ES,
};

function bankForLocale(locale: AcademyLocale = "fr"): QuizQuestion[] {
  return banksByLocale[locale] ?? FUNDAMENTALS_BANK;
}

const bankByIdFr = new Map(FUNDAMENTALS_BANK.map((q) => [q.id, q]));

export function getQuestionById(id: string, locale: AcademyLocale = "fr"): QuizQuestion | undefined {
  const bank = bankForLocale(locale);
  return bank.find((q) => q.id === id) ?? bankByIdFr.get(id);
}

export function pickQuizQuestions(count: number, locale: AcademyLocale = "fr"): QuizQuestion[] {
  const bank = bankForLocale(locale);
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/** Public shape — never includes correctOptionId. */
export function toPublicQuestion(q: QuizQuestion) {
  return {
    id: q.id,
    prompt: q.prompt,
    options: q.options.map(({ id, label }) => ({ id, label })),
  };
}

export function scoreQuestions(
  questions: QuizQuestion[],
  answers: Record<string, string>
): number {
  let score = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctOptionId) score += 1;
  }
  return score;
}

/** @deprecated use FUNDAMENTALS_BANK — kept for legacy tests */
export const FUNDAMENTALS_QUIZ = FUNDAMENTALS_BANK.slice(0, 10);
