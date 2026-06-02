import { resolveAcademySessionSecret } from "@/lib/academy/security";
import { startGreenPraticienExam } from "@/lib/green/praticien-exam";
import type { Locale } from "@/lib/i18n";

export const runtime = "nodejs";

function parseLocale(value: unknown): Locale {
  return value === "en" || value === "es" || value === "fr" ? value : "fr";
}

export async function POST(request: Request) {
  if (!resolveAcademySessionSecret()) {
    return Response.json({ error: "green_exam_not_configured" }, { status: 503 });
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

  const o = body as { displayName?: unknown; email?: unknown; locale?: unknown };
  if (typeof o.displayName !== "string" || typeof o.email !== "string") {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  try {
    const result = startGreenPraticienExam(
      o.displayName,
      o.email,
      parseLocale(o.locale)
    );
    if (!result) {
      return Response.json({ error: "invalid_input" }, { status: 422 });
    }
    return Response.json(result);
  } catch {
    return Response.json({ error: "session_start_failed" }, { status: 503 });
  }
}
