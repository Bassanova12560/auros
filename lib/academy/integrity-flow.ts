import {
  ACADEMY_PASS_SCORE,
  ACADEMY_QUIZ_LENGTH,
  CHALLENGE_SESSION_MINUTES,
  MAX_QUIZ_SESSION_MINUTES,
  MIN_CHALLENGE_MS,
  MIN_QUESTION_MS,
  MIN_QUIZ_TOTAL_MS,
} from "./constants";
import { gradeStructuredFields, getFundamentalsStructuredChallenge, getRenewalStructuredChallenge, getStructuredChallengeById, toPublicStructuredChallenge, parseChallengeFields } from "./structured-challenge";
import { getRenewalQuiz, RENEWAL_UPDATE_VERSION } from "./renewal-content";
import {
  validateChallengeTiming,
  validateQuizTimings,
} from "./anti-cheat";
import { enrichCertificateView, parseCertificateToken } from "./cert-token";
import { issueCertificate, verifyUrl, renewalUrl } from "./issue-certificate";
import {
  getQuestionById,
  pickQuizQuestions,
  scoreQuestions,
  toPublicQuestion,
} from "./quiz-bank";
import {
  decodeSignedPayload,
  encodeSignedPayload,
  expiresInMinutes,
  newSessionId,
  sessionExpired,
} from "./session-token";
import { logCertificateIssuance } from "./cert-registry";
import { consumeAcademySession } from "./session-consumption";
import { getAcademyMessages, type AcademyLocale } from "./i18n";
import type {
  ChallengeGradeResult,
  ChallengeSessionPayload,
  QuizSessionPayload,
  QuizStartResult,
  QuizSubmitResult,
  RenewalResult,
} from "./types";

export function startQuizSession(
  fullName: string,
  localeInput?: AcademyLocale
): QuizStartResult | null {
  const name = fullName.trim();
  if (name.length < 2 || name.length > 120) return null;
  const locale = localeInput ?? "fr";

  const questions = pickQuizQuestions(ACADEMY_QUIZ_LENGTH, locale);
  const payload: QuizSessionPayload = {
    kind: "quiz",
    sessionId: newSessionId(),
    fullName: name,
    questionIds: questions.map((q) => q.id),
    locale,
    createdAt: new Date().toISOString(),
    expiresAt: expiresInMinutes(MAX_QUIZ_SESSION_MINUTES),
  };

  return {
    sessionToken: encodeSignedPayload(payload),
    questions: questions.map(toPublicQuestion),
    expiresAt: payload.expiresAt,
    rules: {
      minTotalMs: MIN_QUIZ_TOTAL_MS,
      minQuestionMs: MIN_QUESTION_MS,
      passScore: ACADEMY_PASS_SCORE,
      questionCount: ACADEMY_QUIZ_LENGTH,
    },
  };
}

export function submitQuizSession(input: {
  sessionToken: string;
  answers: Record<string, string>;
  timings: Record<string, number>;
}): QuizSubmitResult {
  const session = decodeSignedPayload<QuizSessionPayload>(input.sessionToken);
  if (!session || session.kind !== "quiz") {
    return { ok: false, reason: "invalid_session" };
  }

  const timingCheck = validateQuizTimings(
    session.questionIds,
    input.timings,
    session.expiresAt
  );
  if (!timingCheck.ok) {
    return { ok: false, reason: timingCheck.reason };
  }

  const locale = session.locale ?? "fr";
  const questions = session.questionIds
    .map((id) => getQuestionById(id, locale))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  if (questions.length !== session.questionIds.length) {
    return { ok: false, reason: "invalid_questions" };
  }

  const allowed = new Set(session.questionIds);
  for (const key of Object.keys(input.answers)) {
    if (!allowed.has(key)) {
      return { ok: false, reason: "invalid_answers" };
    }
  }

  if (Object.keys(input.answers).length !== questions.length) {
    return { ok: false, reason: "incomplete_answers" };
  }

  for (const id of session.questionIds) {
    if (!(id in input.answers)) {
      return { ok: false, reason: "incomplete_answers" };
    }
  }

  const score = scoreQuestions(questions, input.answers);
  if (score < ACADEMY_PASS_SCORE) {
    return { ok: false, reason: "score_too_low", score };
  }

  const challengeDef = getFundamentalsStructuredChallenge(locale);
  const challenge: ChallengeSessionPayload = {
    kind: "challenge",
    sessionId: newSessionId(),
    fullName: session.fullName,
    scenarioId: challengeDef.id,
    quizSessionId: session.sessionId,
    quizScore: score,
    locale,
    createdAt: new Date().toISOString(),
    expiresAt: expiresInMinutes(CHALLENGE_SESSION_MINUTES),
  };

  return {
    ok: true,
    score,
    challengeToken: encodeSignedPayload(challenge),
    challenge: toPublicStructuredChallenge(challengeDef),
  };
}

