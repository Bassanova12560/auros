/** In-memory PDF text extraction for RTMS assistant — nothing persisted. */

export const MAX_RTMS_PDF_BYTES = 5 * 1024 * 1024;
export const MAX_RTMS_PDF_TEXT_CHARS = 12_000;

export function normalizeRtmsPdfText(raw: string): string {
  return raw
    .replace(/\0/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_RTMS_PDF_TEXT_CHARS);
}

export function validateRtmsPdfFile(file: File | null | undefined): "ok" | "file_type" | "file_size" {
  if (!file || file.size === 0) return "ok";
  if (file.size > MAX_RTMS_PDF_BYTES) return "file_size";
  const mime = file.type || "application/octet-stream";
  if (mime !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "file_type";
  }
  return "ok";
}

export async function extractRtmsPdfText(buffer: Buffer): Promise<string> {
  if (!buffer.length) return "";
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return normalizeRtmsPdfText(result.text ?? "");
  } catch (err) {
    console.warn("[rtms-pdf] extraction failed", err instanceof Error ? err.message : err);
    return "";
  }
}
