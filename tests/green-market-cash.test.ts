import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GREEN_MARKET_INTRO_CENTS,
  GREEN_MARKET_INTRO_EUR,
  GREEN_MARKET_INTRO_PRODUCT,
  GREEN_MARKET_VERIFIED_CENTS,
  GREEN_MARKET_VERIFIED_PRODUCT,
} from "@/lib/green/market-cash-pricing";
import {
  parseGreenMarketIntroMetadata,
  parseGreenMarketVerifiedMetadata,
} from "@/lib/stripe/green-market-cash-checkout";

describe("green market cash products", () => {
  it("prices intro at 149 and verified at 299", () => {
    assert.equal(GREEN_MARKET_INTRO_EUR, 149);
    assert.equal(GREEN_MARKET_INTRO_CENTS, 14900);
    assert.equal(GREEN_MARKET_VERIFIED_CENTS, 29900);
  });

  it("parses intro and verified metadata", () => {
    const intro = parseGreenMarketIntroMetadata({
      product: GREEN_MARKET_INTRO_PRODUCT,
      email: "buyer@example.com",
      locale: "en",
      offerId: "off-1",
      offerTitle: "Solar PPA",
      actorName: "Acme Solar",
      visitorName: "Ada",
      message: "hello",
    });
    assert.ok(intro);
    assert.equal(intro!.email, "buyer@example.com");
    assert.equal(intro!.locale, "en");

    const verified = parseGreenMarketVerifiedMetadata({
      product: GREEN_MARKET_VERIFIED_PRODUCT,
      email: "issuer@example.com",
      locale: "fr",
      company: "Acme",
      actorId: "actor-1",
      notes: "please review",
    });
    assert.ok(verified);
    assert.equal(verified!.company, "Acme");
    assert.equal(verified!.actorId, "actor-1");
    assert.equal(verified!.notes, "please review");
  });

  it("rejects wrong product metadata", () => {
    assert.equal(
      parseGreenMarketIntroMetadata({
        product: "other",
        email: "a@b.com",
      }),
      null
    );
  });
});
