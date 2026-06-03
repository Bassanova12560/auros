import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getAllAiFirstPages } from "@/lib/ai-first/catalog";
import {
  GREEN_COMPARE_ROUTE,
  GREEN_REGISTRY_PROJECT_ROUTE,
  getGreenMessages,
} from "@/lib/green";
import {
  GREEN_COMPARE_OFFERS_MAX,
  addCompareOfferId,
  buildGreenCompareUrl,
  normalizeCompareOfferIds,
  parseCompareOfferIdsParam,
  writeCompareOfferIds,
} from "@/lib/green/market/compare-selection";
import { GREEN_MARKET_OFFERS } from "@/lib/green/market/data";
import { getGreenMarketOfferById } from "@/lib/green/market/green-market-db";
import { getGreenMarketMessages } from "@/lib/green/market-i18n";
import {
  getGreenRegistryProjectById,
  listGreenRegistryProjectSitemapIds,
} from "@/lib/green/green-registry";
import { greenLabelStatusEmail } from "@/lib/emails/templates";
import {
  greenRegistryProjectPath,
  normalizeGreenRegistryProjectId,
} from "@/lib/green/registry-routes";
import { updateGreenLabelApplicationStatus } from "@/lib/green/update-label-status";

describe("green/sprint10-compare-selection", () => {
  it("normalizes and caps compare offer ids", () => {
    const ids = normalizeCompareOfferIds([
      "a",
      "b",
      "a",
      "c",
      "d",
      "e",
      "f",
    ]);
    assert.equal(ids.length, GREEN_COMPARE_OFFERS_MAX);
    assert.deepEqual(ids, ["a", "b", "c", "d"]);
  });

  it("parses offers URL param", () => {
    assert.deepEqual(parseCompareOfferIdsParam("offer-001, offer-002"), [
      "offer-001",
      "offer-002",
    ]);
  });

  it("builds compare URLs with offers query", () => {
    const url = buildGreenCompareUrl(["offer-001", "offer-002"], "https://auros.example");
    assert.equal(
      url,
      "https://auros.example/green/compare?offers=offer-001%2Coffer-002"
    );
    assert.equal(buildGreenCompareUrl([]), GREEN_COMPARE_ROUTE);
  });

  it("tracks add/remove in localStorage", () => {
    const original = globalThis.localStorage;
    const store = new Map<string, string>();
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
      },
    });
    try {
      writeCompareOfferIds([]);
      const first = addCompareOfferId("offer-001");
      assert.equal(first.added, true);
      assert.equal(first.ids.length, 1);

      const dup = addCompareOfferId("offer-001");
      assert.equal(dup.added, false);
      assert.equal(dup.reason, "duplicate");

      writeCompareOfferIds(["a", "b", "c", "d"]);
      const full = addCompareOfferId("offer-002");
      assert.equal(full.added, false);
      assert.equal(full.reason, "full");
    } finally {
      Object.defineProperty(globalThis, "localStorage", {
        configurable: true,
        value: original,
      });
    }
  });
});

describe("green/sprint10-label-status-email", () => {
  it("builds in_review and rejected status emails", () => {
    for (const kind of ["in_review", "rejected"] as const) {
      const { subject, html } = greenLabelStatusEmail(kind, {
        contactName: "Ada",
        projectName: "Solar PT",
        myUrl: "https://auros.example/green/my#label-status",
        locale: "fr",
      });
      assert.ok(subject.length > 0);
      assert.ok(html.includes("Solar PT"));
      assert.ok(html.includes("Ada"));
    }
  });

  it("rejects invalid label status transitions without database", async () => {
    const result = await updateGreenLabelApplicationStatus({
      applicationId: "00000000-0000-0000-0000-000000000000",
      status: "in_review",
    });
    assert.equal(result.ok, false);
    if (!result.ok) {
      assert.ok(result.error === "not_found" || result.error === "database");
    }
  });
});

describe("green/sprint10-registry-project", () => {
  it("builds registry project detail paths", () => {
    assert.equal(
      greenRegistryProjectPath("pilot-solar-surplus-eu"),
      "/green/registry/project/pilot-solar-surplus-eu"
    );
    assert.equal(normalizeGreenRegistryProjectId("pilot%2Drec"), "pilot-rec");
  });

  it("resolves fallback registry project by id", async () => {
    const project = await getGreenRegistryProjectById("pilot-solar-surplus-eu");
    assert.ok(project);
    assert.equal(project!.labelTier, "pilot");
    assert.ok(project!.summaries.fr.length > 0);
  });

  it("lists registry projects for sitemap", async () => {
    const ids = await listGreenRegistryProjectSitemapIds();
    assert.ok(ids.length >= 3);
  });

  it("registers registry project route in ai-first catalog", () => {
    const page = getAllAiFirstPages().find(
      (p) => p.path === GREEN_REGISTRY_PROJECT_ROUTE
    );
    assert.ok(page);
    assert.equal(page!.indexable, true);
  });
});

describe("green/sprint10-i18n", () => {
  it("exposes compare and offer detail compare labels", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const c = getGreenMessages(locale).compare;
      assert.ok(c.marketOffersSectionTitle.length > 0);
      assert.ok(c.removeFromCompare.length > 0);
      const od = getGreenMarketMessages(locale).offerDetail;
      assert.ok(od.addToCompare.length > 0);
      assert.ok(od.openCompare.length > 0);
      const r = getGreenMessages(locale).registry;
      assert.ok(r.viewProject.length > 0);
      assert.ok(r.projectDetail.verifyCta.length > 0);
    }
  });

  it("loads demo offer for compare resolution", async () => {
    const offer = GREEN_MARKET_OFFERS[0];
    assert.ok(offer);
    const detail = await getGreenMarketOfferById(offer.id);
    assert.ok(detail);
  });
});
