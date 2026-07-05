import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  commentTokeniserPath,
  getAllCommentTokeniserLandings,
  getCommentTokeniserCopy,
  getCommentTokeniserLanding,
} from "@/lib/comment-tokeniser/landings";
import { prefillFromCommentTokeniser } from "@/lib/comment-tokeniser/prefill";
import { buildCommentTokeniserLandingPages } from "@/lib/ai-first/catalog/comment-tokeniser-pages";

describe("comment-tokeniser/landings", () => {
  it("lists three asset guides", () => {
    const landings = getAllCommentTokeniserLandings();
    assert.equal(landings.length, 3);
    assert.ok(landings.some((l) => l.slug === "immobilier"));
  });

  it("resolves slug immobilier", () => {
    const landing = getCommentTokeniserLanding("immobilier");
    assert.ok(landing);
    assert.equal(landing!.wizardAssetType, "Real estate");
  });

  it("returns null for unknown slug", () => {
    assert.equal(getCommentTokeniserLanding("crypto"), null);
  });

  it("builds localized copy FR/EN/ES", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const copy = getCommentTokeniserCopy("art", locale);
      assert.equal(copy.priorities.length, 3);
      assert.equal(copy.parts.length, 4);
    }
  });

  it("builds paths", () => {
    assert.equal(commentTokeniserPath("fonds"), "/comment-tokeniser/fonds");
  });
});

describe("comment-tokeniser/prefill", () => {
  it("prefills wizard for immobilier", () => {
    const prefill = prefillFromCommentTokeniser("immobilier", "fr");
    assert.equal(prefill.assetType, "Real estate");
    assert.equal(prefill.fromTool, "comment-tokeniser");
    assert.ok(prefill.description && prefill.description.length > 10);
  });
});

describe("comment-tokeniser/catalog", () => {
  it("exports indexable landing pages", () => {
    const pages = buildCommentTokeniserLandingPages();
    assert.equal(pages.length, 3);
    assert.ok(pages.every((p) => p.indexable));
  });
});
