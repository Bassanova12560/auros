import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  greenApiKeyWelcomeEmail,
  greenApiPremiumActivatedEmail,
  greenApiQuotaNurtureEmail,
} from "@/lib/emails/templates";
import { greenApiUpsellPayload } from "@/lib/green/green-api-nurture";
import { fulfillGreenApiPremiumSubscription } from "@/lib/green/fulfill-green-api-subscription";
import { GREEN_API_PREMIUM_PRODUCT } from "@/lib/green/green-api-pricing";
import { createApiKey, findKeyByEmail } from "@/lib/protocol/auth/keys";
import { PREMIUM_TIER_MONTHLY_LIMIT } from "@/lib/protocol/constants";

describe("green/api-nurture/emails", () => {
  it("welcome email mentions premium", () => {
    const { subject, html } = greenApiKeyWelcomeEmail({ monthlyLimit: 1000 });
    assert.ok(subject.includes("clé"));
    assert.ok(html.includes("299"));
  });

  it("quota nurture email includes usage", () => {
    const { subject } = greenApiQuotaNurtureEmail({ usage: 850, limit: 1000 });
    assert.ok(subject.includes("85%"));
  });

  it("premium activated email can include new key", () => {
    const { html } = greenApiPremiumActivatedEmail({
      apiKey: "auros_pk_live_test",
      monthlyLimit: PREMIUM_TIER_MONTHLY_LIMIT,
    });
    assert.ok(html.includes("auros_pk_live_test"));
  });
});

describe("green/api-nurture/upsell", () => {
  it("suggests upgrade below 20% remaining", () => {
    const upsell = greenApiUpsellPayload({
      tier: "free",
      rateLimit: { remaining: 50, limit: 1000 },
    });
    assert.ok(upsell);
    assert.equal(upsell!.upgrade_url, "/green/api");
  });

  it("skips upsell for premium", () => {
    assert.equal(
      greenApiUpsellPayload({
        tier: "premium",
        rateLimit: { remaining: 10, limit: 25000 },
      }),
      null
    );
  });
});

describe("green/api-nurture/fulfill", () => {
  it("creates key and upgrades on premium checkout without prior key", async () => {
    const email = `premium-auto-${Date.now()}@example.com`;
    const session = {
      metadata: {
        product: GREEN_API_PREMIUM_PRODUCT,
        email,
        locale: "fr",
      },
      customer_details: { email },
    } as Parameters<typeof fulfillGreenApiPremiumSubscription>[0];

    const ok = await fulfillGreenApiPremiumSubscription(session);
    assert.equal(ok, true);
    const record = await findKeyByEmail(email);
    assert.equal(record?.tier, "premium");
  });
});
