import { NextResponse } from "next/server";

import { checkRateLimit, getRequestIp } from "@/lib/rate-limit";
import {
  recordPartnerEmbedEvent,
  type PartnerEmbedEventType,
} from "@/lib/partners/embed-events";
import { isLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";

const EVENT_TYPES = new Set<PartnerEmbedEventType>(["h2o_score", "h2o_passport_cta"]);

export async function POST(request: Request) {
  const ip = getRequestIp(request);
  const { allowed } = checkRateLimit(`eau-embed-event:${ip}`, 30, 60_000);
  if (!allowed) {
    return NextResponse.json({ ok: false, error: "rate_limit" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const o = body as Record<string, unknown>;
  const partnerCode = typeof o.partner === "string" ? o.partner : "";
  const eventType = typeof o.event === "string" ? o.event : "";
  const rating = typeof o.rating === "number" ? o.rating : null;
  const tier = typeof o.tier === "string" ? o.tier : null;
  const previewId = typeof o.preview_id === "string" ? o.preview_id : null;
  const localeRaw = typeof o.locale === "string" ? o.locale.slice(0, 2) : null;
  const locale: Locale | null =
    localeRaw && isLocale(localeRaw as Locale) ? (localeRaw as Locale) : null;

  if (!partnerCode.trim() || !EVENT_TYPES.has(eventType as PartnerEmbedEventType)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const result = await recordPartnerEmbedEvent({
    partnerCode,
    eventType: eventType as PartnerEmbedEventType,
    rating,
    tier,
    previewId,
    locale,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.reason },
      { status: result.reason === "database" ? 503 : 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
