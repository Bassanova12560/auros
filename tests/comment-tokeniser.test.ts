import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  commentTokeniserPath,
  getAllCommentTokeniserLandings,
  getCommentTokeniserCopy,
  getCommentTokeniserLanding,
} from "@/lib/comment-tokeniser/landings";
import {
  prefillFromCommentTokeniser,
  wizardEntryPathForCommentTokeniser,
} from "@/lib/comment-tokeniser/prefill";
import { buildCommentTokeniserLandingPages } from "@/lib/ai-first/catalog/comment-tokeniser-pages";

describe("comment-tokeniser/landings", () => {
  it("lists seven asset guides including eau", () => {
    const landings = getAllCommentTokeniserLandings();
    assert.equal(landings.length, 7);
    assert.ok(landings.some((l) => l.slug === "immobilier"));
    assert.ok(landings.some((l) => l.slug === "energie"));
    assert.ok(landings.some((l) => l.slug === "eau"));
  });

  it("resolves slug immobilier", () => {
    const landing = getCommentTokeniserLanding("immobilier");
    assert.ok(landing);
    assert.equal(landing!.wizardAssetType, "Real estate");
  });

  it("marks infra landings as green wizard entry", () => {
    assert.equal(getCommentTokeniserLanding("eau")!.greenWizard, true);
    assert.equal(getCommentTokeniserLanding("energie")!.greenWizard, true);
    assert.equal(getCommentTokeniserLanding("immobilier")!.greenWizard, undefined);
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

  it("includes revenue links on eau landing only", () => {
    const eau = getCommentTokeniserCopy("eau", "fr");
    assert.equal(eau.revenueLinks?.length, 3);
    assert.ok(eau.revenueLinks?.some((l) => l.href === "/eau"));

    const immo = getCommentTokeniserCopy("immobilier", "fr");
    assert.equal(immo.revenueLinks, undefined);
  });

  it("builds paths", () => {
    assert.equal(commentTokeniserPath("fonds"), "/comment-tokeniser/fonds");
    assert.equal(commentTokeniserPath("eau"), "/comment-tokeniser/eau");
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

  it("prefills water dossier with renewable asset type", () => {
    const prefill = prefillFromCommentTokeniser("eau", "fr");
    assert.equal(prefill.assetType, "Renewable energy");
    assert.match(prefill.description ?? "", /m³|eau|hydrique/i);
  });

  it("routes infra landings to green wizard entry", () => {
    assert.equal(
      wizardEntryPathForCommentTokeniser("eau"),
      "/wizard?type=green&asset=renewable"
    );
    assert.equal(wizardEntryPathForCommentTokeniser("immobilier"), "/wizard");
  });
});

describe("leads/wizard-url", () => {
  it("routes water and energy leads to green wizard", async () => {
    const { wizardUrlForLead } = await import("@/lib/leads/wizard-url");
    const water = wizardUrlForLead({ assetType: "Renewable energy" });
    assert.match(water, /type=green/);
    assert.match(water, /asset=renewable/);

    const realEstate = wizardUrlForLead({ assetType: "Real estate" });
    assert.match(realEstate, /mode=explore/);
  });
});

describe("comment-tokeniser/catalog", () => {
  it("exports indexable landing pages", () => {
    const pages = buildCommentTokeniserLandingPages();
    assert.equal(pages.length, 7);
    assert.ok(pages.every((p) => p.indexable));
    assert.ok(pages.some((p) => p.path === "/comment-tokeniser/eau"));
  });
});
