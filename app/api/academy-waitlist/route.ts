import { NextResponse } from "next/server";

import { notifyAcademyWaitlistSignup } from "@/lib/academy/waitlist-notify";
import { saveAcademyWaitlistSignup } from "@/lib/academy/waitlist-store";
import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const ip = getRequestIp(req);
  const { allowed } = checkRateLimit(`academy-waitlist:${ip}`, 5, 3_600_000);
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
  const track = typeof o.track === "string" ? o.track.trim() : "praticien";
  const locale = typeof o.locale === "string" ? o.locale.trim() : "fr";

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  const saved = await saveAcademyWaitlistSignup({ email, track, locale });
  if (!saved.ok) {
    return NextResponse.json(
      { ok: false, error: saved.error },
      { status: saved.error === "database" ? 503 : 400 },
    );
  }

  const result = await notifyAcademyWaitlistSignup({ email, track, locale });
  if (!result.ok) {
    return NextResponse.json(result, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
