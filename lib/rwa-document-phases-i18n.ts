import type { Locale } from "@/lib/i18n";
import type { DocumentPhaseId } from "@/lib/rwa-document-phases";

type PhaseCopy = { title: string; subtitle: string };

const FR: Record<DocumentPhaseId, PhaseCopy> = {
  asset_prep: {
    title: "Phase 1 — Préparation de l'actif",
    subtitle: "Prouver l'existence, la propriété et la juste valeur",
  },
  legal_compliance: {
    title: "Phase 2 — Juridique & réglementaire",
    subtitle: "SPV, avis juridiques et structure fiscale",
  },
  token_design: {
    title: "Phase 3 — Conception du jeton",
    subtitle: "Narratif d'offre et audit technique",
  },
  investor_protection: {
    title: "Phase 4 — Protection des investisseurs",
    subtitle: "Information réglementée et KYC/AML",
  },
  operations: {
    title: "Phase 5 — Opérations",
    subtitle: "Garde, reporting et continuité",
  },
};

const EN: Record<DocumentPhaseId, PhaseCopy> = {
  asset_prep: {
    title: "Phase 1 — Asset preparation",
    subtitle: "Prove existence, ownership, and fair value",
  },
  legal_compliance: {
    title: "Phase 2 — Legal & regulatory",
    subtitle: "SPV, opinions, and tax structure",
  },
  token_design: {
    title: "Phase 3 — Token design",
    subtitle: "Offering narrative and technical audit",
  },
  investor_protection: {
    title: "Phase 4 — Investor protection",
    subtitle: "Disclosure and KYC/AML",
  },
  operations: {
    title: "Phase 5 — Operations",
    subtitle: "Custody, reporting, and continuity",
  },
};

const ES: Record<DocumentPhaseId, PhaseCopy> = {
  asset_prep: {
    title: "Fase 1 — Preparación del activo",
    subtitle: "Probar existencia, propiedad y valor razonable",
  },
  legal_compliance: {
    title: "Fase 2 — Legal y regulatorio",
    subtitle: "SPV, dictámenes y estructura fiscal",
  },
  token_design: {
    title: "Fase 3 — Diseño del token",
    subtitle: "Narrativa de la oferta y auditoría técnica",
  },
  investor_protection: {
    title: "Fase 4 — Protección del inversor",
    subtitle: "Divulgación y KYC/AML",
  },
  operations: {
    title: "Fase 5 — Operaciones",
    subtitle: "Custodia, reporting y continuidad",
  },
};

const MAP = { fr: FR, en: EN, es: ES } as const;

export function rwaPhaseCopy(
  locale: Locale,
  phaseId: DocumentPhaseId
): PhaseCopy {
  return MAP[locale][phaseId];
}
