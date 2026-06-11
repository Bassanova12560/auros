import { NextResponse } from "next/server";

import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import {
  createReportDownloadToken,
  CURRENT_EDITION,
  notifyReportDownloadSignup,
} from "@/lib/state-of-rwa-issuers";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const { allowed } = checkRateLimit(`report-download:${ip}`, 5, 3_600_000);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";
  const name = typeof o.name === "string" ? o.name.trim() : "";
  const edition =
    typeof o.edition === "string" && o.edition.trim()
      ? o.edition.trim()
      : CURRENT_EDITION;
  const locale = typeof o.locale === "string" ? o.locale.trim() : "fr";

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }
  if (!name || name.length < 2 || name.length > 120) {
    return NextResponse.json({ ok: false, error: "invalid_name" }, { status: 400 });
  }

  const result = await notifyReportDownloadSignup({ name, email, edition, locale });
  if (!result.ok) {
    return NextResponse.json(result, { status: 502 });
  }

  const token = createReportDownloadToken({ email, name, edition });

  return NextResponse.json({ ok: true, token, edition });
}
