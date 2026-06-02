import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  certifyFundamentals,
  createCertificateToken,
  parseCertificateToken,
  scoreQuiz,
  FUNDAMENTALS_QUIZ,
  ACADEMY_PASS_SCORE,
  CURRICULUM_VERSION,
  INTEGRITY_LEVEL,
} from "../lib/academy";
import { computeExpiresAt, issueCertificate } from "../lib/academy/issue-certificate";

describe("academy/certify", () => {
  it("scores quiz correctly", () => {
    const answers = Object.fromEntries(
      FUNDAMENTALS_QUIZ.map((q) => [q.id, q.correctOptionId])
    );
    assert.equal(scoreQuiz(FUNDAMENTALS_QUIZ, answers), FUNDAMENTALS_QUIZ.length);
  });

  it("issues v2 certificate when passing legacy certify", () => {
    const answers = Object.fromEntries(
      FUNDAMENTALS_QUIZ.map((q) => [q.id, q.correctOptionId])
    );
    const result = certifyFundamentals({ fullName: "Ada Lovelace", answers });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.ok(result.token.length > 20);
    assert.equal(result.certificate.fullName, "Ada Lovelace");
    assert.equal(result.certificate.tier, "fundamentals");
    assert.equal(result.certificate.integrityLevel, INTEGRITY_LEVEL);
    assert.equal(result.certificate.curriculumVersion, CURRICULUM_VERSION);
    assert.ok(result.certificate.expiresAt);
  });

  it("rejects failing score", () => {
    const answers = Object.fromEntries(
      FUNDAMENTALS_QUIZ.map((q) => [q.id, "wrong"])
    );
    const result = certifyFundamentals({ fullName: "Test User", answers });
    assert.equal(result.ok, false);
    if (result.ok) return;
    assert.ok(result.score < ACADEMY_PASS_SCORE);
  });

  it("round-trips certificate token v2", () => {
    const issuedAt = new Date().toISOString();
    const token = createCertificateToken({
      id: "ABC123",
      fullName: "Jean Dupont",
      tier: "fundamentals",
      issuedAt,
      expiresAt: computeExpiresAt(issuedAt),
      curriculumVersion: CURRICULUM_VERSION,
      renewalGeneration: 0,
      integrityLevel: INTEGRITY_LEVEL,
    });
    const parsed = parseCertificateToken(token);
    assert.ok(parsed);
    assert.equal(parsed!.fullName, "Jean Dupont");
    assert.equal(parsed!.id, "ABC123");
    assert.equal(parsed!.integrityLevel, INTEGRITY_LEVEL);
  });

  it("rejects tampered token", () => {
    const issuedAt = new Date().toISOString();
    const token = createCertificateToken({
      id: "ABC123",
      fullName: "Jean Dupont",
      tier: "fundamentals",
      issuedAt,
      expiresAt: computeExpiresAt(issuedAt),
      curriculumVersion: CURRICULUM_VERSION,
      renewalGeneration: 0,
      integrityLevel: INTEGRITY_LEVEL,
    });
    const parsed = parseCertificateToken(token.slice(0, -2) + "xx");
    assert.equal(parsed, null);
  });
});

describe("academy/issueCertificate", () => {
  it("preserves cert id on renewal", () => {
    const first = issueCertificate({ fullName: "Marie Curie", tier: "fundamentals" });
    const renewed = issueCertificate({
      fullName: "Marie Curie",
      tier: "fundamentals",
      priorId: first.certificate.id,
      renewalGeneration: 1,
    });
    assert.equal(renewed.certificate.id, first.certificate.id);
    assert.equal(renewed.certificate.renewalGeneration, 1);
  });
});
