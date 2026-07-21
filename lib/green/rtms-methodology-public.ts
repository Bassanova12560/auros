/**
 * Public RTMS methodology — weights, required docs, refusals, limits.
 * Source of truth for /green/standards (beyond pillar cards).
 */

import { resolveCatalogLocale, type Locale } from "@/lib/i18n";

export type RtmsWeightRow = {
  pillar: string;
  weightPct: number;
  focus: string;
};

export type RtmsMethodologyPublic = {
  weightsTitle: string;
  weightsIntro: string;
  weights: readonly RtmsWeightRow[];
  docsTitle: string;
  docs: readonly string[];
  refusalsTitle: string;
  refusals: readonly string[];
  limitsTitle: string;
  limits: readonly string[];
  tiersTitle: string;
  tiers: readonly { id: string; label: string; meaning: string }[];
};

const FR: RtmsMethodologyPublic = {
  weightsTitle: "Pondération indicative",
  weightsIntro:
    "Poids relatifs pour un pré-diag et une revue humaine — pas un score réglementaire opposable. Les quatre piliers doivent être couverts ; un pilier à zéro bloque le passage Verified.",
  weights: [
    { pillar: "Réel", weightPct: 30, focus: "Preuve off-chain (MWh, tCO₂, contrats, registres)" },
    { pillar: "Transparent", weightPct: 25, focus: "Sources, data room, limites déclarées" },
    { pillar: "Mesurable", weightPct: 25, focus: "Période, périmètre, reproductibilité" },
    { pillar: "Sain", weightPct: 20, focus: "Cadre juridique, risques, absence de rendement garanti" },
  ],
  docsTitle: "Documents attendus (minimum)",
  docs: [
    "Identité de l’émetteur / SPV et rôle dans la chaîne",
    "Preuve d’actif ou de production (contrat, registre, attestation)",
    "Mapping token ↔ actif (si déjà tokenisé) ou intention de structure",
    "Périmètre géographique et période de mesure",
    "Liste des exclusions et ce que le dossier ne prouve pas",
  ],
  refusalsTitle: "Motifs de refus / non-Verified",
  refusals: [
    "Promesse de rendement, APY ou liquidité garantie",
    "Double comptage suspect entre on-chain et off-chain",
    "Absence de preuve primaire pour l’impact revendiqué",
    "Documents expirés ou non traçables vers une contrepartie identifiable",
    "Confusion délibérée entre illustration pédagogique et label Verified",
  ],
  limitsTitle: "Limites assumées",
  limits: [
    "RTMS n’est pas un audit sur site ni un avis MiCA / SFDR",
    "Le pré-diag IA / assistant est indicatif et non opposable",
    "Le badge Verified marché ≠ label registre (processus distincts)",
    "AUROS ne courtage pas et n’exécute pas de transaction",
  ],
  tiersTitle: "Tiers de preuve visibles",
  tiers: [
    {
      id: "illustration",
      label: "Illustration",
      meaning: "Données démo / pédagogiques — jamais présentées comme verified.",
    },
    {
      id: "pilot",
      label: "Pilote",
      meaning: "Cas méthodologique ou listing référencé en revue — preuves partielles.",
    },
    {
      id: "verified",
      label: "Verified",
      meaning: "Revue humaine + dossier RTMS acceptable pour mise en avant marché / registre.",
    },
    {
      id: "in_review",
      label: "En revue",
      meaning: "Paiement ou candidature reçue — badge Verified non accordé tant que la revue n’est pas close.",
    },
  ],
};

