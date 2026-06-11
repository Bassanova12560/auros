import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GLOSSARY_CATEGORY_ORDER,
  GLOSSARY_TERMS,
  getAllGlossarySlugs,
  getGlossaryTerm,
  getGlossaryTermsByCategory,
  getRelatedGlossaryTerms,
} from "../lib/glossary";

const MIN_TERMS = 80;

describe("glossary", () => {
  it(`has at least ${MIN_TERMS} terms`, () => {
    assert.ok(GLOSSARY_TERMS.length >= MIN_TERMS);
    assert.equal(getAllGlossarySlugs().length, GLOSSARY_TERMS.length);
  });

  it("resolves every slug uniquely", () => {
    const slugs = getAllGlossarySlugs();
    assert.equal(new Set(slugs).size, slugs.length);
    for (const slug of slugs) {
      const term = getGlossaryTerm(slug);
      assert.ok(term, `missing term for slug: ${slug}`);
      assert.equal(term!.slug, slug);
    }
  });

  it("assigns each term to a known category", () => {
    for (const category of GLOSSARY_CATEGORY_ORDER) {
      const terms = getGlossaryTermsByCategory(category);
      assert.ok(terms.length > 0, `empty category: ${category}`);
    }
    const categorized = GLOSSARY_CATEGORY_ORDER.flatMap((c) =>
      getGlossaryTermsByCategory(c)
    );
    assert.equal(categorized.length, GLOSSARY_TERMS.length);
  });

  it("resolves related term slugs", () => {
    const mica = getGlossaryTerm("mica");
    assert.ok(mica);
    const related = getRelatedGlossaryTerms(mica!);
    assert.ok(related.length > 0);
    for (const rel of related) {
      assert.ok(getGlossaryTerm(rel.slug));
    }
  });

  it("returns null for unknown slug", () => {
    assert.equal(getGlossaryTerm("not-a-real-term-slug"), null);
  });
});
