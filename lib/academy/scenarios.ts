import type { AcademyScenario } from "./types";

export const FUNDAMENTALS_SCENARIOS: AcademyScenario[] = [
  {
    id: "scenario-promoteur-immo",
    title: "Promoteur immobilier — arbitrage phase 0",
    caseText:
      "Vous conseillez une foncière française (actif €18M, immeuble bureaux Lyon). L'équipe hésite entre Luxembourg et DIFC pour structurer une émission RWA permissioned auprès d'investisseurs professionnels européens et MENA. Délai cible : 6 mois. Budget setup conseil + État : ~€35k max.",
    taskText:
      "Rédigez une note de 120–280 mots : (1) critères de décision juridiction, (2) deux risques compliance si la data room est incomplète, (3) rappel qu'une attestation AUROS Academy ne remplace pas counsel. Pas de listes à puces — paragraphes.",
    minWords: 120,
    maxWords: 280,
    requiredConcepts: [
      "juridiction",
      "luxembourg",
      "difc",
      "data room",
      "kyc",
      "permissioned",
      "spv",
      "counsel",
      "conform",
      "investisseur",
    ],
    rubric: [
      "Mentionne au moins un critère concret d'arbitrage juridiction (coût, délai, régulateur, fiscalité ou KYC)",
      "Identifie un risque lié à documentation / due diligence incomplète",
      "Ne prétend pas garantir un agrément régulateur ou un rendement",
      "Ton professionnel B2B, pas de copier-coller générique type blog crypto",
    ],
  },
  {
    id: "scenario-obligations",
    title: "Obligations corporate — structuration",
    caseText:
      "Une mid-cap veut tokeniser une tranche de dette privée (€5M) pour diversifier la base investisseurs. Équipe juridique interne limitée. Question ouverte : France AMF vs Irlande CBI vs Gibraltar GFSC.",
    taskText:
      "120–280 mots : pourquoi la phase 0 juridiction précède le choix tech/blockchain ? Citez data room, profil investisseur et validation counsel. Expliquez pourquoi un QCM seul ne suffit pas pour certifier un praticien.",
    minWords: 120,
    maxWords: 280,
    requiredConcepts: [
      "phase 0",
      "juridiction",
      "data room",
      "investisseur",
      "amf",
      "prospectus",
      "counsel",
      "token",
      "due diligence",
    ],
    rubric: [
      "Explique la logique phase 0 avant tech",
      "Mentionne data room ou due diligence",
      "Distingue attestation formation vs licence régulateur",
      "Réponse spécifique au cas obligations, pas générique",
    ],
  },
  {
    id: "scenario-fonds",
    title: "Parts de fonds — gouvernance token",
    caseText:
      "Family office suisse souhaite tokeniser des parts d'un véhicule immobilier existant. Investisseurs cibles : pro EU + Suisse. Crainte principale : transferts non autorisés et conformité cross-border.",
    taskText:
      "120–280 mots : expliquez permissioned token, KYC, et pourquoi la gouvernance du registre/on-chain doit s'aligner sur le prospectus. Concluez sur le rôle d'une veille réglementaire trimestrielle (renouvellement attestation).",
    minWords: 120,
    maxWords: 280,
    requiredConcepts: [
      "permissioned",
      "kyc",
      "gouvernance",
      "prospectus",
      "transfert",
      "veille",
      "renouvel",
      "conform",
      "cross",
    ],
    rubric: [
      "Aborder transferts restreints / permissioned",
      "Lier KYC ou éligibilité investisseur",
      "Mentionner veille ou renouvellement attestation",
      "Pas de promesse de performance financière",
    ],
  },
];

export function pickScenario(): AcademyScenario {
  const idx = Math.floor(Math.random() * FUNDAMENTALS_SCENARIOS.length);
  return FUNDAMENTALS_SCENARIOS[idx]!;
}

export function getScenarioById(id: string): AcademyScenario | undefined {
  return FUNDAMENTALS_SCENARIOS.find((s) => s.id === id);
}
