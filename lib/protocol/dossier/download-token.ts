import { createHmac, timingSafeEqual } from "node:crypto";

const DEV_SECRET = "auros-dossier-download-dev-secret";
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function isProduction(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  );
}

function dossierSecret(): string {
  const s =
    process.env.DOSSIER_DOWNLOAD_SECRET?.trim() ||
    process.env.WEBHOOK_SECRET?.trim();
  if (s && (!isProduction() || s !== DEV_SECRET)) return s;
  if (isProduction()) return DEV_SECRET;
  return DEV_SECRET;
}

function sign(payload: string): string {
  return createHmac("sha256", dossierSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export function createDossierDownloadToken(input: {
  dossierId: string;
  keyHash: string;
  format: "pdf" | "json" | "zip";
}): string {
  const payload = JSON.stringify({
    dossier_id: input.dossierId,
    key_hash: input.keyHash,
    format: input.format,
    exp: Date.now() + TOKEN_TTL_MS,
  });
  const sig = sign(payload);
  return Buffer.from(JSON.stringify({ p: payload, s: sig })).toString("base64url");
}

export function verifyDossierDownloadToken(
  token: string
): { dossierId: string; keyHash: string; format: "pdf" | "json" | "zip" } | null {
  try {
    const raw = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8")
    ) as { p?: string; s?: string };
    if (!raw.p || !raw.s) return null;
    if (!safeEqual(sign(raw.p), raw.s)) return null;

    const data = JSON.parse(raw.p) as {
      dossier_id?: string;
      key_hash?: string;
      format?: string;
      exp?: number;
    };
    if (!data.dossier_id || !data.key_hash || !data.format) return null;
    if (typeof data.exp !== "number" || Date.now() > data.exp) return null;
    if (!["pdf", "json", "zip"].includes(data.format)) return null;

    return {
      dossierId: data.dossier_id,
      keyHash: data.key_hash,
      format: data.format as "pdf" | "json" | "zip",
    };
  } catch {
    return null;
  }
}

export function suggestedDossierFilename(dossierId: string): string {
  return `auros-protocol-dossier-${dossierId.slice(0, 12)}.pdf`;
}
