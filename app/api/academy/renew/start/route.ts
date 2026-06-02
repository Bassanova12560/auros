import { startRenewalSession } from "@/lib/academy/integrity-flow";
import type { AcademyLocale } from "@/lib/academy/i18n";

export const runtime = "nodejs";

function parseLocale(value: unknown): AcademyLocale {
  return value === "en" || value === "es" || value === "fr" ? value : "fr";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const o = body as { certToken?: unknown; locale?: unknown };
  const certToken = o.certToken;
  if (typeof certToken !== "string") {
    return Response.json({ error: "missing_certToken" }, { status: 400 });
  }

  const result = startRenewalSession(certToken, parseLocale(o.locale));
  if (!result.ok) {
    return Response.json(result, { status: 422 });
  }

  return Response.json(result);
}
