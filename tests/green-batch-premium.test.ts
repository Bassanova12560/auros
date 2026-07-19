import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { POST as wattBatchPost } from "@/app/api/v1/green/watt/batch/route";
import { POST as cqsBatchPost } from "@/app/api/v1/green/carbon-quality/batch/route";
import { DEMO_API_KEY } from "@/lib/protocol/constants";

function wattBatchRequest(apiKey: string) {
  return new Request("http://localhost/api/v1/green/watt/batch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: [{ id: "sunexchange" }] }),
  });
}

function cqsBatchRequest(apiKey: string) {
  return new Request("http://localhost/api/v1/green/carbon-quality/batch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: [{ id: "toucan" }] }),
  });
}

describe("green batch premium gate", () => {
  it("blocks free demo key on watt batch (premium-only)", async () => {
    const res = await wattBatchPost(wattBatchRequest(DEMO_API_KEY));
    assert.equal(res.status, 403);
    const body = (await res.json()) as { error?: { code?: string } };
    assert.equal(body.error?.code, "premium_required");
  });

  it("allows free demo key on carbon-quality batch (freemium tier)", async () => {
    const res = await cqsBatchPost(cqsBatchRequest(DEMO_API_KEY));
    assert.equal(res.status, 200);
    const body = (await res.json()) as { tier?: string; succeeded?: number };
    assert.equal(body.tier, "demo");
    assert.equal(body.succeeded, 1);
  });

  it("rejects unknown live key on watt batch (no free-prefix bypass)", async () => {
    const res = await wattBatchPost(wattBatchRequest("auros_pk_live_smoke_test_key"));
    assert.ok(res.status === 401 || res.status === 403);
  });
});
