import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getProtocolStatus } from "../lib/protocol/status";
import { protocolRoute, withResponseTime } from "../lib/protocol/timing";

describe("protocol/status", () => {
  it("getProtocolStatus returns operational services", async () => {
    const status = await getProtocolStatus();
    assert.ok(["operational", "degraded", "down"].includes(status.status));
    assert.equal(status.version, "1.0");
    assert.ok(status.services.scoring.status === "operational");
    assert.ok(["operational", "degraded"].includes(status.services.products.status));
    assert.ok(status.services.jurisdictions.status === "operational");
    assert.ok(status.timestamp);
    assert.ok(status.app_version);
  });
});

describe("protocol/timing", () => {
  it("protocolRoute adds X-Response-Time header", async () => {
    const handler = protocolRoute(async () => Response.json({ ok: true }));
    const res = await handler(new Request("http://localhost/api/v1/score"));
    assert.match(res.headers.get("X-Response-Time") ?? "", /^\d+ms$/);
  });

  it("withResponseTime does not duplicate header", async () => {
    const start = performance.now();
    const res = withResponseTime(
      new Response(JSON.stringify({ ok: true }), {
        headers: { "X-Response-Time": "5ms" },
      }),
      start
    );
    assert.equal(res.headers.get("X-Response-Time"), "5ms");
  });
});
