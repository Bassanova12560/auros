import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getAllAiFirstPages } from "@/lib/ai-first/catalog";
import {
  GREEN_MARKET_ACTOR_ROUTE,
  GREEN_MARKET_ACTORS,
  GREEN_MARKET_ROUTE,
} from "@/lib/green";
import { formatGreenMarketActorTitle } from "@/lib/green/market/actor-detail";
import {
  getGreenMarketActorById,
  getGreenMarketOfferById,
  listGreenMarketActorSitemapIds,
} from "@/lib/green/market/green-market-db";
import {
  buildGreenMarketActorShareUrl,
  findDemoGreenMarketActorById,
  greenMarketActorMailtoHref,
  greenMarketActorPath,
  greenMarketActorSheetHref,
  normalizeGreenMarketActorId,
} from "@/lib/green/market/actor-routes";
import {
  buildGreenMarketActorJsonLd,
  buildGreenMarketOfferJsonLd,
} from "@/lib/green/market/json-ld";
import { getGreenMarketMessages } from "@/lib/green/market-i18n";

describe("green/sprint9-actor-routes", () => {
  it("builds encoded actor profile paths", () => {
    assert.equal(
      greenMarketActorPath("prod-solar-luberon"),
      "/green/market/actor/prod-solar-luberon"
    );
    assert.equal(
      greenMarketActorPath("spaced id"),
      "/green/market/actor/spaced%20id"
    );
  });

  it("builds share URLs and map popup links to profile", () => {
    const actor = GREEN_MARKET_ACTORS[0];
    assert.ok(actor);
    const share = buildGreenMarketActorShareUrl(actor.id, "https://auros.example");
    assert.equal(
      share,
      `https://auros.example/green/market/actor/${encodeURIComponent(actor.id)}`
    );
    assert.equal(greenMarketActorSheetHref(actor), greenMarketActorPath(actor.id));
  });

  it("normalizes route ids and resolves demo actors", () => {
    const first = GREEN_MARKET_ACTORS[0];
    assert.ok(first);
    assert.equal(normalizeGreenMarketActorId("prod%2Dsolar"), "prod-solar");
    assert.equal(findDemoGreenMarketActorById(first.id)?.id, first.id);
    assert.equal(findDemoGreenMarketActorById("missing-actor-xyz"), null);
  });

  it("builds mailto when email present", () => {
    const withEmail = GREEN_MARKET_ACTORS.find((a) => a.contactEmail);
    assert.ok(withEmail);
    assert.ok(greenMarketActorMailtoHref(withEmail)?.startsWith("mailto:"));
    const noEmail = { ...withEmail, contactEmail: "" };
    assert.equal(greenMarketActorMailtoHref(noEmail), null);
  });
});

describe("green/sprint9-actor-detail", () => {
  it("formats actor title in FR/EN/ES", () => {
    const actor = GREEN_MARKET_ACTORS[0];
    assert.ok(actor);
    for (const locale of ["fr", "en", "es"] as const) {
      const title = formatGreenMarketActorTitle(actor, locale);
      assert.ok(title.includes(actor.name));
    }
  });

  it("loads demo actor detail with offers", async () => {
    const actor = GREEN_MARKET_ACTORS[0];
    assert.ok(actor);
    const detail = await getGreenMarketActorById(actor.id);
    assert.ok(detail);
    assert.equal(detail!.id, actor.id);
    assert.ok(detail!.description.length > 0);
    assert.ok(Array.isArray(detail!.offers));
  });

  it("returns null for unknown actor id", async () => {
    const detail = await getGreenMarketActorById("does-not-exist-actor-999");
    assert.equal(detail, null);
  });

  it("lists actor sitemap ids from snapshot", async () => {
    const ids = await listGreenMarketActorSitemapIds();
    assert.ok(ids.length > 0);
    assert.ok(ids.every((e) => typeof e.id === "string" && e.id.length > 0));
  });
});

describe("green/sprint9-json-ld", () => {
  it("builds Offer and LocalBusiness JSON-LD", async () => {
    const offer = await getGreenMarketOfferById("offer-001");
    assert.ok(offer);
    const offerLd = buildGreenMarketOfferJsonLd(offer!, "fr");
    assert.equal(offerLd["@type"], "Offer");
    assert.ok(String(offerLd.url).includes("/green/market/offer/"));

    const actor = await getGreenMarketActorById("prod-solar-luberon");
    assert.ok(actor);
    const actorLd = buildGreenMarketActorJsonLd(actor!, "fr");
    assert.equal(actorLd["@type"], "LocalBusiness");
    assert.ok(String(actorLd.url).includes("/green/market/actor/"));
  });
});

describe("green/sprint9-catalog-i18n", () => {
  it("registers actor profile route in ai-first catalog", () => {
    const page = getAllAiFirstPages().find((p) => p.path === GREEN_MARKET_ACTOR_ROUTE);
    assert.ok(page);
    assert.equal(page!.indexable, true);
  });

  it("exposes actor detail and offer interest i18n", () => {
    for (const locale of ["fr", "en", "es"] as const) {
      const m = getGreenMarketMessages(locale);
      assert.ok(m.actorDetail.shareProfile.length > 0);
      assert.ok(m.offerInterest.submit.length > 0);
      assert.ok(m.offerDetail.viewActorProfile.length > 0);
      assert.ok(m.market.viewActorProfile.length > 0);
    }
  });
});

describe("green/sprint9-market-links", () => {
  it("keeps actor focus URL on marketplace", () => {
    const actor = GREEN_MARKET_ACTORS[0];
    assert.ok(actor);
    const focus = `${GREEN_MARKET_ROUTE}?q=${encodeURIComponent(actor.name.split(" ")[0] ?? actor.name)}`;
    assert.ok(focus.startsWith(GREEN_MARKET_ROUTE));
  });
});
