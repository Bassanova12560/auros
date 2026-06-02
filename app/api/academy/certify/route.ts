import { isLegacyCertifyAllowed } from "@/lib/academy/security";

export async function POST(request: Request) {
  if (!isLegacyCertifyAllowed()) {
    return Response.json(
      {
        error: "deprecated",
        message:
          "Use /api/academy/session/* + /api/academy/challenge/grade — legacy bypass disabled in production.",
      },
      { status: 410 }
    );
  }

  const { certifyFundamentals } = await import("@/lib/academy");

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
  if (typeof o.fullName !== "string" || !o.answers || typeof o.answers !== "object") {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  const answers: Record<string, string> = {};
  for (const [k, v] of Object.entries(o.answers as Record<string, unknown>)) {
    if (typeof v === "string") answers[k] = v;
  }

  const result = certifyFundamentals({ fullName: o.fullName, answers });

  if (!result.ok) {
    return Response.json(result, { status: 422 });
  }

  return Response.json(result);
}