export async function gradeChallenge(input: {
  challengeToken: string;
  response?: string;
  fields?: Record<string, string>;
  elapsedMs: number;
}): Promise<ChallengeGradeResult> {
  const session = decodeSignedPayload<ChallengeSessionPayload>(input.challengeToken);
  if (!session || session.kind !== "challenge") {
    return { ok: false, reason: "invalid_session" };
  }

  if (session.renewal) {
    return { ok: false, reason: "use_renew_endpoint" };
  }

  const timingCheck = validateChallengeTiming(input.elapsedMs, session.expiresAt);
  if (!timingCheck.ok) {
    return { ok: false, reason: timingCheck.reason };
  }

  const locale = session.locale ?? "fr";
  const challengeDef = getStructuredChallengeById(session.scenarioId, locale);
  if (!challengeDef) {
    return { ok: false, reason: "invalid_challenge" };
  }

  const parsedFields = parseChallengeFields(input);
  if (!parsedFields) {
    return { ok: false, reason: "invalid_fields" };
  }

  for (const field of challengeDef.fields) {
    if (!parsedFields[field.id]?.trim()) {
      return { ok: false, reason: "incomplete_fields" };
    }
  }

  const graded = gradeStructuredFields(
    challengeDef,
    parsedFields,
    getAcademyMessages(locale).gradeFeedback
  );
  if (!graded.pass) {
    return { ok: false, reason: "challenge_failed", grade: graded.result };
  }

  const consumed = await consumeAcademySession(session.sessionId, "challenge");
  if (!consumed.ok) {
    return {
      ok: false,
      reason:
        consumed.reason === "already_used"
          ? "session_already_used"
          : "cert_delivery_failed",
      grade: graded.result,
    };
  }

  const { certificate, token } = issueCertificate({
    fullName: session.fullName,
    tier: "fundamentals",
    locale,
  });

  void logCertificateIssuance(certificate);

  return { ok: true, grade: graded.result, certificate, token };
}

export function startRenewalSession(
  certToken: string,
  localeInput: AcademyLocale = "fr"
): {
  ok: true;
  challengeToken: string;
  questions: ReturnType<typeof toPublicQuestion>[];
  challenge: ReturnType<typeof toPublicStructuredChallenge>;
  updateVersion: string;
} | { ok: false; reason: string } {
  const cert = parseCertificateToken(certToken);
  if (!cert) return { ok: false, reason: "invalid_certificate" };

  const view = enrichCertificateView(cert);
  if (view.status === "active") {
    return { ok: false, reason: "not_due_yet" };
  }

  const locale = localeInput ?? "fr";
  const challengeDef = getRenewalStructuredChallenge(locale);
  const renewalQuiz = getRenewalQuiz(locale);
  const challenge: ChallengeSessionPayload = {
    kind: "challenge",
    sessionId: newSessionId(),
    fullName: cert.fullName,
    scenarioId: challengeDef.id,
    quizSessionId: `renew-${cert.id}`,
    quizScore: ACADEMY_PASS_SCORE,
    locale,
    createdAt: new Date().toISOString(),
    expiresAt: expiresInMinutes(CHALLENGE_SESSION_MINUTES),
    renewal: true,
    priorCertId: cert.id,
  };

  return {
    ok: true,
    challengeToken: encodeSignedPayload(challenge),
    questions: renewalQuiz.map(toPublicQuestion),
    challenge: toPublicStructuredChallenge(challengeDef),
    updateVersion: RENEWAL_UPDATE_VERSION,
  };
}

export async function completeRenewal(input: {
  certToken: string;
  challengeToken: string;
  answers: Record<string, string>;
  fields?: Record<string, string>;
  response?: string;
  elapsedMs: number;
}): Promise<RenewalResult> {
  const prior = parseCertificateToken(input.certToken);
  if (!prior) return { ok: false, reason: "invalid_certificate" };

  const session = decodeSignedPayload<ChallengeSessionPayload>(input.challengeToken);
  if (!session?.renewal || session.priorCertId !== prior.id) {
    return { ok: false, reason: "invalid_renewal_session" };
  }

  if (sessionExpired(session.expiresAt)) {
    return { ok: false, reason: "session_expired" };
  }

  const locale = session.locale ?? "fr";
  const renewalQuiz = getRenewalQuiz(locale);
  const renewalScore = scoreQuestions(renewalQuiz, input.answers);
  if (renewalScore < renewalQuiz.length) {
    return { ok: false, reason: "renewal_quiz_failed" };
  }

  const timingCheck = validateChallengeTiming(input.elapsedMs, session.expiresAt);
  if (!timingCheck.ok) {
    return { ok: false, reason: timingCheck.reason };
  }

  const text = input.response?.trim() ?? "";
  const parsedFields = parseChallengeFields(input) ?? (text ? { veille: text } : null);
  if (!parsedFields) {
    return { ok: false, reason: "invalid_fields" };
  }

  const challengeDef = getStructuredChallengeById(session.scenarioId, locale);
  if (!challengeDef) {
    return { ok: false, reason: "invalid_challenge" };
  }

  const graded = gradeStructuredFields(
    challengeDef,
    parsedFields,
    getAcademyMessages(locale).gradeFeedback
  );
  if (!graded.pass) {
    return { ok: false, reason: "challenge_failed", grade: graded.result };
  }

  const consumed = await consumeAcademySession(session.sessionId, "renewal");
  if (!consumed.ok) {
    return {
      ok: false,
      reason: consumed.reason === "already_used" ? "session_already_used" : "service_unavailable",
    };
  }

  const { certificate, token } = issueCertificate({
    fullName: prior.fullName,
    tier: prior.tier,
    renewalGeneration: (prior.renewalGeneration ?? 0) + 1,
    priorId: prior.id,
    locale: session.locale ?? "fr",
  });

  void logCertificateIssuance(certificate);

  return { ok: true, certificate, token };
}

export { verifyUrl, renewalUrl };
