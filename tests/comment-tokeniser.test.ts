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
  it("lists six asset guides", () => {
    const landings = getAllCommentTokeniserLandings();
    assert.equal(landings.length, 6);
    assert.ok(landings.some((l) => l.slug === "immobilier"));
    assert.ok(landings.some((l) => l.slug === "energie"));
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

  it("prefills wizard for credit-prive", () => {
    const prefill = prefillFromCommentTokeniser("credit-prive", "en");
    assert.equal(prefill.assetType, "Private equity / SME shares");
  });
});

describe("comment-tokeniser/catalog", () => {
  it("exports indexable landing pages", () => {
    const pages = buildCommentTokeniserLandingPages();
    assert.equal(pages.length, 6);
    assert.ok(pages.every((p) => p.indexable));
  });
});
