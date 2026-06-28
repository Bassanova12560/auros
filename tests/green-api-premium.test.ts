import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  GREEN_API_PREMIUM_AMOUNT_CENTS,
  GREEN_API_PREMIUM_MONTHLY_EUR,
  GREEN_API_PREMIUM_PRODUCT,
} from "@/lib/green/green-api-pricing";
import { parseGreenApiPremiumMetadata } from "@/lib/stripe/green-api-checkout";
import { PREMIUM_TIER_MONTHLY_LIMIT, FREE_TIER_MONTHLY_LIMIT } from "@/lib/protocol/constants";
import { upgradeApiKeyTierByEmail, createApiKey, findKeyByEmail } from "@/lib/protocol/auth/keys";

describe("green/api-premium/pricing", () => {
  it("premium is 299 EUR/month", () => {
    assert.equal(GREEN_API_PREMIUM_MONTHLY_EUR, 299);
    assert.equal(GREEN_API_PREMIUM_AMOUNT_CENTS, 29900);
  });

  it("parses stripe metadata", () => {
    const meta = parseGreenApiPremiumMetadata({
      product: GREEN_API_PREMIUM_PRODUCT,
      email: "dev@example.com",
      locale: "fr",
    });
    assert.ok(meta);
    assert.equal(meta!.email, "dev@example.com");
  });
});

describe("green/api-premium/tier", () => {
  it("premium tier has higher monthly limit", async () => {
    const email = `premium-test-${Date.now()}@example.com`;
    await createApiKey(email);
    const upgraded = await upgradeApiKeyTierByEmail(email, "premium");
    assert.equal(upgraded, true);
    const record = await findKeyByEmail(email);
    assert.equal(record?.tier, "premium");
    // rate limit helper is not exported - test via constants
    assert.ok(PREMIUM_TIER_MONTHLY_LIMIT > FREE_TIER_MONTHLY_LIMIT);
  });
});
