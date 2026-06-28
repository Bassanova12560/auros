import { NextResponse } from "next/server";

import { siteOrigin } from "@/lib/emails/constants";
import { greenApiUpsellPayload } from "@/lib/green/green-api-nurture";

import type { GreenApiAuth } from "./auth";

const GREEN_API_VERSION = "1.1";

export function greenApiHeaders(
  auth?: GreenApiAuth,
  extra?: Record<string, string>
): Record<string, string> {
  const headers: Record<string, string> = {
    "X-AUROS-Green-API-Version": GREEN_API_VERSION,
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    ...extra,
  };
  if (auth) {
    headers["X-AUROS-Green-Tier"] = auth.tier;
    headers["X-RateLimit-Limit"] = String(auth.rateLimit.limit);
    headers["X-RateLimit-Remaining"] = String(auth.rateLimit.remaining);
    headers["X-RateLimit-Reset"] = String(auth.rateLimit.reset);
    const upsell = greenApiUpsellPayload(auth);
    if (upsell) {
      const url = `${siteOrigin()}${upsell.upgrade_url as string}`;
      headers["X-AUROS-Upsell"] = url;
      headers["Link"] = `<${url}>; rel="payment"; title="Green API Premium"`;
    }
  }
  return headers;
}

export function greenApiJson<T extends Record<string, unknown>>(
  body: T,
  init?: { status?: number; auth?: GreenApiAuth; headers?: Record<string, string> }
): NextResponse {
  const upsell = init?.auth ? greenApiUpsellPayload(init.auth) : null;
  return NextResponse.json(
    {
      disclaimer:
        "Indicative AUROS Green signals — not Verra/ICVCM certification or investment advice.",
      ...body,
      ...(upsell ? { upsell } : {}),
    },
    {
      status: init?.status ?? 200,
      headers: greenApiHeaders(init?.auth, init?.headers),
    }
  );
}

export function greenApiError(
  code: string,
  message: string,
  status: number,
  auth?: GreenApiAuth
): NextResponse {
  return greenApiJson({ ok: false, error: { code, message } }, { status, auth });
}

export function greenApiOptions(): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: greenApiHeaders(),
  });
}
