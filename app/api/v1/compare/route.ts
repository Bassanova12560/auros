import {
  authenticateProtocolRequest,
  buildProtocolCompare,
  compareRequestSchema,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";

export const POST = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = compareRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const result = await buildProtocolCompare(parsed.data);
  if (!result.ok) {
    return protocolError(result.code, result.message, result.status);
  }

  return protocolJson({
    ...result.data,
    meta: {
      version: "1.0" as const,
      computed_at: new Date().toISOString(),
    },
  });
});
