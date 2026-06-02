import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it, before } from "node:test";

process.env.GEMINI_API_KEY = "";
process.env.GROQ_API_KEY = "";

try {
  const raw = readFileSync(".env.local", "utf8");
  for (const line of raw.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
} catch {
  // optional
}

import {
  MIN_CHALLENGE_MS,
  MIN_QUESTION_MS,
  MIN_QUIZ_TOTAL_MS,
} from "../lib/academy/constants";
import { getQuestionById } from "../lib/academy/quiz-bank";
import {
  gradeChallenge,
  startQuizSession,
  submitQuizSession,
  startRenewalSession,
  completeRenewal,
} from "../lib/academy/integrity-flow";
import { issueCertificate } from "../lib/academy/issue-certificate";
import { createCertificateToken } from "../lib/academy/cert-token";
import { RENEWAL_QUIZ } from "../lib/academy/renewal-content";
import {
  buildPassFields,
  FUNDAMENTALS_STRUCTURED_CHALLENGE,
  RENEWAL_STRUCTURED_CHALLENGE,
  getStructuredChallengeById,
  gradeStructuredFields,
} from "../lib/academy/structured-challenge";
import { decodeSignedPayload } from "../lib/academy/session-token";
import type { ChallengeSessionPayload } from "../lib/academy/types";

before(() => {
  delete process.env.GEMINI_API_KEY;
  delete process.env.GROQ_API_KEY;
});

function fakeTimings(questionIds: string[]): Record<string, number> {
  const perQuestion = Math.max(MIN_QUESTION_MS, Math.ceil(MIN_QUIZ_TOTAL_MS / questionIds.length));
  return Object.fromEntries(questionIds.map((id) => [id, perQuestion]));
}

describe("academy/integrity-flow", () => {
  it("starts quiz without exposing correct answers", () => {
    const session = startQuizSession("Test Integrity");
    assert.ok(session);
    for (const q of session!.questions) {
      assert.ok(!("correctOptionId" in q));
    }
  });

  it("rejects quiz submitted too fast", () => {
    const session = startQuizSession("Fast User");
    assert.ok(session);
    const answers = Object.fromEntries(
      session!.questions.map((q) => {
        const full = getQuestionById(q.id)!;
        return [q.id, full.correctOptionId];
      })
    );
    const timings = Object.fromEntries(
      session!.questions.map((q) => [q.id, 100])
    );
    const result = submitQuizSession({
      sessionToken: session!.sessionToken,
      answers,
      timings,
    });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.equal(result.reason, "quiz_completed_too_fast");
  });

  it("passes quiz and issues certificate after structured challenge", async () => {
    const session = startQuizSession("Integrity Pass");
    assert.ok(session);

    const questionIds = session!.questions.map((q) => q.id);
    const answers = Object.fromEntries(
      questionIds.map((id) => [id, getQuestionById(id)!.correctOptionId])
    );

    const submit = submitQuizSession({
      sessionToken: session!.sessionToken,
      answers,
      timings: fakeTimings(questionIds),
    });
    assert.equal(submit.ok, true);
    if (!submit.ok) return;

    assert.equal(submit.challenge.id, FUNDAMENTALS_STRUCTURED_CHALLENGE.id);
    assert.equal(submit.challenge.fields.length, 3);

    const challengeSession = decodeSignedPayload<ChallengeSessionPayload>(submit.challengeToken);
    assert.ok(challengeSession);
    const challengeDef = getStructuredChallengeById(challengeSession!.scenarioId)!;
    const fields = buildPassFields(challengeDef);

    const graded = await gradeChallenge({
      challengeToken: submit.challengeToken,
      fields,
      elapsedMs: MIN_CHALLENGE_MS + 1000,
    });
    assert.equal(graded.ok, true);
    if (!graded.ok) return;
    assert.equal(graded.certificate.integrityLevel, 2);
    assert.ok(graded.certificate.expiresAt);
    assert.equal(graded.grade.provider, "template");

    const replay = await gradeChallenge({
      challengeToken: submit.challengeToken,
      fields,
      elapsedMs: MIN_CHALLENGE_MS + 1000,
    });
    assert.equal(replay.ok, false);
    if (replay.ok) return;
    assert.equal(replay.reason, "session_already_used");
  });

  it("rejects challenge submitted too fast", async () => {
    const session = startQuizSession("Challenge Fast");
    assert.ok(session);
    const questionIds = session!.questions.map((q) => q.id);
    const answers = Object.fromEntries(
      questionIds.map((id) => [id, getQuestionById(id)!.correctOptionId])
    );
    const submit = submitQuizSession({
      sessionToken: session!.sessionToken,
      answers,
      timings: fakeTimings(questionIds),
    });
    assert.equal(submit.ok, true);
    if (!submit.ok) return;

    const challengeDef = getStructuredChallengeById(
      decodeSignedPayload<ChallengeSessionPayload>(submit.challengeToken)!.scenarioId
    )!;

    const graded = await gradeChallenge({
      challengeToken: submit.challengeToken,
      fields: buildPassFields(challengeDef),
      elapsedMs: 1000,
    });
    assert.equal(graded.ok, false);
    if (graded.ok) return;
    assert.equal(graded.reason, "challenge_too_fast");
  });

  it("renews expired certificate", async () => {
    const { certificate, token } = issueCertificate({
      fullName: "Renew User",
      tier: "fundamentals",
    });
    const expiredToken = createCertificateToken({
      id: certificate.id,
      fullName: certificate.fullName,
      tier: certificate.tier,
      issuedAt: certificate.issuedAt,
      expiresAt: new Date(Date.now() - 86_400_000).toISOString(),
      curriculumVersion: certificate.curriculumVersion,
      renewalGeneration: 0,
      integrityLevel: certificate.integrityLevel,
    });

    const start = startRenewalSession(expiredToken);
    assert.equal(start.ok, true);
    if (!start.ok) return;

    const answers = Object.fromEntries(
      RENEWAL_QUIZ.map((q) => [q.id, q.correctOptionId])
    );

    const done = await completeRenewal({
      certToken: expiredToken,
      challengeToken: start.challengeToken,
      answers,
      fields: buildPassFields(RENEWAL_STRUCTURED_CHALLENGE),
      elapsedMs: MIN_CHALLENGE_MS + 500,
    });
    assert.equal(done.ok, true);
    if (!done.ok) return;
    assert.equal(done.certificate.id, certificate.id);
    assert.equal(done.certificate.renewalGeneration, 1);
    assert.notEqual(done.token, token);
  });

  it("accepts disclaimer answers that use garantit / ne garantit pas", () => {
    const fields = {
      phase0:
        "La juridiction et structuration SPV en phase 0 précèdent le choix blockchain et tech. La conformité réglementaire fixe le cadre legal.",
      dataroom:
        "Sans data room complète, due diligence investisseur manque de documents et le risque compliance augmente avant émission titres.",
      disclaimer:
        "L'attestation AUROS garantit une compréhension indicative mais ne garantit pas counsel ni agrément AMF-CSSF.",
    };

    const graded = gradeStructuredFields(FUNDAMENTALS_STRUCTURED_CHALLENGE, fields);
    assert.equal(graded.pass, true, `expected pass, got flags: ${graded.result.flags.join(", ")}`);
  });

  it("rejects duplicate challenge field answers", () => {
    const duplicate =
      "Juridiction phase 0 structuration SPV conformité réglementaire data room due diligence investisseur compliance titres prospectus attestation indicative counsel AMF CSSF.";
    const graded = gradeStructuredFields(FUNDAMENTALS_STRUCTURED_CHALLENGE, {
      phase0: duplicate,
      dataroom: duplicate,
      disclaimer: duplicate,
    });
    assert.equal(graded.pass, false);
    assert.ok(graded.result.flags.includes("duplicate_fields"));
  });

  it("starts renewal when within renewal window", () => {
    const { certificate, token } = issueCertificate({
      fullName: "Due User",
      tier: "fundamentals",
    });
    const dueToken = createCertificateToken({
      id: certificate.id,
      fullName: certificate.fullName,
      tier: certificate.tier,
      issuedAt: certificate.issuedAt,
      expiresAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
      curriculumVersion: certificate.curriculumVersion,
      renewalGeneration: 0,
      integrityLevel: certificate.integrityLevel,
    });

    const start = startRenewalSession(dueToken);
    assert.equal(start.ok, true);
    if (!start.ok) return;
    assert.ok(start.challengeToken);
    assert.equal(token.length > 0, true);
  });

  it("blocks renewal when still active", () => {
    const { token } = issueCertificate({
      fullName: "Active User",
      tier: "fundamentals",
    });
    const start = startRenewalSession(token);
    assert.equal(start.ok, false);
    if (start.ok) return;
    assert.equal(start.reason, "not_due_yet");
  });
});
