import { submitQuizSession } from "@/lib/academy/integrity-flow";

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

  const o = body as Record<string, unknown>;
  if (typeof o.sessionToken !== "string") {
    return Response.json({ error: "missing_sessionToken" }, { status: 400 });
  }

  const answers: Record<string, string> = {};
  if (o.answers && typeof o.answers === "object") {
    for (const [k, v] of Object.entries(o.answers as Record<string, unknown>)) {
      if (typeof v === "string") answers[k] = v;
    }
  }

  const timings: Record<string, number> = {};
  if (o.timings && typeof o.timings === "object") {
    for (const [k, v] of Object.entries(o.timings as Record<string, unknown>)) {
      if (typeof v === "number" && Number.isFinite(v)) timings[k] = v;
    }
  }

  const result = submitQuizSession({
    sessionToken: o.sessionToken,
    answers,
    timings,
  });

  if (!result.ok) {
    return Response.json(result, { status: 422 });
  }

  return Response.json(result);
}
