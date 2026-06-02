import { gradeChallenge } from "@/lib/academy/integrity-flow";

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
  if (typeof o.challengeToken !== "string") {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  const fields = parseFields(o.fields);
  const response = typeof o.response === "string" ? o.response : undefined;
  if (!fields && !response) {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  const elapsedMs =
    typeof o.elapsedMs === "number" && Number.isFinite(o.elapsedMs)
      ? o.elapsedMs
      : undefined;

  const result = await gradeChallenge({
    challengeToken: o.challengeToken,
    fields,
    response,
    elapsedMs: elapsedMs ?? 0,
  });

  if (!result.ok) {
    return Response.json(result, { status: 422 });
  }

  return Response.json(result);
}
