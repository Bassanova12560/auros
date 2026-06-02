import type { QuizQuestion } from "@/lib/academy/types";
import type { Locale } from "@/lib/i18n";

import { GREEN_PRATICIEN_QUIZ_LENGTH } from "./constants";

const BANK_FR: QuizQuestion[] = [
  {
    id: "gp1",
    prompt: "Le pilier « Réel » RTMS exige surtout…",
    options: [
      { id: "a", label: "Un impact mesurable hors blockchain (MWh, tCO₂…)" },
      { id: "b", label: "Un logo vert sur le site" },
      { id: "c", label: "Un token listé sur un CEX" },
      { id: "d", label: "Zéro documentation" },
    ],
    correctOptionId: "a",
  },
  {
    id: "gp2",
    prompt: "« Transparent » signifie notamment…",
    options: [
      { id: "a", label: "Traçabilité token → actif et limites déclarées" },
      { id: "b", label: "Anonymat total des investisseurs" },
      { id: "c", label: "Absence de registre off-chain" },
      { id: "d", label: "Marketing sans sources" },
    ],
    correctOptionId: "a",
  },
  {
    id: "gp3",
    prompt: "Un risque majeur sur les crédits carbone tokenisés est…",
    options: [
      { id: "a", label: "Le double comptage ou vintage non vérifiable" },
      { id: "b", label: "Un rendement garanti 12 %" },
      { id: "c", label: "L'absence de blockchain" },
      { id: "d", label: "Un token non fongible obligatoire" },
    ],
    correctOptionId: "a",
  },
  {
    id: "gp4",
    prompt: "Un REC (certificat vert) représente typiquement…",
    options: [
      { id: "a", label: "1 MWh d'énergie renouvelable attribuée" },
      { id: "b", label: "1 action en bourse" },
      { id: "c", label: "1 BTC miné vert" },
      { id: "d", label: "Un droit de vote DAO" },
    ],
    correctOptionId: "a",
  },
  {
    id: "gp5",
    prompt: "Un cas pilote RTMS AUROS Green se distingue d'un Verified car…",
    options: [
      { id: "a", label: "C'est une démo méthodologique — pas un audit investisseur complet" },
      { id: "b", label: "Il garantit un APY" },
      { id: "c", label: "Il remplace MiCA" },
      { id: "d", label: "Il est toujours secret" },
    ],
    correctOptionId: "a",
  },
  {
    id: "gp6",
    prompt: "Pour un PPA solaire tokenisé, quel point RTMS « Sain » est critique ?",
    options: [
      { id: "a", label: "Cadre juridique du token et risques opérationnels exposés" },
      { id: "b", label: "Couleur du dashboard" },
      { id: "c", label: "Nombre de followers" },
      { id: "d", label: "Listing CEX obligatoire" },
    ],
    correctOptionId: "a",
  },
  {
    id: "gp7",
    prompt: "Le comparateur AUROS Green liste des projets « référence marché » — cela signifie…",
    options: [
      { id: "a", label: "Éducatif et sourcé — pas automatiquement Auros Green Verified" },
      { id: "b", label: "Tous sont certifiés AUROS" },
      { id: "c", label: "Conseil d'investissement agréé" },
      { id: "d", label: "Audit sur site effectué" },
    ],
    correctOptionId: "a",
  },
  {
    id: "gp8",
    prompt: "Une attestation on-chain utile pour un actif vert doit…",
    options: [
      { id: "a", label: "Pointer vers une source mesurable vérifiable" },
      { id: "b", label: "Remplacer le registre off-chain sans lien" },
      { id: "c", label: "Garantir un prix plancher" },
      { id: "d", label: "Supprimer le KYC" },
    ],
    correctOptionId: "a",
  },
  {
    id: "gp9",
    prompt: "Greenwashing typique à signaler en audit RTMS…",
    options: [
      { id: "a", label: "Impact vague sans périmètre ni période" },
      { id: "b", label: "Data room complète" },
      { id: "c", label: "Registre carbone officiel cité" },
      { id: "d", label: "Contrats PPA datés" },
    ],
    correctOptionId: "a",
  },
  {
    id: "gp10",
    prompt: "Le badge expert Green AUROS (Phase 3) atteste…",
    options: [
      { id: "a", label: "Compréhension RTMS — pas un agrément régulateur" },
      { id: "b", label: "Licence AMF/CSSF" },
      { id: "c", label: "Droit d'auditer sans consentement du projet" },
      { id: "d", label: "Garantie de rendement client" },
    ],
    correctOptionId: "a",
  },
  {
    id: "gp11",
    prompt: "Pour tokeniser un surplus énergétique, la première étape est…",
    options: [
      { id: "a", label: "Qualifier le surplus (kWh/MWh, contrats réseau)" },
      { id: "b", label: "Mint sans mesure" },
      { id: "c", label: "Promettre un APY fixe" },
      { id: "d", label: "Ignorer la juridiction" },
    ],
    correctOptionId: "a",
  },
  {
    id: "gp12",
    prompt: "MiCA peut concerner un token vert RWA quand…",
    options: [
      { id: "a", label: "Le token est un crypto-actif offert à des investisseurs UE selon le cas" },
      { id: "b", label: "Jamais — MiCA ignore la tokenisation" },
      { id: "c", label: "Uniquement pour les NFT art" },
      { id: "d", label: "Seulement hors UE" },
    ],
    correctOptionId: "a",
  },
];

