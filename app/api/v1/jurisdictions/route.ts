import {
  authenticateProtocolRequest,
  jurisdictionsQuerySchema,
  protocolError,
  protocolJson,
  rankProtocolJurisdictions,
} from "@/lib/protocol";

export async function GET(req: Request) {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = jurisdictionsQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const jurisdictions = rankProtocolJurisdictions(parsed.data);
  return protocolJson({ jurisdictions, query: parsed.data });
}
