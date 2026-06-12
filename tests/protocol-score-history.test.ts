import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  isValidScoreSessionId,
  listScoreHistory,
  newScoreId,
  recordScoreHistory,
  resolveScoreSessionId,
  scoreSessionOwnedByKey,
} from "../lib/protocol/scoring/history";
import { computeProtocolScore } from "../lib/protocol/scoring/compute-score";

const KEY = "test_key_hash_history";

function sampleRequest() {
  return {
    description: "Luxembourg retail warehouse €2.5M SPV professional investors",
    asset_type: "real_estate" as const,
    issuer_type: "company_spv" as const,
  };
}

describe("protocol/score-history", () => {
  it("generates valid score session ids", () => {
    const id = newScoreId();
    assert.ok(id.startsWith("scr_"));
    assert.equal(isValidScoreSessionId(id), true);
    assert.equal(isValidScoreSessionId("mon_abc"), false);
  });

  it("resolves a new session when no score_id is provided", async () => {
    const resolved = await resolveScoreSessionId({}, KEY);
    assert.equal(resolved.ok, true);
    if (!resolved.ok) return;
    assert.ok(resolved.scoreId.startsWith("scr_"));
  });

  it("records and lists score history for a session", async () => {
    const resolved = await resolveScoreSessionId({}, KEY);
    assert.equal(resolved.ok, true);
    if (!resolved.ok) return;

    const scoreId = resolved.scoreId;
    const result = computeProtocolScore(sampleRequest());
    await recordScoreHistory(KEY, scoreId, sampleRequest(), result);

    const owned = await scoreSessionOwnedByKey(scoreId, KEY);
    assert.equal(owned, true);

    const history = await listScoreHistory(scoreId, KEY);
    assert.ok(history);
    assert.equal(history?.kind, "session");
    assert.equal(history?.entries.length, 1);
    assert.equal(history?.entries[0]?.score, result.score);
    assert.equal(history?.entries[0]?.grade, result.grade);
    assert.equal(history?.entries[0]?.payload.status, result.status);
  });

  it("appends multiple entries to the same score_id", async () => {
    const resolved = await resolveScoreSessionId({}, KEY);
    assert.equal(resolved.ok, true);
    if (!resolved.ok) return;

    const scoreId = resolved.scoreId;
    const first = computeProtocolScore(sampleRequest());
    await recordScoreHistory(KEY, scoreId, sampleRequest(), first);

    const second = computeProtocolScore({
      ...sampleRequest(),
      has_kyc: true,
      has_data_room: true,
      documents_count: 5,
    });
    await recordScoreHistory(
      KEY,
      scoreId,
      { ...sampleRequest(), has_kyc: true, has_data_room: true, documents_count: 5 },
      second
    );

    const followUp = await resolveScoreSessionId({ score_id: scoreId }, KEY);
    assert.equal(followUp.ok, true);

    const history = await listScoreHistory(scoreId, KEY);
    assert.equal(history?.entries.length, 2);
    assert.ok((history?.entries[1]?.score ?? 0) >= (history?.entries[0]?.score ?? 0));
  });

  it("rejects unknown score_id for follow-up requests", async () => {
    const unknown = `scr_${"a".repeat(24)}`;
    const resolved = await resolveScoreSessionId({ score_id: unknown }, KEY);
    assert.equal(resolved.ok, false);
    if (resolved.ok) return;
    assert.equal(resolved.code, "not_found");
  });
});
