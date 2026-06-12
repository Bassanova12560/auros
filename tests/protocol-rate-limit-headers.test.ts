import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { DEMO_API_KEY } from "../lib/protocol/constants";
import { authenticateProtocolRequest } from "../lib/protocol/auth/middleware";
import {
  formatRateLimitHeaders,
  monthQuotaResetUnix,
  runWithRateLimitContext,
  setRateLimitContext,
} from "../lib/protocol/rate-limit-context";
import { getProtocolResponseHeaders } from "../lib/protocol/response";
import { protocolRoute, withRateLimitHeaders } from "../lib/protocol/timing";

describe("protocol/rate-limit-headers", () => {
  it("monthQuotaResetUnix is the first second of next UTC month", () => {
    const reset = monthQuotaResetUnix();
    const date = new Date(reset * 1000);
    assert.equal(date.getUTCDate(), 1);
    assert.equal(date.getUTCHours(), 0);
    assert.ok(reset > Math.floor(Date.now() / 1000));
  });

  it("formatRateLimitHeaders uses Stripe-style names", () => {
    const headers = formatRateLimitHeaders({ limit: 100, remaining: 42, reset: 1_751_328_000 });
    assert.equal(headers["X-RateLimit-Limit"], "100");
    assert.equal(headers["X-RateLimit-Remaining"], "42");
    assert.equal(headers["X-RateLimit-Reset"], "1751328000");
  });

  it("getProtocolResponseHeaders merges rate limit context", async () => {
    await runWithRateLimitContext(async () => {
      setRateLimitContext({ limit: 50, remaining: 49, reset: 1_751_328_000 });
      const headers = getProtocolResponseHeaders();
      assert.equal(headers["X-RateLimit-Limit"], "50");
      assert.equal(headers["X-RateLimit-Remaining"], "49");
      assert.ok(headers["X-AUROS-Protocol-Version"]);
    });
  });

  it("withRateLimitHeaders appends headers when missing", async () => {
    await runWithRateLimitContext(async () => {
      setRateLimitContext({ limit: 100, remaining: 99, reset: 1_751_328_000 });
      const response = withRateLimitHeaders(Response.json({ ok: true }));
      assert.equal(response.headers.get("X-RateLimit-Limit"), "100");
      assert.equal(response.headers.get("X-RateLimit-Remaining"), "99");
    });
  });

  it("protocolRoute adds rate limit headers on authenticated demo request", async () => {
    const handler = protocolRoute(async (req: Request) => {
      const auth = await authenticateProtocolRequest(req);
      if (!auth.ok) return auth.response;
      return Response.json({ ok: true });
    });

    const req = new Request("http://localhost/api/v1/score", {
      method: "POST",
      headers: { Authorization: `Bearer ${DEMO_API_KEY}` },
    });
    const res = await handler(req, undefined as never);
    assert.equal(res.headers.get("X-RateLimit-Limit"), "50");
    assert.ok(res.headers.get("X-RateLimit-Remaining"));
    assert.ok(res.headers.get("X-RateLimit-Reset"));
    assert.ok(res.headers.get("X-Response-Time"));
  });
});