const BANK_EN: QuizQuestion[] = BANK_FR.map((q) => ({
  ...q,
  prompt:
    q.id === "gp1"
      ? "The RTMS « Real » pillar mainly requires…"
      : q.id === "gp2"
        ? "« Transparent » notably means…"
        : q.id === "gp3"
          ? "A major risk with tokenized carbon credits is…"
          : q.id === "gp4"
            ? "A REC (green certificate) typically represents…"
            : q.id === "gp5"
              ? "An AUROS Green RTMS pilot case differs from Verified because…"
              : q.id === "gp6"
                ? "For a tokenized solar PPA, which RTMS « Sound » point is critical?"
                : q.id === "gp7"
                  ? "The AUROS Green comparator lists « market reference » rows — this means…"
                  : q.id === "gp8"
                    ? "A useful on-chain attestation for a green asset must…"
                    : q.id === "gp9"
                      ? "Typical greenwashing to flag in RTMS audit…"
                      : q.id === "gp10"
                        ? "The AUROS Green expert badge (Phase 3) attests…"
                        : q.id === "gp11"
                          ? "To tokenize an energy surplus, the first step is…"
                          : "MiCA may apply to a green RWA token when…",
  options:
    q.id === "gp1"
      ? [
          { id: "a", label: "Measurable off-chain impact (MWh, tCO₂…)" },
          { id: "b", label: "A green logo on the website" },
          { id: "c", label: "A CEX listing" },
          { id: "d", label: "Zero documentation" },
        ]
      : q.id === "gp2"
        ? [
            { id: "a", label: "Token → asset traceability and stated limits" },
            { id: "b", label: "Total investor anonymity" },
            { id: "c", label: "No off-chain registry" },
            { id: "d", label: "Marketing without sources" },
          ]
        : q.options,
  correctOptionId: q.correctOptionId,
}));

