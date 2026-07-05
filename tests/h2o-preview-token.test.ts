import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeH2oScoreFromText } from "@/lib/green/scoring/h2o-score";
import {
  createH2oPreviewVerifyToken,
  verifyH2oPreviewVerifyToken,
} from "@/lib/eau/preview-token";
import { eauPassportVerifyPathForScore } from "@/lib/eau/passport";

describe("eau/preview-token", () => {
  it("round-trips signed H₂O preview", () => {
    const text =
      "Concession eau potable 15 ans 2 Mm³/an SPV France audit hydrologique DNSH";
    const score = computeH2oScoreFromText(text);
    assert.ok(score);

    const token = createH2oPreviewVerifyToken(score);
    const verified = verifyH2oPreviewVerifyToken(token);
    assert.ok(verified);
    assert.equal(verified.preview_id, score.preview_id);
    assert.equal(verified.rating, score.rating);
    assert.equal(verified.tier, score.tier);
  });

  it("builds verify path with embedded token", () => {
    const score = computeH2oScoreFromText(
      "Concession eau 2 Mm³/an France concession 20 ans",
    );
    assert.ok(score);
    const path = eauPassportVerifyPathForScore(score);
    assert.match(path, /^\/eau\/verify\//);
    const token = decodeURIComponent(path.replace("/eau/verify/", ""));
    assert.ok(verifyH2oPreviewVerifyToken(token));
  });

  it("rejects tampered token", () => {
    const score = computeH2oScoreFromText("Concession eau potable France m³/an");
    assert.ok(score);
    const token = createH2oPreviewVerifyToken(score);
    assert.equal(verifyH2oPreviewVerifyToken(`${token}x`), null);
  });
});
