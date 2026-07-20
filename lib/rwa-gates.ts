/**
 * Gates every serious RWA should pass to stand out vs tokenization
 * marketplaces — AUROS owns the proof layer, not custody/DEX.
 */

export type RwaGateId =
  | "hash_seal"
  | "bank_pack"
  | "regulatory_twin"
  | "impact_proof"
  | "embedded_verify";

export type RwaGate = {
  id: RwaGateId;
  step: number;
  title: string;
  counterpartyGets: string;
  whyCompetitorsMiss: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  apiHint?: string;
};

export const RWA_GATES: readonly RwaGate[] = [
  {
    id: "hash_seal",
    step: 1,
    title: "Sceau hash-only",
    counterpartyGets:
      "Attestation ou receipt cryptographique — valid / invalid + hash, sans ouvrir la data room.",
    whyCompetitorsMiss:
      "Les marketplaces RWA exposent un listing ou un PDF. Pas de verify public indépendant.",
    primaryHref: "/verify",
    primaryLabel: "Vérifier une preuve",
    secondaryHref: "/developers/shield",
    secondaryLabel: "Shield docs",
    apiHint: "POST /api/v1/shield/verify · GET /api/v1/attest/verify?id=",
  },
  {
    id: "bank_pack",
    step: 2,
    title: "Evidence Pack banque",
    counterpartyGets:
      "Pack HTML hash-only (CFU + taps) + trail pack_hash — risk desk ready.",
    whyCompetitorsMiss:
      "Data rooms partagées = charge conformité. Les banques veulent une preuve, pas un zip.",
    primaryHref: "/developers/institutions#evidence-pack",
    primaryLabel: "Console institutions",
    secondaryHref: "/developers/shield/banks",
    secondaryLabel: "Pack banques",
    apiHint: "Evidence Pack Premium · verify public gratuit",
  },
  {
    id: "regulatory_twin",
    step: 3,
    title: "Twin réglementaire",
    counterpartyGets:
      "Delta feed hors baseline — impact score indicatif, alertes score / régulation.",
    whyCompetitorsMiss:
      "Un score one-shot vieillit. Sans monitor, le risque post-listing disparaît du radar.",
    primaryHref: "/developers/institutions#monitor-delta",
    primaryLabel: "Charger un delta",
    secondaryHref: "/developers/docs/endpoint-monitor",
    secondaryLabel: "API Monitor",
    apiHint: "POST /api/v1/monitor · GET /api/v1/monitor/:id/delta",
  },
  {
    id: "impact_proof",
    step: 4,
    title: "Preuve impact / risque hydrique",
    counterpartyGets:
      "WELHR (stress + litige local + social license) et signaux Green / CFU — export machine, pas un claim marketing.",
    whyCompetitorsMiss:
      "ESG déclaratif. Aucune marketplace ne score le risque de blocage par l’autorité locale de l’eau.",
    primaryHref: "/eau/risk",
    primaryLabel: "Score WELHR",
    secondaryHref: "/data/licence",
    secondaryLabel: "Licence data",
    apiHint: "POST /api/green/eau/legal-risk · Green API · CFU / Power hors Green Verified",
  },
  {
    id: "embedded_verify",
    step: 5,
    title: "Verify embarqué",
    counterpartyGets:
      "Badge iframe sur la plateforme partenaire — « AUROS verified » dans leur UI.",
    whyCompetitorsMiss:
      "Sans embed, la preuve reste sur le site émetteur. L’usage massif vit chez le partenaire.",
    primaryHref: "/platforms",
    primaryLabel: "Hub plateformes",
    secondaryHref: "/embed/verify",
    secondaryLabel: "Aperçu embed",
    apiHint: "iframe /embed/verify?id=shr_… ou att_…",
  },
] as const;

export const RWA_GATES_ROUTE = "/rwa-gates";
