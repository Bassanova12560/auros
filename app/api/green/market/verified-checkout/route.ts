import { NextResponse } from "next/server";

import type { Locale } from "@/lib/i18n";
import { createGreenMarketVerifiedCheckoutSession } from "@/lib/stripe/green-market-cash-checkout";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/** Stripe Checkout — Green Market Verified listing (299 €). */
export async function POST(request: Request) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`green-market-verified:${ip}`, 8, 3_600_000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const email = typeof o.email === "string" ? o.email.trim().toLowerCase() : "";
  const company = typeof o.company === "string" ? o.company.trim() : "";

  if (!email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const localeRaw = typeof o.locale === "string" ? o.locale.trim() : "fr";
  const locale: Locale =
    localeRaw === "en" ||
    localeRaw === "es" ||
    localeRaw === "ar" ||
    localeRaw === "zh"
      ? localeRaw
      : "fr";

  const result = await createGreenMarketVerifiedCheckoutSession({
    email,
    locale,
    company,
  });
  if (!result) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, url: result.url, sessionId: result.sessionId });
}
