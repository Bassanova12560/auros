import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GREEN_FAST_TRACK_CENTS,
  GREEN_FAST_TRACK_PRODUCT,
  GREEN_INDEX_PACK_CENTS,
  GREEN_INDEX_PACK_PRODUCT,
  GREEN_INVESTOR_ROOM_CENTS,
  GREEN_INVESTOR_ROOM_PRODUCT,
  GREEN_READINESS_MRR_CENTS,
  GREEN_READINESS_MRR_PRODUCT,
} from "@/lib/green/p1-cash-pricing";
import {
  grantInvestorRoomAccess,
  resolveInvestorRoomAccess,
} from "@/lib/green/investor-room-access";
import { parseGreenP1CheckoutMetadata } from "@/lib/stripe/green-p1-checkout";

describe("green-p1-cash", () => {
  it("has expected price points", () => {
    assert.equal(GREEN_FAST_TRACK_CENTS, 49900);
    assert.equal(GREEN_INVESTOR_ROOM_CENTS, 19900);
    assert.equal(GREEN_INDEX_PACK_CENTS, 9900);
    assert.equal(GREEN_READINESS_MRR_CENTS, 14900);
  });

  it("parses checkout metadata", () => {
    const meta = parseGreenP1CheckoutMetadata({
      product: GREEN_FAST_TRACK_PRODUCT,
      email: "Ops@Bank.com",
      locale: "fr",
      company: "Bank",
      notes: "",
      partner_code: "cab-lux",
    });
    assert.ok(meta);
    assert.equal(meta!.email, "ops@bank.com");
    assert.equal(meta!.product, GREEN_FAST_TRACK_PRODUCT);
    assert.equal(meta!.partnerCode, "CAB-LUX");
    assert.equal(
      parseGreenP1CheckoutMetadata({
        product: "nope",
        email: "a@b.com",
      }),
      null
    );
  });

  it("grants and resolves investor room tokens", () => {
    const access = grantInvestorRoomAccess({
      email: "fund@example.com",
      company: "Fund",
      sessionId: "cs_test",
    });
    assert.ok(access.token.length >= 8);
    assert.equal(resolveInvestorRoomAccess(access.token)?.email, "fund@example.com");
    assert.equal(resolveInvestorRoomAccess("bad"), null);
    assert.ok(
      [
        GREEN_INVESTOR_ROOM_PRODUCT,
        GREEN_INDEX_PACK_PRODUCT,
        GREEN_READINESS_MRR_PRODUCT,
      ].every((p) => p.startsWith("green_"))
    );
  });
});
