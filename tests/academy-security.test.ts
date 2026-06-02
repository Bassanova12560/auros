import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isLegacyCertifyAllowed, ACADEMY_DEV_SECRET } from "../lib/academy/security";
import { decodeSignedPayload } from "../lib/academy/session-token";
import { submitQuizSession, startQuizSession } from "../lib/academy/integrity-flow";
import { getQuestionById } from "../lib/academy/quiz-bank";
import {
  MIN_QUESTION_MS,
  MIN_QUIZ_TOTAL_MS,
} from "../lib/academy/constants";

describe("academy/security", () => {
  it("blocks legacy certify in production", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    process.env.ACADEMY_LEGACY_CERTIFY = "";
    assert.equal(isLegacyCertifyAllowed(), false);
    process.env.NODE_ENV = prev;
  });

  it("allows legacy certify in dev", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    assert.equal(isLegacyCertifyAllowed(), true);
    process.env.NODE_ENV = prev;
  });

  it("rejects forged session tokens", () => {
    const token = Buffer.from(JSON.stringify({ p: "{}", s: "bad" })).toString("base64url");
    assert.equal(decodeSignedPayload(token), null);
  });

  it("rejects extra answer keys on quiz submit", () => {
    const session = startQuizSession("Extra Keys User");
    assert.ok(session);
    const ids = session!.questions.map((q) => q.id);
    const per = Math.max(MIN_QUESTION_MS, Math.ceil(MIN_QUIZ_TOTAL_MS / ids.length));
    const timings = Object.fromEntries(ids.map((id) => [id, per]));
    const answers = Object.fromEntries(
      ids.map((id) => [id, getQuestionById(id)!.correctOptionId])
    );
    answers["injected"] = "a";

    const result = submitQuizSession({
      sessionToken: session!.sessionToken,
      answers,
      timings,
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, "invalid_answers");
  });

  it("rejects dev default cert secret in production resolution", async () => {
    const prev = process.env.NODE_ENV;
    const prevSecret = process.env.ACADEMY_CERT_SECRET;
    process.env.NODE_ENV = "production";
    process.env.ACADEMY_CERT_SECRET = ACADEMY_DEV_SECRET;
    const { resolveAcademyCertSecret } = await import("../lib/academy/security");
    assert.equal(resolveAcademyCertSecret(), null);
    process.env.NODE_ENV = prev;
    process.env.ACADEMY_CERT_SECRET = prevSecret;
  });
});
