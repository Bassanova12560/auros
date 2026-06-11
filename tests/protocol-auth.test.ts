import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  DEMO_API_KEY,
  FREE_TIER_MONTHLY_LIMIT,
  KEY_PREFIX_TEST,
} from "../lib/protocol/constants";
import {
  createApiKey,
  hashKey,
  isValidKeyFormat,
  validateApiKey,
} from "../lib/protocol/auth/keys";

describe("protocol/auth", () => {
  it("accepts demo key format", () => {
    assert.ok(isValidKeyFormat(DEMO_API_KEY));
    assert.ok(isValidKeyFormat(`${KEY_PREFIX_TEST}abc123`));
    assert.equal(isValidKeyFormat("invalid_key"), false);
  });

  it("validates demo key without database", async () => {
    const result = await validateApiKey(DEMO_API_KEY);
    assert.equal(result.valid, true);
    assert.equal(result.isDemo, true);
  });

  it("creates and validates a new test key", async () => {
    const email = `dev-${Date.now()}@example.com`;
    const { apiKey, tier, monthlyLimit } = await createApiKey(email);
    assert.ok(apiKey.startsWith(KEY_PREFIX_TEST));
    assert.equal(tier, "free");
    assert.equal(monthlyLimit, FREE_TIER_MONTHLY_LIMIT);

    const validation = await validateApiKey(apiKey);
    assert.equal(validation.valid, true);
    assert.equal(validation.isDemo, false);
    assert.equal(validation.email, email);

    const wrong = await validateApiKey(`${apiKey}x`);
    assert.equal(wrong.valid, false);
  });

  it("hashes keys consistently", () => {
    const h1 = hashKey("auros_pk_test_sample");
    const h2 = hashKey("auros_pk_test_sample");
    assert.equal(h1, h2);
    assert.equal(h1.length, 64);
  });
});
