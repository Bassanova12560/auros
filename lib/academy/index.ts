import {
  ACADEMY_PASS_SCORE,
  ACADEMY_QUIZ_LENGTH,
} from "./constants";
import { issueCertificate } from "./issue-certificate";
import {
  FUNDAMENTALS_QUIZ,
  scoreQuiz,
  quizQuestionIds,
} from "./quiz-fundamentals";
import type { CertifyResult, QuizSubmission } from "./types";

export type { AcademyLocale, AcademyMessages } from "./i18n";
export type { AcademyTier, AcademyTierId, AcademyTierStatus } from "./constants";
export { getAcademyMessages, formatCertDate, academyQuizIntro, diplomaCheckoutErrorMessage } from "./i18n";
export {
  ACADEMY_DISCLAIMER,
  ACADEMY_ENTREPRISE_ROUTE,
  ACADEMY_FUNDAMENTALS_ROUTE,
  ACADEMY_PASS_SCORE,
  ACADEMY_PRATICIEN_ROUTE,
  ACADEMY_QUIZ_LENGTH,
  ACADEMY_RENEW_ROUTE,
  ACADEMY_REGISTRY_ROUTE,
  ACADEMY_ROUTE,
  ACADEMY_TIERS,
  ACADEMY_VERIFY_ROUTE,
  CERT_VALIDITY_DAYS,
  CURRICULUM_VERSION,
  INTEGRITY_LEVEL,
  MIN_CHALLENGE_MS,
  MIN_QUESTION_MS,
  MIN_QUIZ_TOTAL_MS,
} from "./constants";
export { FUNDAMENTALS_QUIZ, scoreQuiz } from "./quiz-fundamentals";
export {
  createCertificateToken,
  enrichCertificateView,
  formatIssuedDate,
  parseCertificateToken,
  tierLabel,
} from "./cert-token";
export { statusLabel, getCertificateStatus } from "./certificate-status";
export {
  startQuizSession,
  submitQuizSession,
  gradeChallenge,
  startRenewalSession,
  completeRenewal,
} from "./integrity-flow";
export { verifyUrl, renewalUrl } from "./issue-certificate";
export type {
  AcademyCertificate,
  AiGradeResult,
  CertifyResult,
  ChallengeGradeResult,
  PublicQuizQuestion,
  QuizQuestion,
  QuizStartResult,
  QuizSubmission,
  QuizSubmitResult,
  RenewalResult,
} from "./types";

/** @deprecated Use session/challenge API — kept for legacy clients */
export function certifyFundamentals(
  submission: QuizSubmission
): CertifyResult {
  const fullName = submission.fullName.trim();
  if (fullName.length < 2 || fullName.length > 120) {
    return {
      ok: false,
      score: 0,
      required: ACADEMY_PASS_SCORE,
      total: ACADEMY_QUIZ_LENGTH,
    };
  }

  const expectedIds = new Set(quizQuestionIds(FUNDAMENTALS_QUIZ));
  for (const key of Object.keys(submission.answers)) {
    if (!expectedIds.has(key)) {
      return {
        ok: false,
        score: 0,
        required: ACADEMY_PASS_SCORE,
        total: ACADEMY_QUIZ_LENGTH,
      };
    }
  }

  if (Object.keys(submission.answers).length !== FUNDAMENTALS_QUIZ.length) {
    return {
      ok: false,
      score: scoreQuiz(FUNDAMENTALS_QUIZ, submission.answers),
      required: ACADEMY_PASS_SCORE,
      total: ACADEMY_QUIZ_LENGTH,
    };
  }

  const score = scoreQuiz(FUNDAMENTALS_QUIZ, submission.answers);
  if (score < ACADEMY_PASS_SCORE) {
    return {
      ok: false,
      score,
      required: ACADEMY_PASS_SCORE,
      total: ACADEMY_QUIZ_LENGTH,
    };
  }

  const { certificate, token } = issueCertificate({
    fullName,
    tier: "fundamentals",
  });

  return { ok: true, score, certificate, token };
}