const EN: RtmsMethodologyPublic = {
  weightsTitle: "Indicative weighting",
  weightsIntro:
    "Relative weights for pre-check and human review — not a binding regulatory score. All four pillars must be covered; a zero pillar blocks Verified.",
  weights: [
    { pillar: "Real", weightPct: 30, focus: "Off-chain evidence (MWh, tCO₂, contracts, registries)" },
    { pillar: "Transparent", weightPct: 25, focus: "Sources, data room, declared limits" },
    { pillar: "Measurable", weightPct: 25, focus: "Period, scope, reproducibility" },
    { pillar: "Sound", weightPct: 20, focus: "Legal frame, risks, no guaranteed yield" },
  ],
  docsTitle: "Expected documents (minimum)",
  docs: [
    "Issuer / SPV identity and role in the chain",
    "Asset or production evidence (contract, registry, attestation)",
    "Token ↔ asset mapping (if already tokenized) or intended structure",
    "Geographic scope and measurement period",
    "Exclusions and what the file does not prove",
  ],
  refusalsTitle: "Refusal / non-Verified grounds",
  refusals: [
    "Guaranteed yield, APY or liquidity promises",
    "Suspected double counting on-chain / off-chain",
    "No primary evidence for claimed impact",
    "Expired or untraceable documents",
    "Presenting pedagogical illustration as Verified",
  ],
  limitsTitle: "Assumed limits",
  limits: [
    "RTMS is not an on-site audit nor MiCA / SFDR advice",
    "AI / assistant pre-check is indicative only",
    "Market Verified badge ≠ registry label (separate processes)",
    "AUROS does not broker or execute trades",
  ],
  tiersTitle: "Visible proof tiers",
  tiers: [
    {
      id: "illustration",
      label: "Illustration",
      meaning: "Demo / teaching data — never shown as verified.",
    },
    {
      id: "pilot",
      label: "Pilot",
      meaning: "Method case or referenced listing under review — partial proofs.",
    },
    {
      id: "verified",
      label: "Verified",
      meaning: "Human review + RTMS file acceptable for market / registry featured status.",
    },
    {
      id: "in_review",
      label: "In review",
      meaning: "Payment or application received — Verified not granted until review closes.",
    },
  ],
};

const ES: RtmsMethodologyPublic = {
  weightsTitle: "Ponderación indicativa",
  weightsIntro:
    "Pesos relativos para pre-chequeo y revisión humana — no es una nota regulatoria vinculante. Los cuatro pilares deben cubrirse; un pilar a cero bloquea Verified.",
  weights: [
    { pillar: "Real", weightPct: 30, focus: "Prueba off-chain (MWh, tCO₂, contratos, registros)" },
    { pillar: "Transparente", weightPct: 25, focus: "Fuentes, data room, límites declarados" },
    { pillar: "Medible", weightPct: 25, focus: "Periodo, perímetro, reproducibilidad" },
    { pillar: "Sano", weightPct: 20, focus: "Marco jurídico, riesgos, sin rentabilidad garantizada" },
  ],
  docsTitle: "Documentos esperados (mínimo)",
  docs: [
    "Identidad del emisor / SPV y rol en la cadena",
    "Prueba de activo o producción (contrato, registro, atestación)",
    "Mapeo token ↔ activo (si ya tokenizado) o estructura prevista",
    "Ámbito geográfico y periodo de medición",
    "Exclusiones y lo que el expediente no demuestra",
  ],
  refusalsTitle: "Motivos de rechazo / no-Verified",
  refusals: [
    "Promesa de rentabilidad, APY o liquidez garantizada",
    "Doble conteo sospechoso on-chain / off-chain",
    "Ausencia de prueba primaria del impacto reclamado",
    "Documentos caducados o no trazables",
    "Presentar una ilustración pedagógica como Verified",
  ],
  limitsTitle: "Límites asumidos",
  limits: [
    "RTMS no es una auditoría in situ ni un dictamen MiCA / SFDR",
    "El pre-chequeo IA / asistente es solo indicativo",
    "Badge Verified de mercado ≠ sello de registro (procesos distintos)",
    "AUROS no intermedia ni ejecuta operaciones",
  ],
  tiersTitle: "Niveles de prueba visibles",
  tiers: [
    {
      id: "illustration",
      label: "Ilustración",
      meaning: "Datos demo / pedagógicos — nunca presentados como verified.",
    },
    {
      id: "pilot",
      label: "Piloto",
      meaning: "Caso metodológico o listing referenciado en revisión — pruebas parciales.",
    },
    {
      id: "verified",
      label: "Verified",
      meaning: "Revisión humana + expediente RTMS aceptable para destacado mercado / registro.",
    },
    {
      id: "in_review",
      label: "En revisión",
      meaning: "Pago o candidatura recibida — Verified no otorgado hasta cerrar la revisión.",
    },
  ],
};

const BY_LOCALE = { fr: FR, en: EN, es: ES } as const;

export function getRtmsMethodologyPublic(locale: Locale): RtmsMethodologyPublic {
  return BY_LOCALE[resolveCatalogLocale(locale)] ?? FR;
}
