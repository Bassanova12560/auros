import { NextResponse } from "next/server";

import { submitInstitutionalRequest } from "@/lib/green/institutional-requests";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * POST /api/v1/green/institutional/request
 * Body: branding | idp HITL request — ops email, no auto-activate.
 */
export async function POST(request: Request) {
  const ip = await getClientIp();
  const { allowed } = checkRateLimit(`institutional-req:${ip}`, 8, 60 * 60_000);
  if (!allowed) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const kind = body.kind === "idp" ? "idp" : body.kind === "branding" ? "branding" : null;
  if (!kind) {
    return NextResponse.json({ error: "invalid_kind" }, { status: 400 });
  }

  const result = await submitInstitutionalRequest({
    kind,
    email: String(body.email ?? ""),
    companyName: String(body.companyName ?? body.company ?? ""),
    partnerId: body.partnerId ? String(body.partnerId) : undefined,
    primaryColor: body.primaryColor ? String(body.primaryColor) : undefined,
    accentColor: body.accentColor ? String(body.accentColor) : undefined,
    logoUrl: body.logoUrl ? String(body.logoUrl) : undefined,
    hideAurosBranding: Boolean(body.hideAurosBranding),
    productLabel: body.productLabel ? String(body.productLabel) : undefined,
    idpProtocol: body.idpProtocol === "oidc" ? "oidc" : "saml",
    metadataUrl: body.metadataUrl ? String(body.metadataUrl) : undefined,
    metadataXmlSnippet: body.metadataXmlSnippet
      ? String(body.metadataXmlSnippet)
      : undefined,
    notes: body.notes ? String(body.notes) : undefined,
  });

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    status: "pending_hitl",
    previewUrl: result.previewUrl,
  });
}
