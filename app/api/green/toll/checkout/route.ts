import { NextResponse } from "next/server";

import type { Locale } from "@/lib/i18n";
import { normalizePartnerCode } from "@/lib/partner-attribution";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  TOLL_LOOKUP_PACK_PRODUCT,
  isTollCashProduct,
  type TollCashProduct,
} from "@/lib/toll/lifecycle-pricing";
import {
  createTollLifecycleCheckout,
  createTollLookupPackCheckout,
} from "@/lib/stripe/toll-checkout";

export const runtime = "nodejs";

/** POST /api/green/toll/checkout — Lookup Pack / Lifecycle Maintain */
export async function POST(request: Request) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`toll-checkout:${ip}`, 10, 3_600_000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const product = String(body.product ?? "") as TollCashProduct;
  if (!isTollCashProduct(product)) {
    return NextResponse.json({ error: "invalid_product" }, { status: 400 });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const localeRaw = typeof body.locale === "string" ? body.locale.trim() : "fr";
  const locale: Locale =
    localeRaw === "en" ||
    localeRaw === "es" ||
    localeRaw === "ar" ||
    localeRaw === "zh"
      ? localeRaw
      : "fr";

  const partnerCode = normalizePartnerCode(
    typeof body.partnerCode === "string" ? body.partnerCode : null
  );
  const creditSubject =
    typeof body.creditSubject === "string" && body.creditSubject.trim()
      ? body.creditSubject.trim()
      : `email:${email}`;

  const input = {
    email,
    locale,
    company: typeof body.company === "string" ? body.company.trim() : "",
    partnerCode,
    creditSubject,
  };

  const creator =
    product === TOLL_LOOKUP_PACK_PRODUCT
      ? createTollLookupPackCheckout
      : createTollLifecycleCheckout;

  const result = await creator(input);
  if (!result) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    url: result.url,
    sessionId: result.sessionId,
  });
}
