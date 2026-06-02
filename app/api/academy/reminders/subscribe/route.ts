import { notifyAcademyRemindersSubscribed } from "@/lib/academy/reminder-notify";

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
  if (typeof o.email !== "string" || typeof o.certToken !== "string") {
    return Response.json({ error: "missing_fields" }, { status: 400 });
  }

  const result = await notifyAcademyRemindersSubscribed({
    email: o.email,
    certToken: o.certToken,
    locale: typeof o.locale === "string" ? o.locale : "fr",
  });

  if (!result.ok) {
    return Response.json(result, { status: 422 });
  }

  return Response.json({ ok: true });
}
