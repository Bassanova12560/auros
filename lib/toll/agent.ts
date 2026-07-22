/**
 * AUROS Agent Protocol dispatcher — tools for AI agents.
 */

import { resolveAurosAsset } from "./resolve";
import { searchAurosAssets } from "./search";
import { researchAurosAsset } from "./research";
import { getValidationTrail } from "./trail";
import { evaluateTollPolicy } from "./policy";
import { getAssetDrift } from "./drift";
import { listProofStreamEventsAsync } from "@/lib/proof-stream";
import { resolveAssetDna } from "@/lib/asset-dna";
import { getAurosMetadataSchema } from "./metadata-schema";

export const TOLL_AGENT_TOOLS = [
  "list_tools",
  "resolve_asset",
  "search_assets",
  "research_asset",
  "get_validation_trail",
  "get_policy_decision",
  "get_drift",
  "get_schema",
] as const;

export type TollAgentTool = (typeof TOLL_AGENT_TOOLS)[number];

export async function dispatchTollAgentTool(input: {
  tool: string;
  input?: Record<string, unknown>;
}): Promise<{ ok: true; tool: string; result: unknown } | { ok: false; error: string }> {
  const tool = input.tool?.trim() as TollAgentTool;
  const body = input.input ?? {};

  if (!TOLL_AGENT_TOOLS.includes(tool)) {
    return {
      ok: false,
      error: `Unknown tool. Allowed: ${TOLL_AGENT_TOOLS.join(", ")}`,
    };
  }

  switch (tool) {
    case "list_tools":
      return {
        ok: true,
        tool,
        result: {
          tools: TOLL_AGENT_TOOLS,
          spec: "docs/AUROS-AGENT-PROTOCOL-V0.md",
        },
      };
    case "resolve_asset":
      return {
        ok: true,
        tool,
        result: await resolveAurosAsset({ q: String(body.q ?? body.id ?? "") }),
      };
    case "search_assets":
      return {
        ok: true,
        tool,
        result: await searchAurosAssets({
          q: String(body.q ?? ""),
          limit: typeof body.limit === "number" ? body.limit : 20,
        }),
      };
    case "research_asset":
      return {
        ok: true,
        tool,
        result: await researchAurosAsset({ q: String(body.q ?? body.id ?? "") }),
      };
    case "get_validation_trail":
      return {
        ok: true,
        tool,
        result: await getValidationTrail({
          assetDnaId: String(body.assetDnaId ?? body.id ?? ""),
          limit: typeof body.limit === "number" ? body.limit : 50,
        }),
      };
    case "get_policy_decision": {
      const id = String(body.assetDnaId ?? body.id ?? "");
      const dna = id ? await resolveAssetDna(id) : null;
      const events = dna
        ? await listProofStreamEventsAsync(dna.id, 50)
        : undefined;
      return {
        ok: true,
        tool,
        result: evaluateTollPolicy({ dna, events }),
      };
    }
    case "get_drift":
      return {
        ok: true,
        tool,
        result: await getAssetDrift({
          assetDnaId: String(body.assetDnaId ?? body.id ?? ""),
        }),
      };
    case "get_schema":
      return { ok: true, tool, result: getAurosMetadataSchema() };
    default:
      return { ok: false, error: "Unhandled tool" };
  }
}
