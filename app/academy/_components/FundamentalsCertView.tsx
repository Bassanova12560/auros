"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { AcademyReminderOptIn } from "./AcademyReminderOptIn";
import { AcademyDiplomaUpsell } from "./AcademyDiplomaUpsell";
import {
  ACADEMY_PASS_SCORE,
  ACADEMY_QUIZ_LENGTH,
  ACADEMY_ROUTE,
  CERT_VALIDITY_DAYS,
  MIN_CHALLENGE_MS,
  verifyUrl,
  type ChallengeGradeResult,
  type PublicQuizQuestion,
  type QuizStartResult,
  type QuizSubmitResult,
} from "@/lib/academy";
import { formatCertDate, getAcademyMessages } from "@/lib/academy/i18n";

type Phase = "intro" | "quiz" | "challenge" | "result";

export function FundamentalsCertView() {
  const { locale } = useLocale();
  const m = getAcademyMessages(locale);
  const f = m.fundamentals;

  const [phase, setPhase] = useState<Phase>("intro");
  const [fullName, setFullName] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PublicQuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timings, setTimings] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [pendingOption, setPendingOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  type StructuredFieldView = {
    id: string;
    label: string;
    prompt: string;
    hint: string;
    minWords: number;
    maxWords: number;
  };
  type StructuredChallengeView = {
    id: string;
    title: string;
    intro: string;
    fields: StructuredFieldView[];
  };

  const [structuredChallenge, setStructuredChallenge] = useState<StructuredChallengeView | null>(
    null
  );
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [gradeFeedback, setGradeFeedback] = useState<string | null>(null);
  const challengeStartedAt = useRef<number>(0);
  const questionStartedAt = useRef<number>(0);

  const [success, setSuccess] = useState<Extract<ChallengeGradeResult, { ok: true }> | null>(null);
  const [failReason, setFailReason] = useState<string | null>(null);

  const question = questions[step];

  const reasonMessage = useCallback(
    (reason: string) => m.reasons[reason] ?? m.errors.genericFail(reason),
    [m]
  );

  const resetAll = useCallback(() => {
    setPhase("intro");
    setSessionToken(null);
    setQuestions([]);
    setAnswers({});
    setTimings({});
    setStep(0);
    setPendingOption(null);
    setChallengeToken(null);
    setStructuredChallenge(null);
    setFieldValues({});
    setQuizScore(null);
    setGradeFeedback(null);
    setSuccess(null);
    setFailReason(null);
    setError(null);
  }, []);

  async function startQuiz() {
    if (fullName.trim().length < 2) {
      setError(m.errors.nameMin);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, locale }),
      });
      const data = (await res.json()) as QuizStartResult | { error?: string };
      if (!res.ok || !("sessionToken" in data)) {
        setError(m.errors.sessionStart);
        return;
      }
      setSessionToken(data.sessionToken);
      setQuestions(data.questions);
      setPhase("quiz");
      setStep(0);
      setAnswers({});
      setTimings({});
      setPendingOption(null);
      questionStartedAt.current = Date.now();
    } catch {
      setError(m.errors.network);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (phase === "quiz" && question) {
      questionStartedAt.current = Date.now();
      setPendingOption(null);
    }
  }, [phase, step, question?.id]);

  function selectOption(optionId: string) {
    if (!question || loading) return;
    setPendingOption(optionId);
  }

  async function confirmAnswer() {
    if (!question || !sessionToken || !pendingOption) return;

    const elapsed = Math.max(Date.now() - questionStartedAt.current, 0);
    const nextTimings = { ...timings, [question.id]: elapsed };
    const nextAnswers = { ...answers, [question.id]: pendingOption };

    if (step < questions.length - 1) {
      setTimings(nextTimings);
      setAnswers(nextAnswers);
      setPendingOption(null);
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/academy/session/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken,
          answers: nextAnswers,
          timings: nextTimings,
        }),
      });
      const data = (await res.json()) as QuizSubmitResult;
      if (data.ok) {
        setTimings(nextTimings);
        setAnswers(nextAnswers);
        setQuizScore(data.score);
        setChallengeToken(data.challengeToken);
        setStructuredChallenge(data.challenge);
        setFieldValues(Object.fromEntries(data.challenge.fields.map((fld) => [fld.id, ""])));
        challengeStartedAt.current = Date.now();
        setPhase("challenge");
      } else {
        setFailReason(data.reason);
        setQuizScore(data.score ?? null);
        setPhase("result");
      }
    } catch {
      setError(m.errors.network);
    } finally {
      setLoading(false);
    }
  }

  async function submitChallenge() {
    if (!challengeToken || !structuredChallenge) return;
    const allFilled = structuredChallenge.fields.every((fld) => fieldValues[fld.id]?.trim());
    if (!allFilled) {
      setError(m.errors.completeChallenge);
      return;
    }
    setLoading(true);
    setError(null);
    setGradeFeedback(null);
    try {
      const elapsedMs = Date.now() - challengeStartedAt.current;
      const res = await fetch("/api/academy/challenge/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ challengeToken, fields: fieldValues, elapsedMs }),
      });
      const data = (await res.json()) as ChallengeGradeResult;
      if (data.ok) {
        setSuccess(data);
        setPhase("result");
      } else if (data.reason === "challenge_failed" || data.reason === "cert_delivery_failed") {
        setFailReason(data.reason);
        setGradeFeedback(data.grade?.feedback ?? null);
        setError(data.grade?.feedback ?? reasonMessage(data.reason));
        setPhase("challenge");
      } else {
        setFailReason(data.reason);
        setGradeFeedback(data.grade?.feedback ?? null);
        setPhase("result");
      }
    } catch {
      setError(m.errors.network);
    } finally {
      setLoading(false);
    }
  }

  if (phase === "intro") {
    return (
      <BezelCard innerClassName="p-6 md:p-10" animate>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {f.introEyebrow}
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-white md:text-4xl">
          {f.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/55">
          {f.intro(ACADEMY_QUIZ_LENGTH, ACADEMY_PASS_SCORE, CERT_VALIDITY_DAYS)}
        </p>
        <ul className="mt-6 space-y-2 text-sm text-white/45">
          {f.bullets.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
        <label className="mt-8 block max-w-md">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {f.nameLabel}
          </span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-white/25"
            placeholder={f.namePlaceholder}
            autoComplete="name"
          />
        </label>
        {error && (
          <p className="mt-4 text-sm text-white/70" role="alert">
            {error}
          </p>
        )}
        <div className="mt-8">
          <PrimaryButton type="button" onClick={() => void startQuiz()} disabled={loading}>
            {loading ? f.preparing : f.start}
          </PrimaryButton>
        </div>
        <p className="mt-8 text-xs leading-relaxed text-white/35">{m.disclaimer}</p>
      </BezelCard>
    );
  }

  if (phase === "quiz" && question) {
    const progress = Math.round(((step + 1) / questions.length) * 100);

    return (
      <BezelCard innerClassName="p-6 md:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            {f.question(step + 1, questions.length)}
          </p>
          <p className="font-mono text-[10px] text-white/50">{progress}%</p>
        </div>
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full bg-white/40 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-xs text-white/35">{f.readHint}</p>
        <h2 className="mt-6 font-display text-xl font-medium text-white md:text-2xl">
          {question.prompt}
        </h2>
        <ul className="mt-8 space-y-3">
          {question.options.map((opt) => {
            const selected = pendingOption === opt.id;
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => selectOption(opt.id)}
                  className={`w-full rounded-xl border px-4 py-4 text-left text-sm transition disabled:opacity-50 ${
                    selected
                      ? "border-white/30 bg-white/[0.06] text-white"
                      : "border-white/[0.08] bg-white/[0.02] text-white/75 hover:border-white/20 hover:bg-white/[0.04]"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
        {pendingOption && (
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <PrimaryButton type="button" disabled={loading} onClick={() => void confirmAnswer()}>
              {step < questions.length - 1 ? f.nextQuestion : f.validateQuiz}
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setPendingOption(null)}
              className="text-sm text-white/45 hover:text-white/70"
            >
              {f.changeAnswer}
            </button>
          </div>
        )}
        {loading && <p className="mt-6 text-sm text-white/45">{f.validatingQuiz}</p>}
        {error && (
          <p className="mt-4 text-sm text-white/70" role="alert">
            {error}
          </p>
        )}
      </BezelCard>
    );
  }

  if (phase === "challenge" && structuredChallenge) {
    const allFilled = structuredChallenge.fields.every((fld) => fieldValues[fld.id]?.trim());
    return (
      <BezelCard innerClassName="p-6 md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {f.challengeEyebrow(quizScore ?? 0, ACADEMY_QUIZ_LENGTH)}
        </p>
        <h2 className="mt-4 font-display text-2xl font-semibold text-white">
          {structuredChallenge.title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/55">{structuredChallenge.intro}</p>
        <p className="mt-4 text-xs text-white/40">
          {f.minTimeHint(Math.ceil(MIN_CHALLENGE_MS / 1000))}
        </p>
        {error && (
          <p
            className="mt-4 rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-white/75"
            role="alert"
          >
            {error}
          </p>
        )}
        <div className="mt-8 space-y-8">
          {structuredChallenge.fields.map((field, index) => (
            <div key={field.id}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {f.pointLabel(index + 1, field.label)}
              </p>
              <p className="mt-2 text-sm font-medium text-white/75">{field.prompt}</p>
              <p className="mt-2 text-xs text-white/40">{field.hint}</p>
              <p className="mt-1 text-xs text-white/35">{f.minWordsHint(field.minWords)}</p>
              <textarea
                value={fieldValues[field.id] ?? ""}
                onChange={(e) =>
                  setFieldValues((prev) => ({ ...prev, [field.id]: e.target.value }))
                }
                rows={4}
                className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-white outline-none focus:border-white/25"
                placeholder={f.challengePlaceholder}
              />
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton
            type="button"
            disabled={loading || !allFilled}
            onClick={() => void submitChallenge()}
          >
            {loading ? f.validatingChallenge : f.submitChallenge}
          </PrimaryButton>
        </div>
      </BezelCard>
    );
  }

  if (phase === "result" && success) {
    const url = verifyUrl(success.token);
    const expiry = formatCertDate(locale, success.certificate.expiresAt);
    return (
      <BezelCard innerClassName="p-6 md:p-10" animate>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {f.certifiedEyebrow(success.certificate.integrityLevel)}
        </p>
        <h2 className="mt-4 font-display text-3xl font-semibold text-white">
          {f.congrats(success.certificate.fullName)}
        </h2>
        <p className="mt-4 text-sm text-white/55">
          {success.certificate.tierLabel} — AUROS Academy
        </p>
        <p className="mt-2 font-mono text-xs text-white/40">
          {success.certificate.id} · {f.validUntil(expiry)}
        </p>
        <p className="mt-4 text-xs text-white/45">{success.grade.feedback}</p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/50">{f.deliverable}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton href={url}>{f.verifyPage}</PrimaryButton>
          <Link
            href={ACADEMY_ROUTE}
            className="inline-flex items-center rounded-full border border-white/15 px-6 py-3 text-sm text-white/70 hover:border-white/30"
          >
            {f.backAcademy}
          </Link>
        </div>
        <p className="mt-6 break-all text-xs text-white/35">{url}</p>
        <AcademyDiplomaUpsell certToken={success.token} />
        <AcademyReminderOptIn certToken={success.token} />
        <p className="mt-8 text-xs text-white/35">{m.disclaimer}</p>
      </BezelCard>
    );
  }

  if (phase === "result" && failReason) {
    const isTiming =
      failReason === "answer_too_fast" ||
      failReason === "quiz_completed_too_fast" ||
      failReason === "challenge_too_fast";
    const isChallengeContent =
      failReason === "challenge_failed" || failReason === "cert_delivery_failed";
    return (
      <BezelCard innerClassName="p-6 md:p-10">
        <h2 className="font-display text-2xl font-semibold text-white">
          {isTiming ? f.failTiming : isChallengeContent ? f.failChallenge : f.failGeneric}
        </h2>
        <p className="mt-4 text-sm text-white/55">{reasonMessage(failReason)}</p>
        {gradeFeedback && <p className="mt-2 text-sm text-white/45">{gradeFeedback}</p>}
        {quizScore !== null && (
          <p className="mt-2 text-sm text-white/45">{f.quizScore(quizScore, ACADEMY_QUIZ_LENGTH)}</p>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <PrimaryButton type="button" onClick={resetAll}>
            {f.retry}
          </PrimaryButton>
        </div>
      </BezelCard>
    );
  }

  return null;
}