const BANK_ES: QuizQuestion[] = BANK_FR.map((q) => ({
  ...q,
  prompt:
    q.id === "gp1"
      ? "El pilar RTMS « Real » exige principalmente…"
      : q.id === "gp2"
        ? "« Transparente » significa en particular…"
        : q.id === "gp3"
          ? "Un riesgo mayor en créditos de carbono tokenizados es…"
          : q.id === "gp4"
            ? "Un REC (certificado verde) representa típicamente…"
            : q.id === "gp5"
              ? "Un caso piloto RTMS AUROS Green se distingue de Verified porque…"
              : q.id === "gp6"
                ? "Para un PPA solar tokenizado, ¿qué punto RTMS « Sano » es crítico?"
                : q.id === "gp7"
                  ? "El comparador AUROS Green lista filas « referencia de mercado » — esto significa…"
                  : q.id === "gp8"
                    ? "Una attestation on-chain útil para un activo verde debe…"
                    : q.id === "gp9"
                      ? "Greenwashing típico a señalar en auditoría RTMS…"
                      : q.id === "gp10"
                        ? "El badge experto Green AUROS (Fase 3) acredita…"
                        : q.id === "gp11"
                          ? "Para tokenizar un excedente energético, el primer paso es…"
                          : "MiCA puede aplicarse a un token RWA verde cuando…",
  options:
    q.id === "gp1"
      ? [
          { id: "a", label: "Impacto medible off-chain (MWh, tCO₂…)" },
          { id: "b", label: "Un logo verde en el sitio" },
          { id: "c", label: "Un token listado en un CEX" },
          { id: "d", label: "Cero documentación" },
        ]
      : q.id === "gp2"
        ? [
            { id: "a", label: "Trazabilidad token → activo y límites declarados" },
            { id: "b", label: "Anonimato total de inversores" },
            { id: "c", label: "Ausencia de registro off-chain" },
            { id: "d", label: "Marketing sin fuentes" },
          ]
        : q.id === "gp3"
          ? [
              { id: "a", label: "Doble conteo o vintage no verificable" },
              { id: "b", label: "Un rendimiento garantizado del 12 %" },
              { id: "c", label: "Ausencia de blockchain" },
              { id: "d", label: "Token no fungible obligatorio" },
            ]
          : q.id === "gp4"
            ? [
                { id: "a", label: "1 MWh de energía renovable atribuida" },
                { id: "b", label: "1 acción en bolsa" },
                { id: "c", label: "1 BTC minado verde" },
                { id: "d", label: "Un derecho de voto DAO" },
              ]
            : q.id === "gp5"
              ? [
                  { id: "a", label: "Es una demo metodológica — no una auditoría de inversión completa" },
                  { id: "b", label: "Garantiza un APY" },
                  { id: "c", label: "Sustituye a MiCA" },
                  { id: "d", label: "Siempre es secreto" },
                ]
              : q.id === "gp6"
                ? [
                    { id: "a", label: "Marco jurídico del token y riesgos operativos expuestos" },
                    { id: "b", label: "Color del dashboard" },
                    { id: "c", label: "Número de seguidores" },
                    { id: "d", label: "Listing CEX obligatorio" },
                  ]
                : q.id === "gp7"
                  ? [
                      { id: "a", label: "Educativo y documentado — no automáticamente Auros Green Verified" },
                      { id: "b", label: "Todos están certificados AUROS" },
                      { id: "c", label: "Asesoramiento de inversión autorizado" },
                      { id: "d", label: "Auditoría in situ realizada" },
                    ]
                  : q.id === "gp8"
                    ? [
                        { id: "a", label: "Apuntar a una fuente medible verificable" },
                        { id: "b", label: "Sustituir el registro off-chain sin enlace" },
                        { id: "c", label: "Garantizar un precio mínimo" },
                        { id: "d", label: "Eliminar el KYC" },
                      ]
                    : q.id === "gp9"
                      ? [
                          { id: "a", label: "Impacto vago sin perímetro ni periodo" },
                          { id: "b", label: "Data room completa" },
                          { id: "c", label: "Registro de carbono oficial citado" },
                          { id: "d", label: "Contratos PPA fechados" },
                        ]
                      : q.id === "gp10"
                        ? [
                            { id: "a", label: "Comprensión RTMS — no una autorización regulatoria" },
                            { id: "b", label: "Licencia AMF/CSSF" },
                            { id: "c", label: "Derecho de auditar sin consentimiento del proyecto" },
                            { id: "d", label: "Garantía de rendimiento al cliente" },
                          ]
                        : q.id === "gp11"
                          ? [
                              { id: "a", label: "Cualificar el excedente (kWh/MWh, contratos de red)" },
                              { id: "b", label: "Mint sin medición" },
                              { id: "c", label: "Prometer un APY fijo" },
                              { id: "d", label: "Ignorar la jurisdicción" },
                            ]
                          : [
                              { id: "a", label: "El token es un criptoactivo ofrecido a inversores UE según el caso" },
                              { id: "b", label: "Nunca — MiCA ignora la tokenización" },
                              { id: "c", label: "Solo para NFT de arte" },
                              { id: "d", label: "Solo fuera de la UE" },
                            ],
  correctOptionId: q.correctOptionId,
}));

const banks: Record<Locale, QuizQuestion[]> = {
  fr: BANK_FR,
  en: BANK_EN,
  es: BANK_ES,
};

export function pickGreenPraticienQuestions(locale: Locale = "fr"): QuizQuestion[] {
  const bank = banks[locale] ?? BANK_FR;
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, GREEN_PRATICIEN_QUIZ_LENGTH);
}

export function getGreenPraticienQuestion(id: string, locale: Locale = "fr"): QuizQuestion | undefined {
  const bank = banks[locale] ?? BANK_FR;
  return bank.find((q) => q.id === id) ?? BANK_FR.find((q) => q.id === id);
}

export function scoreGreenPraticienQuiz(
  questions: QuizQuestion[],
  answers: Record<string, string>
): number {
  let score = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctOptionId) score += 1;
  }
  return score;
}

export function toPublicGreenQuestion(q: QuizQuestion) {
  return {
    id: q.id,
    prompt: q.prompt,
    options: q.options.map(({ id, label }) => ({ id, label })),
  };
}
