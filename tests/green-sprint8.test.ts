import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getAllAiFirstPages } from "@/lib/ai-first/catalog";
import { GREEN_MARKET_OFFER_ROUTE, GREEN_MARKET_ROUTE } from "@/lib/green/constants";
import { getGreenMarketOfferById } from "@/lib/green/market/green-market-db";
import { formatGreenMarketOfferTitle } from "@/lib/green/market/offer-detail";
import { GREEN_MARKET_OFFERS } from "@/lib/green/market/data";
import {
  buildGreenMarketActorFocusUrl,
  buildGreenMarketOfferShareUrl,
  findDemoGreenMarketOfferById,
  greenMarketOfferPath,
  isGreenMarketOfferUuid,
  normalizeGreenMarketOfferId,
} from "@/lib/green/market/offer-routes";
import { getGreenMarketMessages } from "@/lib/green/market-i18n";

describe("green/sprint8-offer-routes", () => {
  it("builds encoded offer detail paths", () => {
    assert.equal(greenMarketOfferPath("offer-001"), "/green/market/offer/offer-001");
    assert.equal(
      greenMarketOfferPath("spaced id"),
      "/green/market/offer/spaced%20id"
    );
  });

  it("builds share and actor-focus URLs", () => {
    const share = buildGreenMarketOfferShareUrl("offer-002", "https://auros.example");
    assert.equal(share, "https://auros.example/green/market/offer/offer-002");

    const focus = buildGreenMarketActorFocusUrl("Ferme solaire", "https://auros.example");
    assert.ok(focus.includes(`${GREEN_MARKET_ROUTE}?`));
    assert.ok(focus.includes("q=Ferme"));
  });

  it("normalizes route ids and detects UUIDs", () => {
    assert.equal(normalizeGreenMarketOfferId("offer%2D001"), "offer-001");
    assert.equal(isGreenMarketOfferUuid("not-a-uuid"), false);
    assert.equal(
      isGreenMarketOfferUuid("550e8400-e29b-41d4-a716-446655440000"),
      true
    );
  });

  it("resolves demo offers by external id", () => {
    const first = GREEN_MARKET_OFFERS[0];
    assert.ok(first);
    const found = findDemoGreenMarketOfferById(first.id);
    assert.equal(found?.id, first.id);
    assert.equal(findDemoGreenMarketOfferById("missing-offer-xyz"), null);
  });
});

describe("green/sprint8-offer-detail", () => {
  it("formats offer title in FR/EN/ES", () => {
    const offer = GREEN_MARKET_OFFERS[0];
    assert.ok(offer);
    for (const locale of ["fr", "en", "es"] as const) {
      const title = formatGreenMarketOfferTitle(offer, locale);
      assert.ok(title.includes(offer.actorName));
      assert.ok(title.length > offer.actorName.length + 3);
    }
  });

  it("loads demo offer detail without database", async () => {
    const offer = GREEN_MARKET_OFFERS[0];
    assert.ok(offer);
    const detail = await getGreenMarketOfferById(offer.id);
    assert.ok(detail);
    assert.equal(detail!.id, offer.id);
    assert.ok(detail!.description.length > 0);
  });

  it("returns null for unknown offer id", async () => {
    const detail = await getGreenMarketOfferById("does-not-exist-999");
    assert.equal(detail, null);
  });
});

describe("green/sprint8-catalog", () => {
  it("registers offer detail route in ai-first catalog", () => {
    const page = getAllAiFirstPages().find((p) => p.path === GREEN_MARKET_OFFER_ROUTE);
    assert.ok(page);
    assert.equal(page!.indexable, true);
  });

  it("exposes offer detail i18n", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const od = getGreenMarketMessages(locale).offerDetail;
      assert.ok(od.shareOffer.length > 0);
      assert.ok(od.viewActorOnMap.length > 0);
      const mm = getGreenMarketMessages(locale).market;
      assert.ok(mm.viewOffer.length > 0);
    }
  });
});
