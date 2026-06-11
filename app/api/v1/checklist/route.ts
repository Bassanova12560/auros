import {
  authenticateProtocolRequest,
  checklistRequestSchema,
  generateChecklist,
  protocolError,
  protocolJson,
} from "@/lib/protocol";

export async function POST(req: Request) {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return protocolError("invalid_json", "Request body must be valid JSON", 400);
  }

  const parsed = checklistRequestSchema.safeParse(body);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const checklist = generateChecklist(parsed.data);
  return protocolJson(checklist);
}
