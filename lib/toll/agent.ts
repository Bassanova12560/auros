/**
 * AUROS Agent Protocol dispatcher — tools for AI agents.
 */

import { resolveAurosAsset } from "./resolve";
import { searchAurosAssets } from "./search";
import { researchAurosAsset } from "./research";
import { getValidationTrail } from "./trail";
import { evaluateTollPolicy } from "./policy";
import { getAssetDrift } from "./drift";
import { routeEligibility } from "./eligibility";
import { assessWalletBehavioralRisk } from "./wallet-risk";
import { computeRealityReputation } from "./reputation";
import { runAssetRedTeam } from "./red-team";
import { buildTollBenchmark } from "./benchmark";
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
  "route_eligibility",
  "assess_wallet_risk",
  "get_reputation",
  "run_red_team",
  "get_benchmark",
] as const;

export type TollAgentTool = (typeof TOLL_AGENT_TOOLS)[number];

export async function dispatchTollAgentTool(input: {
  tool: string;
  input?: Record<string, unknown>;
}): Promise<
  { ok: true; tool: string; result: unknown } | { ok: false; error: string }
> {
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
        result: await researchAurosAsset({
          q: String(body.q ?? body.id ?? ""),
        }),
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
    case "route_eligibility":
      return {
        ok: true,
        tool,
        result: await routeEligibility({
          assetQuery: String(body.q ?? body.assetQuery ?? ""),
          assetDnaId:
            typeof body.assetDnaId === "string" ? body.assetDnaId : undefined,
          operation: (["mint", "buy", "transfer", "redeem", "list"].includes(
            String(body.operation)
          )
            ? body.operation
            : "buy") as "mint" | "buy" | "transfer" | "redeem" | "list",
          investor:
            body.investor && typeof body.investor === "object"
              ? (body.investor as {
                  jurisdiction?: string;
                  residency?: string;
                  wallet?: string;
                  pep?: boolean;
                  accredited?: boolean;
                })
              : undefined,
        }),
      };
    case "assess_wallet_risk":
      return {
        ok: true,
        tool,
        result: assessWalletBehavioralRisk({
          wallet: String(body.wallet ?? ""),
          entityLabel:
            typeof body.entityLabel === "string" ? body.entityLabel : undefined,
          role:
            body.role === "issuer" ||
            body.role === "investor" ||
            body.role === "operator"
              ? body.role
              : "unknown",
        }),
      };
    case "get_reputation": {
      const id = String(body.assetDnaId ?? body.id ?? body.q ?? "").trim();
      const dna = id ? await resolveAssetDna(id) : null;
      const events = dna
        ? await listProofStreamEventsAsync(dna.id, 50)
        : undefined;
      return {
        ok: true,
        tool,
        result: computeRealityReputation({ dna, events }),
      };
    }
    case "run_red_team":
      return {
        ok: true,
        tool,
        result: await runAssetRedTeam({
          assetDnaId:
            typeof body.assetDnaId === "string" ? body.assetDnaId : undefined,
          assetQuery:
            typeof body.q === "string"
              ? body.q
              : typeof body.assetQuery === "string"
                ? body.assetQuery
                : typeof body.id === "string"
                  ? body.id
                  : undefined,
        }),
      };
    case "get_benchmark":
      return {
        ok: true,
        tool,
        result: await buildTollBenchmark({
          kind:
            body.kind === "segment" ||
            body.kind === "peer_rank" ||
            body.kind === "green_index"
              ? body.kind
              : "green_index",
          assetId:
            typeof body.assetId === "string"
              ? body.assetId
              : typeof body.id === "string"
                ? body.id
                : undefined,
          segment:
            typeof body.segment === "string" ? body.segment : undefined,
          topN: typeof body.topN === "number" ? body.topN : undefined,
        }),
      };
    default:
      return { ok: false, error: "Unhandled tool" };
  }
}
