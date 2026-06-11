import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getAllAiFirstPages } from "../lib/ai-first/catalog";
import { GREEN_COMPARE_ROWS } from "../lib/green/compare-data";
import {
  GREEN_PRATICIEN_EXAM_ROUTE,
  GREEN_PRATICIEN_PASS_SCORE,
  GREEN_PRATICIEN_QUIZ_LENGTH,
  GREEN_RTMS_PILLARS,
  GREEN_ROUTE,
  GREEN_PRATICIEN_ROUTE,
  GREEN_WIZARD_ASSET_TYPE,
} from "../lib/green/constants";
import { getGreenRegistrySnapshot, greenVerifyPath } from "../lib/green/green-registry";
import { getGreenMessages } from "../lib/green/i18n";
import {
  pickGreenPraticienQuestions,
  scoreGreenPraticienQuiz,
} from "../lib/green/quiz-praticien";
import { WIZARD_ASSET_OPTIONS } from "../app/wizard/_components/Step1Asset";

const GREEN_HUB_SECONDARY_HREFS = [
  "/green/comment-ca-marche",
  "/green/faq",
  "/green/blog",
  "/green/standards",
  "/green/compare",
  "/green/label",
  "/green/registry",
] as const;

describe("green/i18n", () => {
  for (const locale of ["fr", "en", "es"] as const) {
    it(`returns complete messages for ${locale}`, () => {
      const m = getGreenMessages(locale);
      assert.ok(m.hub.tagline.length > 0);
      assert.ok(m.hub.manifesto.length > 40);
      assert.ok(m.hub.manifestoSign.includes("AUROS"));
      assert.equal(m.hub.actors.length, 4);
      assert.equal(m.hub.secondary.links.length, GREEN_HUB_SECONDARY_HREFS.length);
      assert.deepEqual(
        m.hub.secondary.links.map((link) => link.href),
        [...GREEN_HUB_SECONDARY_HREFS]
      );
      assert.ok(m.hub.metrics.title.length > 0);
      assert.ok(m.hub.metrics.noteDemo.length > 0);
      assert.ok(m.hub.registerCta.length > 0);
      assert.ok(m.register.title.length > 0);
      assert.ok(m.hub.wizardCta.length > 0);
      assert.ok(m.hub.aboutCta.length > 0);
      assert.equal(m.about.blocks.length, 4);
      assert.equal(m.about.profiles.length, 3);
      assert.equal(m.about.values.items.length, 3);
      assert.equal(Object.keys(m.standards.pillars).length, 4);
      assert.ok(m.compare.labelStatus.certified.length > 0);
      assert.ok(m.label.form.projectTypes.solar.length > 0);
      assert.ok(m.hub.widgets.registry.label.length > 0);
      assert.ok(m.hub.widgets.rtms.label.length > 0);
      assert.ok(m.about.promise.title.length > 0);
      assert.equal(m.standards.methodologySteps.length, 4);
      assert.ok(m.exam.title.length > 0);
      assert.ok(m.praticien.examCta.length > 0);
    });
  }
});

describe("green/compare-data", () => {
  it("has sourced compare rows with honest statuses", () => {
    assert.ok(GREEN_COMPARE_ROWS.length >= 5);
    for (const row of GREEN_COMPARE_ROWS) {
      assert.ok(row.sourceUrl.startsWith("https://"));
      assert.notEqual(row.labelStatus, "certified");
      assert.ok(row.lastReviewed.match(/^\d{4}-\d{2}-\d{2}$/));
    }
  });

  it("RTMS has four pillars", () => {
    assert.deepEqual([...GREEN_RTMS_PILLARS], ["real", "transparent", "measurable", "sound"]);
  });
});

describe("green/ai-first catalog", () => {
  it("registers all green routes as indexable", () => {
    const pages = getAllAiFirstPages();
    const greenPaths = [
      "/green",
      "/green/about",
      "/green/market",
      "/green/producers",
      "/green/storers",
      "/green/chargers",
      "/green/consumers",
      "/green/standards",
      "/green/compare",
      "/green/label",
      "/green/certification",
      "/green/praticien",
      "/green/registry",
      "/green/tokenize-surplus",
    ];
    for (const path of greenPaths) {
      const page = pages.find((p) => p.path === path);
      assert.ok(page, `missing catalog page ${path}`);
      assert.equal(page!.indexable, true);
      assert.equal(page!.language, "multi");
    }
  });

  it("hub path matches GREEN_ROUTE constant", () => {
    assert.equal(GREEN_ROUTE, "/green");
    assert.equal(GREEN_PRATICIEN_ROUTE, "/green/praticien");
  });
});

describe("green/registry", () => {
  it("returns pilot and verified projects with verify paths", async () => {
    const snapshot = await getGreenRegistrySnapshot();
    assert.ok(snapshot.projects.length >= 3);
    const verified = snapshot.projects.filter((p) => p.labelTier === "verified");
    assert.ok(verified.length >= 1);
    const verifiedToken = snapshot.projects.find(
      (p) => p.id === "verified-solar-aggregation-pt"
    );
    assert.ok(verifiedToken);
    assert.equal(verifiedToken!.verifyToken, "ag-verified-solar-pt-2026");
    for (const p of snapshot.projects) {
      assert.ok(p.verifyToken.length > 0);
      assert.ok(p.summaries.fr.length > 0);
      assert.ok(greenVerifyPath(p.verifyToken).startsWith("/green/verify/"));
      assert.ok(["verified", "pilot"].includes(p.labelTier));
    }
  });

  it("praticien messages include exam and waitlist form", () => {
    const m = getGreenMessages("fr");
    assert.ok(m.praticien.form.submit.length > 0);
    assert.ok(m.praticien.examCta.length > 0);
    assert.equal(m.praticien.prerequisites.length, 3);
  });
});

describe("green/praticien-quiz", () => {
  it("draws eight questions and scores pass threshold", () => {
    const questions = pickGreenPraticienQuestions("fr");
    assert.equal(questions.length, GREEN_PRATICIEN_QUIZ_LENGTH);
    const answers = Object.fromEntries(
      questions.map((q) => [q.id, q.correctOptionId])
    );
    const score = scoreGreenPraticienQuiz(questions, answers);
    assert.equal(score, GREEN_PRATICIEN_QUIZ_LENGTH);
    assert.ok(score >= GREEN_PRATICIEN_PASS_SCORE);
  });

  it("localizes exam questions for es locale", () => {
    for (let i = 0; i < 20; i++) {
      const questions = pickGreenPraticienQuestions("es");
      const gp10 = questions.find((q) => q.id === "gp10");
      if (gp10) {
        assert.ok(gp10.prompt.includes("badge experto"));
        assert.ok(gp10.options[0]!.label.includes("Comprensión RTMS"));
        return;
      }
    }
    assert.fail("expected gp10 in es question draw");
  });
});

describe("green/wizard-renewable", () => {
  it("includes renewable asset type for green wizard prefill", () => {
    assert.ok(WIZARD_ASSET_OPTIONS.includes(GREEN_WIZARD_ASSET_TYPE));
    assert.equal(GREEN_WIZARD_ASSET_TYPE, "Renewable energy");
  });

  it("registers praticien exam page as non-indexable", () => {
    const pages = getAllAiFirstPages();
    const exam = pages.find((p) => p.path === GREEN_PRATICIEN_EXAM_ROUTE);
    assert.ok(exam);
    assert.equal(exam!.indexable, false);
  });
});
