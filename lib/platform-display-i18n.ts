import { resolveCatalogLocale, type CatalogMap, type Locale } from "@/lib/i18n";
import type { RwaPlatformId } from "@/lib/rwa-platforms";
import type { PlatformMatchResult } from "@/lib/platform-match";

type PlatformCopy = {
  description: string;
  processTimeline: string;
  keyRequirements: string;
  label: string;
};

const FR: Record<RwaPlatformId, PlatformCopy> = {
  tokenfi: {
    description:
      "Propriété légale, base AML/KYC et documentation d'actif pour l'émission.",
    processTimeline: "1 à 4 semaines (setup & conformité)",
    keyRequirements: "Propriété légale · AML/KYC · Détails de l'actif",
    label: "BON MATCH",
  },
  rwa_xyz: {
    description:
      "Source de vérité on-chain, structure vérifiable et classification publique.",
    processTimeline: "Due diligence par actif",
    keyRequirements: "Vérité on-chain · Structure légale · Jeton déployé",
    label: "MATCH SOLIDE",
  },
  ix_swap: {
    description:
      "Émetteur principal KYC/AML, disclosures corporate et contrats audités.",
    processTimeline: "Multi-étapes : soumission → déploiement",
    keyRequirements: "Docs corporate · Finances auditées · Audit SC · KYC/AML",
    label: "ADMISSION ÉLEVÉE",
  },
  stobox: {
    description:
      "Propriété vérifiable, cashflow ou participation ; audit de pré-qualification.",
    processTimeline: "5 à 7 jours — audit de pré-qualification",
    keyRequirements: "Preuve de propriété · Cashflow · Cartographie réglementaire",
    label: "PROBABLE",
  },
  centrifuge: {
    description:
      "Idéal pour l'immobilier et le crédit privé — RWA Launchpad institutionnel.",
    processTimeline: "Revue d'inclusion publique",
    keyRequirements: "Pool RWA · KYC investisseurs · Documentation SPV",
    label: "ADMISSION ÉLEVÉE",
  },
  ondo: {
    description: "Investisseurs qualifiés · actifs institutionnels tokenisés.",
    processTimeline: "Processus institutionnel (plusieurs semaines)",
    keyRequirements: "Investisseurs accrédités · Due diligence renforcée",
    label: "PROBABLE",
  },
  polymesh: {
    description: "Actifs régulés sur chaîne permissionnée.",
    processTimeline: "Onboarding émetteur + conformité",
    keyRequirements: "KYC émetteur · Actifs éligibles · Politique transferts",
    label: "POSSIBLE",
  },
  defillama: {
    description: "Preuve off-chain publique et transparence émetteur.",
    processTimeline: "Listing & vérification données",
    keyRequirements: "Transparence · Preuves on-chain/off-chain",
    label: "POSSIBLE",
  },
};

const EN: Record<RwaPlatformId, PlatformCopy> = {
  tokenfi: {
    description:
      "Legal ownership, AML/KYC baseline, and asset documentation for token issuance.",
    processTimeline: "1–4 weeks (setup & compliance)",
    keyRequirements: "Legal ownership · AML/KYC · Asset details",
    label: "GOOD MATCH",
  },
  rwa_xyz: {
    description:
      "On-chain source of truth, verifiable structure, and public asset classification.",
    processTimeline: "Due diligence per asset",
    keyRequirements: "On-chain truth · Legal structure · Token deployed",
    label: "STRONG MATCH",
  },
  ix_swap: {
    description:
      "Principal issuer KYC/AML, corporate and financial disclosures, audited contracts.",
    processTimeline: "Multi-step: submission → contract deployment",
    keyRequirements: "Corporate docs · Audited financials · SC audit · KYC/AML",
    label: "HIGH ADMISSION",
  },
  stobox: {
    description:
      "Verifiable ownership, cashflow or equity participation; pre-qualification audit first.",
    processTimeline: "5–7 days pre-qualification audit",
    keyRequirements: "Ownership proof · Cashflow · Regulatory mapping",
    label: "LIKELY",
  },
  centrifuge: {
    description:
      "Ideal for real estate and private credit — institutional RWA launchpad.",
    processTimeline: "Public inclusion review",
    keyRequirements: "RWA pool · Investor KYC · SPV documentation",
    label: "HIGH ADMISSION",
  },
  ondo: {
    description: "Qualified investors · institutional tokenized assets.",
    processTimeline: "Institutional process (several weeks)",
    keyRequirements: "Accredited investors · Enhanced due diligence",
    label: "LIKELY",
  },
  polymesh: {
    description: "Regulated assets on a permissioned chain.",
    processTimeline: "Issuer onboarding + compliance",
    keyRequirements: "Issuer KYC · Eligible assets · Transfer policy",
    label: "POSSIBLE",
  },
  defillama: {
    description: "Public off-chain proof and issuer transparency.",
    processTimeline: "Listing & data verification",
    keyRequirements: "Transparency · On-chain/off-chain proofs",
    label: "POSSIBLE",
  },
};

