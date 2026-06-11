import { createHmac, timingSafeEqual } from "node:crypto";

import { CURRENT_EDITION } from "./types";

const DEV_SECRET = "auros-report-download-dev-secret";

function isProduction(): boolean {
  return (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production"
  );
}

function reportSecret(): string {
  const s =
    process.env.REPORT_DOWNLOAD_SECRET?.trim() ||
    process.env.ACADEMY_CERT_SECRET?.trim();
  if (s && (!isProduction() || s !== DEV_SECRET)) return s;
  if (isProduction()) return DEV_SECRET;
  return DEV_SECRET;
}

function sign(payload: string): string {
  return createHmac("sha256", reportSecret()).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function createReportDownloadToken(input: {
  email: string;
  name: string;
  edition?: string;
}): string {
  const edition = input.edition ?? CURRENT_EDITION;
  const payload = JSON.stringify({
    email: input.email.trim().toLowerCase(),
    name: input.name.trim(),
    edition,
    exp: Date.now() + TOKEN_TTL_MS,
  });
  const sig = sign(payload);
  return Buffer.from(JSON.stringify({ p: payload, s: sig })).toString("base64url");
}

export function verifyReportDownloadToken(
  token: string,
  edition = CURRENT_EDITION
): { email: string; name: string } | null {
  try {
    const raw = JSON.parse(
      Buffer.from(token, "base64url").toString("utf8")
    ) as { p?: string; s?: string };
    if (!raw.p || !raw.s) return null;
    const expected = sign(raw.p);
    if (!safeEqual(expected, raw.s)) return null;

    const data = JSON.parse(raw.p) as {
      email?: string;
      name?: string;
      edition?: string;
      exp?: number;
    };
    if (!data.email || !data.name || data.edition !== edition) return null;
    if (typeof data.exp !== "number" || Date.now() > data.exp) return null;

    return { email: data.email, name: data.name };
  } catch {
    return null;
  }
}
