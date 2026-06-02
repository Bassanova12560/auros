import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getRagChunks, searchRag } from "../lib/ai-first/rag";
import { tokenize } from "../lib/ai-first/rag/tokenize";

describe("ai-first/rag", () => {
  it("builds a searchable corpus from catalog", () => {
    const chunks = getRagChunks();
    assert.ok(chunks.length >= 80);
    assert.ok(chunks.some((c) => c.chunkType === "jurisdiction"));
    assert.ok(chunks.some((c) => c.path === "/jurisdictions/starter-kit"));
  });

  it("tokenizes French queries", () => {
    const tokens = tokenize("Où structurer mon émission RWA à Luxembourg ?");
    assert.ok(tokens.includes("emission"));
    assert.ok(tokens.includes("rwa"));
    assert.ok(tokens.includes("luxembourg"));
  });

  it("ranks starter kit for pricing queries", () => {
    const result = searchRag({ query: "starter kit prix 5000 memo juridiction" });
    assert.ok(result.results.length >= 1);
    const topPaths = result.results.slice(0, 3).map((r) => r.path);
    assert.ok(
      topPaths.includes("/jurisdictions/starter-kit"),
      `expected starter-kit in top 3, got ${topPaths.join(", ")}`
    );
    assert.ok(result.context.includes("AUROS knowledge base"));
    assert.ok(result.sources.length >= 1);
  });

  it("ranks jurisdictions for DIFC vs Luxembourg", () => {
    const result = searchRag({
      query: "DIFC Luxembourg tokenisation immobilier frais",
      limit: 12,
    });
    assert.ok(result.results.length >= 2);
    const combined = result.results.map((r) => r.text.toLowerCase()).join(" ");
    assert.ok(
      combined.includes("luxembourg") || combined.includes("difc") || combined.includes("dubai"),
      `expected jurisdiction data in results`
    );
  });

  it("filters by content type", () => {
    const result = searchRag({
      query: "starter kit jurisdiction memo",
      contentTypes: ["product"],
      limit: 5,
    });
    assert.ok(result.results.length >= 1);
    for (const hit of result.results) {
      assert.equal(hit.path, "/jurisdictions/starter-kit");
    }
  });

  it("returns empty results for blank token query", () => {
    const result = searchRag({ query: "   le la   " });
    assert.equal(result.results.length, 0);
  });
});
