import type { AcademyTierId } from "./constants";
import type { AcademyLocale } from "./i18n";

export type CertificateStatus = "active" | "expired" | "renewal_due";

export type IntegrityLevel = 2;

export type AcademyCertificate = {
  id: string;
  fullName: string;
  tier: AcademyTierId;
  tierLabel: string;
  issuedAt: string;
  /** ISO — attestation valid until this date (90-day cycle). */
  expiresAt: string;
  curriculumVersion: string;
  renewalGeneration: number;
  integrityLevel: IntegrityLevel;
};

export type QuizOption = {
  id: string;
  label: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
};

export type PublicQuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export type AcademyScenario = {
  id: string;
  title: string;
  caseText: string;
  taskText: string;
  minWords: number;
  maxWords: number;
  requiredConcepts: string[];
  rubric: string[];
};

export type QuizSessionPayload = {
  kind: "quiz";
  sessionId: string;
  fullName: string;
  questionIds: string[];
  locale: AcademyLocale;
  createdAt: string;
  expiresAt: string;
};

export type ChallengeSessionPayload = {
  kind: "challenge";
  sessionId: string;
  fullName: string;
  scenarioId: string;
  quizSessionId: string;
  quizScore: number;
  locale: AcademyLocale;
  createdAt: string;
  expiresAt: string;
  renewal?: boolean;
  priorCertId?: string;
};

export type QuizSubmission = {
  fullName: string;
  answers: Record<string, string>;
};

export type QuestionTimings = Record<string, number>;

export type AiGradeResult = {
  pass: boolean;
  score: number;
  dimensions: {
    accuracy: number;
    specificity: number;
    compliance: number;
    antiGeneric: number;
  };
  feedback: string;
  provider: "gemini" | "groq" | "template";
  flags: string[];
};

export type CertifyResult =
  | {
      ok: true;
      score: number;
      certificate: AcademyCertificate;
      token: string;
    }
  | { ok: false; score: number; required: number; total: number };

export type QuizStartResult = {
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

export type QuizSubmitResult =
  | {
      ok: true;
      score: number;
      challengeToken: string;
      challenge: {
        id: string;
        title: string;
        intro: string;
        fields: {
          id: string;
          label: string;
          prompt: string;
          hint: string;
          minWords: number;
          maxWords: number;
        }[];
      };
    }
  | { ok: false; reason: string; score?: number };

export type ChallengeGradeResult =
  | { ok: true; grade: AiGradeResult; certificate: AcademyCertificate; token: string }
  | { ok: false; reason: string; grade?: AiGradeResult };

export type RenewalResult =
  | { ok: true; certificate: AcademyCertificate; token: string }
  | { ok: false; reason: string; grade?: AiGradeResult };
