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

  it("forces compare/list tools from page context product_ids", async () => {
    const { runCopilotTools } = await import("../lib/copilot/tools");
    const tools = await runCopilotTools("Que penses-tu de cette sélection ?", {
      surface: "compare",
      product_ids: ["maple-usdc", "realt-portfolio"],
    });
    const names = tools.map((t) => t.name);
    assert.ok(names.includes("search_knowledge"));
    assert.ok(
      names.includes("compare_products") || names.includes("list_products"),
      `expected compare or list, got ${names.join(",")}`
    );
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
      context: { surface: "chargeflow" },
    });
    assert.ok(result.reply.length > 20);
    assert.ok(result.disclaimer.toLowerCase().includes("indicative"));
    assert.ok(result.tools_used.includes("search_knowledge"));
    assert.ok(result.tools_used.includes("explain_chargeflow"));
  });

  it("sanitizes partnership claims and appends citations when missing", async () => {
    const {
      sanitizePartnershipClaims,
      ensureCitationsInReply,
    } = await import("../lib/copilot/chat");
    const dirty =
      "AUROS has an official Tesla partnership for Superchargers.";
    const clean = sanitizePartnershipClaims(dirty);
    assert.ok(!/official\s+tesla\s+partnership/i.test(clean));
    assert.ok(/format-compatible/i.test(clean));

    const withLinks = ensureCitationsInReply("Réponse sans URL.", [
      { title: "ChargeFlow", url: "https://getauros.com/green/chargeflow" },
    ]);
    assert.ok(withLinks.includes("https://getauros.com/green/chargeflow"));
  });

  it("buildCopilotHref encodes context query", async () => {
    const { buildCopilotHref, parseCopilotSearchParams } = await import(
      "../lib/copilot/types"
    );
    const href = buildCopilotHref({
      surface: "compare",
      product_ids: ["a", "b"],
    });
    assert.equal(href, "/copilot?context=compare&ids=a%2Cb");
    const parsed = parseCopilotSearchParams({
      context: "jurisdiction",
      jid: "luxembourg",
    });
    assert.equal(parsed.surface, "jurisdiction");
    assert.equal(parsed.jurisdiction_id, "luxembourg");
  });
});
