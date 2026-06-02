import { completeRenewal } from "@/lib/academy/integrity-flow";
import { notifyAcademyRenewalSuccess } from "@/lib/academy/reminder-notify";

function parseFields(raw: unknown): Record<string, string> | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof v === "string") out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
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

  const o = body as Record<string, unknown>;
  if (typeof o.certToken !== "string" || typeof o.challengeToken !== "string") {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  const fields = parseFields(o.fields);
  const response = typeof o.response === "string" ? o.response : undefined;
  if (!fields && !response) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  const answers: Record<string, string> = {};
  if (o.answers && typeof o.answers === "object") {
    for (const [k, v] of Object.entries(o.answers as Record<string, unknown>)) {
      if (typeof v === "string") answers[k] = v;
    }
  }

  const elapsedMs =
    typeof o.elapsedMs === "number" && Number.isFinite(o.elapsedMs)
      ? o.elapsedMs
      : 0;

  const result = await completeRenewal({
    certToken: o.certToken,
    challengeToken: o.challengeToken,
    answers,
    fields,
    response,
    elapsedMs,
  });

  if (!result.ok) {
    return Response.json(result, { status: 422 });
  }

  void notifyAcademyRenewalSuccess(result.certificate, result.token);

  return Response.json(result);
}
