import { dispatchTollAgentTool } from "@/lib/toll";
import {
  parseJsonBody,
  protocolError,
  protocolJson,
  tollRequireBearer,
} from "@/lib/toll/http";

export const runtime = "nodejs";

/** POST /api/v1/toll/agent { tool, input } — Bearer required */
export async function POST(request: Request) {
  const auth = await tollRequireBearer(request);
  if (!auth.ok) return auth.response;
  const parsed = await parseJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const tool = String(parsed.body.tool ?? "").trim();
  if (!tool) {
    return protocolError("invalid_tool", "Missing tool", 400);
  }
  const input =
    parsed.body.input && typeof parsed.body.input === "object"
      ? (parsed.body.input as Record<string, unknown>)
      : parsed.body;
  const result = await dispatchTollAgentTool({ tool, input });
  if (!result.ok) {
    return protocolError("unknown_tool", result.error, 400);
  }
  return protocolJson({ ok: true, tool: result.tool, result: result.result });
}
