import {
  authenticateProtocolRequest,
  benchmarksQuerySchema,
  buildProtocolBenchmarks,
  protocolError,
  protocolJson,
  protocolRoute,
} from "@/lib/protocol";

export const GET = protocolRoute(async (req: Request) => {
  const auth = await authenticateProtocolRequest(req);
  if (!auth.ok) return auth.response;

  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());
  const parsed = benchmarksQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return protocolError(
      "validation_error",
      parsed.error.issues.map((i) => i.message).join("; "),
      400
    );
  }

  const result = await buildProtocolBenchmarks(parsed.data);
  const { source: _source, ...payload } = result;
  return protocolJson(payload);
});
