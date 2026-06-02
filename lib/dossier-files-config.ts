export const DOSSIER_FILES_BUCKET = "dossier-files";

export const MAX_DOSSIER_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_DOSSIER_MIME = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export function sanitizeFileName(name: string): string {
  const base = name.replace(/[/\\?%*:|"<>]/g, "_").trim();
  return base.slice(0, 120) || "document";
}