const ES: Record<RwaPlatformId, PlatformCopy> = {
  tokenfi: {
    description:
      "Propiedad legal, base AML/KYC y documentación del activo para la emisión.",
    processTimeline: "1–4 semanas (setup y cumplimiento)",
    keyRequirements: "Propiedad legal · AML/KYC · Detalles del activo",
    label: "BUEN MATCH",
  },
  rwa_xyz: {
    description:
      "Fuente de verdad on-chain, estructura verificable y clasificación pública.",
    processTimeline: "Due diligence por activo",
    keyRequirements: "Verdad on-chain · Estructura legal · Token desplegado",
    label: "MATCH FUERTE",
  },
  ix_swap: {
    description:
      "Emisor principal KYC/AML, divulgaciones corporativas y contratos auditados.",
    processTimeline: "Varias etapas: envío → despliegue",
    keyRequirements: "Docs corporativos · Finanzas auditadas · Auditoría SC",
    label: "ALTA ADMISIÓN",
  },
  stobox: {
    description:
      "Propiedad verificable, cashflow o participación; auditoría de precalificación.",
    processTimeline: "5–7 días — auditoría de precalificación",
    keyRequirements: "Prueba de propiedad · Cashflow · Mapa regulatorio",
    label: "PROBABLE",
  },
  centrifuge: {
    description:
      "Ideal para inmobiliario y crédito privado — launchpad RWA institucional.",
    processTimeline: "Revisión pública de inclusión",
    keyRequirements: "Pool RWA · KYC inversores · Documentación SPV",
    label: "ALTA ADMISIÓN",
  },
  ondo: {
    description: "Inversores cualificados · activos institucionales tokenizados.",
    processTimeline: "Proceso institucional (varias semanas)",
    keyRequirements: "Inversores acreditados · Due diligence reforzada",
    label: "PROBABLE",
  },
  polymesh: {
    description: "Activos regulados en cadena permissionada.",
    processTimeline: "Onboarding emisor + cumplimiento",
    keyRequirements: "KYC emisor · Activos elegibles · Política de transferencias",
    label: "POSIBLE",
  },
  defillama: {
    description: "Prueba off-chain pública y transparencia del emisor.",
    processTimeline: "Listado y verificación de datos",
    keyRequirements: "Transparencia · Pruebas on-chain/off-chain",
    label: "POSIBLE",
  },
};

const MAP = { fr: FR, en: EN, es: ES } as const;

const MATCH_LABELS: CatalogMap<
  Record<PlatformMatchResult["label"], string>
> = {
  fr: {
    "HIGH ADMISSION": "ADMISSION ÉLEVÉE",
    LIKELY: "PROBABLE",
    POSSIBLE: "POSSIBLE",
    LOW: "FAIBLE",
    "STRONG MATCH": "MATCH SOLIDE",
    "GOOD MATCH": "BON MATCH",
  },
  en: {
    "HIGH ADMISSION": "HIGH ADMISSION",
    LIKELY: "LIKELY",
    POSSIBLE: "POSSIBLE",
    LOW: "LOW",
    "STRONG MATCH": "STRONG MATCH",
    "GOOD MATCH": "GOOD MATCH",
  },
  es: {
    "HIGH ADMISSION": "ALTA ADMISIÓN",
    LIKELY: "PROBABLE",
    POSSIBLE: "POSIBLE",
    LOW: "BAJA",
    "STRONG MATCH": "MATCH FUERTE",
    "GOOD MATCH": "BUEN MATCH",
  },
};

export function localizePlatformMatch(
  locale: Locale,
  platform: PlatformMatchResult
): PlatformMatchResult {
  const copy = MAP[resolveCatalogLocale(locale)][platform.id];
  return {
    ...platform,
    description: copy.description,
    processTimeline: copy.processTimeline,
    keyRequirements: copy.keyRequirements,
    label: MATCH_LABELS[resolveCatalogLocale(locale)][platform.label] as PlatformMatchResult["label"],
  };
}

export function admissionOverallLabel(
  locale: Locale,
  label: string
): string {
  const table: CatalogMap< Record<string, string>> = {
    fr: {
      "READY TO SUBMIT": "PRÊT À SOUMETTRE",
      "STRONG CANDIDATE": "CANDIDAT SOLIDE",
      "IN PREPARATION": "EN PRÉPARATION",
      "EARLY STAGE": "PHASE INITIALE",
    },
    en: {
      "READY TO SUBMIT": "READY TO SUBMIT",
      "STRONG CANDIDATE": "STRONG CANDIDATE",
      "IN PREPARATION": "IN PREPARATION",
      "EARLY STAGE": "EARLY STAGE",
    },
    es: {
      "READY TO SUBMIT": "LISTO PARA ENVIAR",
      "STRONG CANDIDATE": "CANDIDATO FUERTE",
      "IN PREPARATION": "EN PREPARACIÓN",
      "EARLY STAGE": "FASE INICIAL",
    },
  };
  return table[resolveCatalogLocale(locale)][label] ?? label;
}
