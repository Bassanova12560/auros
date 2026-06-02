import { resolveAcademySessionSecret } from "@/lib/academy/security";
import { startQuizSession } from "@/lib/academy/integrity-flow";
import type { AcademyLocale } from "@/lib/academy/i18n";

export const runtime = "nodejs";

function parseLocale(value: unknown): AcademyLocale {
  return value === "en" || value === "es" || value === "fr" ? value : "fr";
}

export async function POST(request: Request) {
  if (!resolveAcademySessionSecret()) {
    return Response.json({ error: "academy_not_configured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "invalid_body" }, { status: 400 });
  }

  const o = body as { fullName?: unknown; locale?: unknown };
  const fullName = o.fullName;
  if (typeof fullName !== "string") {
    return Response.json({ error: "missing_fullName" }, { status: 400 });
  }

  try {
    const result = startQuizSession(fullName, parseLocale(o.locale));
    if (!result) {
      return Response.json({ error: "invalid_name" }, { status: 422 });
    }
    return Response.json(result);
  } catch {
    return Response.json({ error: "session_start_failed" }, { status: 503 });
  }
}
