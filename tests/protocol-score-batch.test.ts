import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  SCORE_BATCH_MAX_ITEMS,
  SCORE_BATCH_MIN_ITEMS,
  scoreBatchRequestSchema,
} from "../lib/protocol/schemas/score-batch";
import {
  processScoreItem,
  validateScoreRequest,
} from "../lib/protocol/scoring/process-score-item";

const KEY = "test-key-hash-batch";

describe("protocol/schemas/score-batch", () => {
  it("accepts 1–20 items with valid score payloads", () => {
    const parsed = scoreBatchRequestSchema.safeParse({
      items: [
        { description: "Luxembourg warehouse SPV professional investors" },
        { asset_type: "bonds", issuer_type: "company_spv" },
      ],
      record_history: false,
    });
    assert.equal(parsed.success, true);
    assert.equal(parsed.data?.items.length, 2);
  });

  it("rejects empty and oversized batches", () => {
    assert.equal(scoreBatchRequestSchema.safeParse({ items: [] }).success, false);
    const tooMany = Array.from({ length: SCORE_BATCH_MAX_ITEMS + 1 }, () => ({
      description: "Valid description for batch item test",
    }));
    assert.equal(scoreBatchRequestSchema.safeParse({ items: tooMany }).success, false);
    assert.equal(SCORE_BATCH_MIN_ITEMS, 1);
    assert.equal(SCORE_BATCH_MAX_ITEMS, 20);
  });
});

describe("protocol/scoring/process-score-item", () => {
  it("validates individual items", () => {
    const bad = validateScoreRequest({ description: "short" });
    assert.equal(bad.ok, false);
    const good = validateScoreRequest({
      description: "Luxembourg retail warehouse SPV professional investors",
    });
    assert.equal(good.ok, true);
  });

  it("returns validation-style failure for unknown score_id", async () => {
    const outcome = await processScoreItem(
      {
        description: "Luxembourg warehouse SPV professional investors",
        score_id: "scr_000000000000000000000000",
      },
      { keyHash: KEY, isDemo: true }
    );
    assert.equal(outcome.ok, false);
    if (outcome.ok) return;
    assert.equal(outcome.code, "not_found");
  });
});

describe("protocol/scoring/batch partial success", () => {
  it("mixes valid and invalid items at validation layer", () => {
    const items = [
      { description: "Luxembourg warehouse SPV professional investors" },
      { description: "bad" },
      { asset_type: "bonds", issuer_type: "company_spv" },
    ];

    const results = items.map((raw, index) => {
      const validated = validateScoreRequest(raw);
      if (!validated.ok) {
        return { index, ok: false as const };
      }
      return { index, ok: true as const };
    });

    assert.equal(results.length, 3);
    assert.equal(results.filter((r) => r.ok).length, 2);
    assert.equal(results.filter((r) => !r.ok).length, 1);
    assert.equal(results[1]?.ok, false);
  });
});
