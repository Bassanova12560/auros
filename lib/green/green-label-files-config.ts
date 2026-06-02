export const GREEN_LABEL_DOCUMENTS_BUCKET = "green-label-documents";

/** Optional supporting PDF on label application (not required for submit). */
export const MAX_GREEN_LABEL_DOCUMENT_BYTES = 5 * 1024 * 1024;

export const ALLOWED_GREEN_LABEL_DOCUMENT_MIME = new Set([
  "application/pdf",
]);

export function sanitizeGreenLabelFileName(name: string): string {
  const base = name.replace(/[/\\]/g, "_").replace(/\.\./g, "_").trim();
  return base.length > 0 ? base.slice(0, 120) : "document.pdf";
}
