export const DOSSIER_STATUSES = [
  "draft",
  "generated",
  "submitted",
  "in_review",
  "needs_info",
  "approved",
] as const;

export type DossierStatus = (typeof DOSSIER_STATUSES)[number];

export function normalizeDossierStatus(raw: string | null | undefined): DossierStatus {
  if (raw && (DOSSIER_STATUSES as readonly string[]).includes(raw)) {
    return raw as DossierStatus;
  }
  return "draft";
}

/** After user submits for AUROS review */
export function isSubmittedOrBeyond(status: DossierStatus): boolean {
  return status !== "draft" && status !== "generated";
}
