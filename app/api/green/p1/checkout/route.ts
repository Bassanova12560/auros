import { NextResponse } from "next/server";

import type { Locale } from "@/lib/i18n";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  createGreenFastTrackCheckout,
  createGreenIndexPackCheckout,
  createGreenInvestorRoomCheckout,
  createGreenReadinessMrrCheckout,
} from "@/lib/stripe/green-p1-checkout";
import type { GreenP1Product } from "@/lib/green/p1-cash-pricing";
import {
  GREEN_FAST_TRACK_PRODUCT,
  GREEN_INDEX_PACK_PRODUCT,
  GREEN_INVESTOR_ROOM_PRODUCT,
  GREEN_READINESS_MRR_PRODUCT,
} from "@/lib/green/p1-cash-pricing";

export const runtime = "nodejs";

const PRODUCTS = new Set<GreenP1Product>([
  GREEN_FAST_TRACK_PRODUCT,
  GREEN_INVESTOR_ROOM_PRODUCT,
  GREEN_INDEX_PACK_PRODUCT,
  GREEN_READINESS_MRR_PRODUCT,
]);

/** POST /api/green/p1/checkout — Fast Track / Investor Room / Index Pack / Readiness MRR */
export async function POST(request: Request) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`green-p1-checkout:${ip}`, 10, 3_600_000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const product = String(body.product ?? "") as GreenP1Product;
  if (!PRODUCTS.has(product)) {
    return NextResponse.json({ error: "invalid_product" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const localeRaw = typeof body.locale === "string" ? body.locale.trim() : "fr";
  const locale: Locale =
    localeRaw === "en" || localeRaw === "es" || localeRaw === "ar" || localeRaw === "zh"
      ? localeRaw
      : "fr";

  const input = {
    email,
    locale,
    company: typeof body.company === "string" ? body.company.trim() : "",
    notes: typeof body.notes === "string" ? body.notes.trim() : "",
  };

  const creator =
    product === GREEN_FAST_TRACK_PRODUCT
      ? createGreenFastTrackCheckout
      : product === GREEN_INVESTOR_ROOM_PRODUCT
        ? createGreenInvestorRoomCheckout
        : product === GREEN_INDEX_PACK_PRODUCT
          ? createGreenIndexPackCheckout
          : createGreenReadinessMrrCheckout;

  const result = await creator(input);
  if (!result) {
    return NextResponse.json({ error: "stripe_unconfigured" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, url: result.url, sessionId: result.sessionId });
}
