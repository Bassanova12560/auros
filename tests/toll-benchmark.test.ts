import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildTollBenchmark } from "@/lib/toll/benchmark";
import { dispatchTollAgentTool, TOLL_AGENT_TOOLS } from "@/lib/toll/agent";

describe("toll-benchmark", () => {
  it("returns green_index top pack", async () => {
    const pack = await buildTollBenchmark({ kind: "green_index", topN: 10 });
    assert.equal(pack.kind, "green_index");
    assert.ok(pack.editionIso);
    assert.ok((pack.top?.length ?? 0) >= 1);
    assert.ok((pack.segments?.length ?? 0) >= 1);
    assert.match(pack.disclaimer, /Indicative/i);
  });

  it("returns segment rows", async () => {
    const pack = await buildTollBenchmark({ kind: "segment" });
    assert.equal(pack.kind, "segment");
    assert.ok((pack.segments?.length ?? 0) >= 1);
  });

  it("peer_rank marks unknown assets unranked", async () => {
    const pack = await buildTollBenchmark({
      kind: "peer_rank",
      assetId: "definitely-not-in-index-xyz",
    });
    assert.equal(pack.kind, "peer_rank");
    assert.equal(pack.peer?.rank, null);
    assert.match(pack.summary, /unranked/i);
  });
});

describe("toll-agent cash tools", () => {
  it("exposes expanded cash-machine tools", async () => {
    assert.ok(TOLL_AGENT_TOOLS.includes("route_eligibility"));
    assert.ok(TOLL_AGENT_TOOLS.includes("get_benchmark"));
    assert.ok(TOLL_AGENT_TOOLS.includes("run_red_team"));
    const out = await dispatchTollAgentTool({ tool: "list_tools" });
    assert.equal(out.ok, true);
    if (!out.ok) return;
    const tools = (out.result as { tools: string[] }).tools;
    assert.ok(tools.includes("assess_wallet_risk"));
    assert.ok(tools.includes("get_reputation"));
  });
});
