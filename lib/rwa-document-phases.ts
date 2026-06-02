/**
 * Data room structure — 15 documents across 5 phases (industry-standard RWA package).
 */

export type DocumentPhaseId =
  | "asset_prep"
  | "legal_compliance"
  | "token_design"
  | "investor_protection"
  | "operations";

export type RwaDocumentId =
  | "proof_of_ownership"
  | "valuation_report"
  | "due_diligence_report"
  | "spv_documents"
  | "legal_opinion"
  | "tax_memo"
  | "whitepaper"
  | "tokenomics"
  | "smart_contract_audit"
  | "prospectus"
  | "risk_disclosure"
  | "kyc_aml_policy"
  | "custody_audit_agreements"
  | "financial_reporting_plan"
  | "insurance_guarantees";

export type DocumentPhase = {
  id: DocumentPhaseId;
  title: string;
  subtitle: string;
  documents: Array<{
    id: RwaDocumentId;
    label: string;
    weight: number;
  }>;
};

export const RWA_DOCUMENT_PHASES: DocumentPhase[] = [
  {
    id: "asset_prep",
    title: "Phase 1 — Asset preparation",
    subtitle: "Prove existence, ownership, and fair value",
    documents: [
      { id: "proof_of_ownership", label: "Proof of ownership", weight: 10 },
      { id: "valuation_report", label: "Independent valuation report", weight: 10 },
      { id: "due_diligence_report", label: "Due diligence report", weight: 8 },
    ],
  },
  {
    id: "legal_compliance",
    title: "Phase 2 — Legal & regulatory",
    subtitle: "SPV, opinions, and tax structure",
    documents: [
      { id: "spv_documents", label: "SPV formation documents", weight: 9 },
      { id: "legal_opinion", label: "Legal opinion letter", weight: 9 },
      { id: "tax_memo", label: "Tax memorandum", weight: 6 },
    ],
  },
  {
    id: "token_design",
    title: "Phase 3 — Token design",
    subtitle: "Offering narrative and technical audit",
    documents: [
      { id: "whitepaper", label: "Whitepaper / project overview", weight: 5 },
      { id: "tokenomics", label: "Tokenomics documentation", weight: 5 },
      {
        id: "smart_contract_audit",
        label: "Smart contract security audit",
        weight: 8,
      },
    ],
  },
  {
    id: "investor_protection",
    title: "Phase 4 — Investor protection",
    subtitle: "Disclosure and KYC/AML",
    documents: [
      { id: "prospectus", label: "Prospectus / investment memo", weight: 7 },
      { id: "risk_disclosure", label: "Risk disclosure statement", weight: 6 },
      { id: "kyc_aml_policy", label: "KYC/AML policy manual", weight: 8 },
    ],
  },
  {
    id: "operations",
    title: "Phase 5 — Operations",
    subtitle: "Custody, reporting, and insurance",
    documents: [
      {
        id: "custody_audit_agreements",
        label: "Custody & audit agreements",
        weight: 6,
      },
      {
        id: "financial_reporting_plan",
        label: "Financial reporting plan",
        weight: 5,
      },
      { id: "insurance_guarantees", label: "Insurance / guarantees", weight: 6 },
    ],
  },
];

export const ALL_RWA_DOCUMENT_IDS: RwaDocumentId[] = RWA_DOCUMENT_PHASES.flatMap(
  (p) => p.documents.map((d) => d.id)
);

export const RWA_DOCUMENT_WEIGHTS: Record<RwaDocumentId, number> =
  Object.fromEntries(
    RWA_DOCUMENT_PHASES.flatMap((p) =>
      p.documents.map((d) => [d.id, d.weight])
    )
  ) as Record<RwaDocumentId, number>;

export const RWA_DOCUMENT_LABELS: Record<RwaDocumentId, string> =
  Object.fromEntries(
    RWA_DOCUMENT_PHASES.flatMap((p) =>
      p.documents.map((d) => [d.id, d.label])
    )
  ) as Record<RwaDocumentId, string>;

/** Migrate legacy wizard document labels to data-room IDs. */
export const LEGACY_DOCUMENT_MAP: Record<string, RwaDocumentId> = {
  "Title deed": "proof_of_ownership",
  "Expert valuation": "valuation_report",
  Photos: "proof_of_ownership",
  "Insurance policy": "insurance_guarantees",
  "Notarial certificate": "proof_of_ownership",
  "Tax records": "tax_memo",
  "Purchase invoice": "proof_of_ownership",
};

export function normalizeDocumentIds(raw: string[]): RwaDocumentId[] {
  const out = new Set<RwaDocumentId>();
  for (const item of raw) {
    if (!item || item === "None yet") continue;
    if (ALL_RWA_DOCUMENT_IDS.includes(item as RwaDocumentId)) {
      out.add(item as RwaDocumentId);
      continue;
    }
    const mapped = LEGACY_DOCUMENT_MAP[item];
    if (mapped) out.add(mapped);
  }
  return [...out];
}

export function documentPhaseProgress(
  held: RwaDocumentId[]
): Array<{
  phase: DocumentPhase;
  held: number;
  total: number;
  percent: number;
}> {
  const heldSet = new Set(held);
  return RWA_DOCUMENT_PHASES.map((phase) => {
    const total = phase.documents.length;
    const heldCount = phase.documents.filter((d) => heldSet.has(d.id)).length;
    return {
      phase,
      held: heldCount,
      total,
      percent: total ? Math.round((heldCount / total) * 100) : 0,
    };
  });
}
