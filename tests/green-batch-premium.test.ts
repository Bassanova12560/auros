import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { POST as wattBatchPost } from "@/app/api/v1/green/watt/batch/route";
import { POST as cqsBatchPost } from "@/app/api/v1/green/carbon-quality/batch/route";
import { DEMO_API_KEY } from "@/lib/protocol/constants";

function batchRequest(apiKey: string) {
  return new Request("http://localhost/api/v1/green/watt/batch", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: [{ id: "sunexchange" }] }),
  });
}

describe("green batch premium gate", () => {
  it("blocks free demo key on watt batch", async () => {
    const res = await wattBatchPost(batchRequest(DEMO_API_KEY));
    assert.equal(res.status, 403);
    const body = (await res.json()) as { error?: { code?: string } };
    assert.equal(body.error?.code, "premium_required");
  });

  it("blocks free demo key on carbon-quality batch", async () => {
    const req = new Request("http://localhost/api/v1/green/carbon-quality/batch", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DEMO_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: [{ id: "toucan" }] }),
    });
    const res = await cqsBatchPost(req);
    assert.equal(res.status, 403);
    const body = (await res.json()) as { error?: { code?: string } };
    assert.equal(body.error?.code, "premium_required");
  });

  it("allows live key prefix on watt batch", async () => {
    const res = await wattBatchPost(batchRequest("auros_pk_live_smoke_test_key"));
    assert.notEqual(res.status, 403);
  });
});
