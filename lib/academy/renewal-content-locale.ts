import type { QuizQuestion } from "./types";

export const RENEWAL_QUIZ_EN: QuizQuestion[] = [
  {
    id: "r1",
    prompt: "[2026 update] Why does AUROS Academy require a guided practical challenge after the quiz?",
    options: [
      { id: "a", label: "Verify understanding with objective criteria, not MCQ alone" },
      { id: "b", label: "Replace a lawyer" },
      { id: "c", label: "Avoid any data room" },
      { id: "d", label: "Guarantee fixed returns" },
    ],
    correctOptionId: "a",
  },
  {
    id: "r2",
    prompt: "[2026 update] Validity period of an AUROS Academy Fundamentals certificate?",
    options: [
      { id: "a", label: "90 days — micro-renewal track required" },
      { id: "b", label: "Unlimited without updates" },
      { id: "c", label: "24 hours" },
      { id: "d", label: "10-year state licence" },
    ],
    correctOptionId: "a",
  },
  {
    id: "r3",
    prompt: "[2026 update] MiCA and RWA issuance in the EU — prudent approach?",
    options: [
      { id: "a", label: "Analyse token qualification + issuer/CASP status with counsel" },
      { id: "b", label: "MiCA never applies to RWA" },
      { id: "c", label: "Deploy without KYC if whitepaper is in English" },
      { id: "d", label: "Ignore SPV jurisdiction" },
    ],
    correctOptionId: "a",
  },
];

export const RENEWAL_QUIZ_ES: QuizQuestion[] = [
  {
    id: "r1",
    prompt: "[Actualización 2026] ¿Por qué AUROS Academy exige un desafío práctico guiado tras el quiz?",
    options: [
      { id: "a", label: "Verificar comprensión con criterios objetivos, no solo el test" },
      { id: "b", label: "Sustituir a un abogado" },
      { id: "c", label: "Evitar toda data room" },
      { id: "d", label: "Garantizar rentabilidad fija" },
    ],
    correctOptionId: "a",
  },
  {
    id: "r2",
    prompt: "[Actualización 2026] ¿Duración de validez de un certificado Fundamentos AUROS Academy?",
    options: [
      { id: "a", label: "90 días — micro-recorrido de renovación requerido" },
      { id: "b", label: "Ilimitada sin actualización" },
      { id: "c", label: "24 horas" },
      { id: "d", label: "10 años de licencia estatal" },
    ],
    correctOptionId: "a",
  },
  {
    id: "r3",
    prompt: "[Actualización 2026] MiCA y emisiones RWA en la UE — postura prudente?",
    options: [
      { id: "a", label: "Analizar calificación del token + estatus emisor/CASP con counsel" },
      { id: "b", label: "MiCA nunca aplica a RWA" },
      { id: "c", label: "Desplegar sin KYC si el whitepaper está en inglés" },
      { id: "d", label: "Ignorar jurisdicción del SPV" },
    ],
    correctOptionId: "a",
  },
];
