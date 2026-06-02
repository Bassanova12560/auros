import { randomBytes } from "node:crypto";

import {
  MIN_QUESTION_MS,
  MIN_QUIZ_TOTAL_MS,
} from "@/lib/academy/constants";
import {
  decodeSignedPayload,
  encodeSignedPayload,
  expiresInMinutes,
  newSessionId,
  sessionExpired,
} from "@/lib/academy/session-token";
import { validateQuizTimings } from "@/lib/academy/anti-cheat";
import type { PublicQuizQuestion, QuizQuestion } from "@/lib/academy/types";
import type { Locale } from "@/lib/i18n";

import {
  GREEN_EXPERT_VALIDITY_DAYS,
  GREEN_PRATICIEN_PASS_SCORE,
  GREEN_PRATICIEN_QUIZ_LENGTH,
} from "./constants";
import {
  getGreenPraticienQuestion,
  pickGreenPraticienQuestions,
  scoreGreenPraticienQuiz,
  toPublicGreenQuestion,
} from "./quiz-praticien";
import { registerGreenExpert } from "./green-registry";

export type GreenPraticienSessionPayload = {
  kind: "green-praticien";
  sessionId: string;
  displayName: string;
  email: string;
  questionIds: string[];
  locale: Locale;
  createdAt: string;
  expiresAt: string;
};

export type GreenPraticienStartResult = {
  sessionToken: string;
  questions: PublicQuizQuestion[];
  expiresAt: string;
  rules: {
    minTotalMs: number;
    minQuestionMs: number;
    passScore: number;
    questionCount: number;
  };
};

export type GreenPraticienSubmitResult =
  | {
      ok: true;
      score: number;
      required: number;
      verifyToken: string;
      verifyPath: string;
      expiresAt: string;
    }
  | {
      ok: false;
      score: number;
      required: number;
      reason:
        | "invalid_session"
        | "expired"
        | "too_fast"
        | "below_pass"
        | "registration_failed";
    };

const SESSION_MINUTES = 30;

export function startGreenPraticienExam(
  displayName: string,
  email: string,
  locale: Locale = "fr"
): GreenPraticienStartResult | null {
  const name = displayName.trim();
  const mail = email.trim().toLowerCase();
  if (name.length < 2 || name.length > 120 || !mail.includes("@")) return null;

  const questions = pickGreenPraticienQuestions(locale);
  const payload: GreenPraticienSessionPayload = {
    kind: "green-praticien",
    sessionId: newSessionId(),
    displayName: name,
    email: mail,
    questionIds: questions.map((q) => q.id),
    locale,
    createdAt: new Date().toISOString(),
    expiresAt: expiresInMinutes(SESSION_MINUTES),
  };

  return {
    sessionToken: encodeSignedPayload(payload),
    questions: questions.map(toPublicGreenQuestion),
    expiresAt: payload.expiresAt,
    rules: {
      minTotalMs: MIN_QUIZ_TOTAL_MS,
      minQuestionMs: MIN_QUESTION_MS,
      passScore: GREEN_PRATICIEN_PASS_SCORE,
      questionCount: GREEN_PRATICIEN_QUIZ_LENGTH,
    },
  };
}

export async function submitGreenPraticienExam(input: {
  sessionToken: string;
  answers: Record<string, string>;
  timings: Record<string, number>;
}): Promise<GreenPraticienSubmitResult> {
  const session = decodeSignedPayload<GreenPraticienSessionPayload>(input.sessionToken);
  if (!session || session.kind !== "green-praticien") {
    return {
      ok: false,
      score: 0,
      required: GREEN_PRATICIEN_PASS_SCORE,
      reason: "invalid_session",
    };
  }

  if (sessionExpired(session.expiresAt)) {
    return {
      ok: false,
      score: 0,
      required: GREEN_PRATICIEN_PASS_SCORE,
      reason: "expired",
    };
  }

  const timingCheck = validateQuizTimings(
    session.questionIds,
    input.timings,
    session.expiresAt
  );
  if (!timingCheck.ok) {
    return {
      ok: false,
      score: 0,
      required: GREEN_PRATICIEN_PASS_SCORE,
      reason: "too_fast",
    };
  }

  const questions = session.questionIds
    .map((id) => getGreenPraticienQuestion(id, session.locale))
    .filter((q): q is QuizQuestion => q != null);

  if (questions.length !== session.questionIds.length) {
    return {
      ok: false,
      score: 0,
      required: GREEN_PRATICIEN_PASS_SCORE,
      reason: "invalid_session",
    };
  }

  const score = scoreGreenPraticienQuiz(questions, input.answers);
  if (score < GREEN_PRATICIEN_PASS_SCORE) {
    return {
      ok: false,
      score,
      required: GREEN_PRATICIEN_PASS_SCORE,
      reason: "below_pass",
    };
  }

  const verifyToken = `ag-expert-${randomBytes(6).toString("hex")}`;
  const issuedAt = new Date();
  const expiresAt = new Date(
    issuedAt.getTime() + GREEN_EXPERT_VALIDITY_DAYS * 86_400_000
  );
  const certId = `green-expert-${session.sessionId}`;

  const registered = await registerGreenExpert({
    certId,
    displayName: session.displayName,
    email: session.email,
    verifyToken,
    score,
    quizTotal: questions.length,
    issuedAt: issuedAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    locale: session.locale,
  });

  if (!registered.ok) {
    return {
      ok: false,
      score,
      required: GREEN_PRATICIEN_PASS_SCORE,
      reason: "registration_failed",
    };
  }

  return {
    ok: true,
    score,
    required: GREEN_PRATICIEN_PASS_SCORE,
    verifyToken,
    verifyPath: `/green/verify/${encodeURIComponent(verifyToken)}`,
    expiresAt: expiresAt.toISOString(),
  };
}
