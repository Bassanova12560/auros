import assert from "node:assert/strict";
import { describe, it } from "node:test";

describe("copilot", () => {
  it("runs read-only tools for ChargeFlow and products queries", async () => {
    const { runCopilotTools } = await import("../lib/copilot/tools");
    const tools = await runCopilotTools("Explique ChargeFlow CFU-E et les flottes");
    const names = tools.map((t) => t.name);
    assert.ok(names.includes("search_knowledge"));
    assert.ok(names.includes("explain_chargeflow"));
    const cf = tools.find((t) => t.name === "explain_chargeflow");
    assert.ok(cf?.citations.some((c) => c.url.includes("chargeflow")));
  });

  it("creates and reviews catalog/content drafts in memory", async () => {
    const { runContentDraftAgent } = await import("../lib/copilot/agents");
    const { listCopilotDrafts, reviewCopilotDraft } = await import(
      "../lib/copilot/drafts-store"
    );

    const draft = await runContentDraftAgent({
      topic: "Qu'est-ce qu'une CFU-E ?",
      kind_hint: "faq",
    });
    assert.equal(draft.kind, "content");
    assert.equal(draft.status, "pending");

    const pending = await listCopilotDrafts({ status: "pending" });
    assert.ok(pending.some((d) => d.id === draft.id));

    const approved = await reviewCopilotDraft({
      id: draft.id,
      status: "approved",
      review_note: "ok for manual merge",
    });
    assert.ok(approved);
    assert.equal(approved?.status, "approved");
    assert.equal(approved?.apply_result, "queued_for_manual_merge");
  });

  it("chat returns disclaimer and citations (template ok without keys)", async () => {
    const { runCopilotChat } = await import("../lib/copilot/chat");
    const result = await runCopilotChat({
      message: "Explique brièvement ce qu’est AUROS ChargeFlow CFU-E",
      locale: "fr",
    });
    assert.ok(result.reply.length > 20);
    assert.ok(result.disclaimer.toLowerCase().includes("indicative"));
    assert.ok(result.tools_used.includes("search_knowledge"));
    assert.ok(result.tools_used.includes("explain_chargeflow"));
  });
});
