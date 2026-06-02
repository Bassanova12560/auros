import { resolveAcademySessionSecret } from "@/lib/academy/security";
import { submitGreenPraticienExam } from "@/lib/green/praticien-exam";

export const runtime = "nodejs";

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

  const o = body as {
    sessionToken?: unknown;
    answers?: unknown;
    timings?: unknown;
  };

  if (
    typeof o.sessionToken !== "string" ||
    !o.answers ||
    typeof o.answers !== "object" ||
    !o.timings ||
    typeof o.timings !== "object"
  ) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  const result = await submitGreenPraticienExam({
    sessionToken: o.sessionToken,
    answers: o.answers as Record<string, string>,
    timings: o.timings as Record<string, number>,
  });

  return Response.json(result);
}
