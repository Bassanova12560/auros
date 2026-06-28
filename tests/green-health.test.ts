import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isCronAuthorized } from "@/lib/cron-auth";
import { GREEN_HEALTH_PATHS } from "@/lib/green/green-health";

describe("green/health-paths", () => {
  it("lists key public Green routes including API and press", () => {
    assert.ok(GREEN_HEALTH_PATHS.includes("/green/market"));
    assert.ok(GREEN_HEALTH_PATHS.includes("/green/api"));
    assert.ok(GREEN_HEALTH_PATHS.includes("/green/press"));
    assert.ok(GREEN_HEALTH_PATHS.includes("/data/nature-score"));
    assert.ok(GREEN_HEALTH_PATHS.length >= 10);
  });
});

describe("cron-auth", () => {
  const prior = process.env.CRON_SECRET;
  const priorNode = process.env.NODE_ENV;

  it("accepts Bearer CRON_SECRET", () => {
    process.env.CRON_SECRET = "test-cron-secret";
    process.env.NODE_ENV = "production";
    const req = new Request("https://example.com/api/cron/green-health", {
      headers: { authorization: "Bearer test-cron-secret" },
    });
    assert.equal(isCronAuthorized(req), true);
    if (prior === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = prior;
    if (priorNode === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = priorNode;
  });

  it("rejects missing auth in production", () => {
    process.env.CRON_SECRET = "test-cron-secret";
    process.env.NODE_ENV = "production";
    const req = new Request("https://example.com/api/cron/green-health");
    assert.equal(isCronAuthorized(req), false);
    if (prior === undefined) delete process.env.CRON_SECRET;
    else process.env.CRON_SECRET = prior;
    if (priorNode === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = priorNode;
  });
});

