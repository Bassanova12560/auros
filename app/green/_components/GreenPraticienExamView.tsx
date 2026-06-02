"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_PRATICIEN_PASS_SCORE,
  GREEN_PRATICIEN_QUIZ_LENGTH,
  GREEN_PRATICIEN_ROUTE,
  getGreenMessages,
} from "@/lib/green";
import type { PublicQuizQuestion } from "@/lib/academy/types";

import { GreenPanel, GreenPageHeader, greenBtnClass } from "./green-ui";

type Phase = "intro" | "quiz" | "result";

export function GreenPraticienExamView() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const e = m.exam;

  const [phase, setPhase] = useState<Phase>("intro");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [questions, setQuestions] = useState<PublicQuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timings, setTimings] = useState<Record<string, number>>({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{
    score: number;
    verifyPath: string;
    expiresAt: string;
  } | null>(null);
  const [failReason, setFailReason] = useState<string | null>(null);

  const questionStartedAt = useRef(Date.now());
  const question = questions[step];

  const recordTiming = useCallback(
    (questionId: string) => {
      const elapsed = Date.now() - questionStartedAt.current;
      setTimings((prev) => ({ ...prev, [questionId]: elapsed }));
      questionStartedAt.current = Date.now();
    },
    []
  );

  async function startExam() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/green/praticien/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ displayName, email, locale }),
    });
    setLoading(false);
    const data = await res.json();
    if (!res.ok) {
      setError(e.errors.startFailed);
      return;
    }
    setSessionToken(data.sessionToken);
    setQuestions(data.questions);
    setPhase("quiz");
    questionStartedAt.current = Date.now();
  }

  async function submitExam(finalAnswers: Record<string, string>) {
    if (!sessionToken) return;
    setLoading(true);
    setError(null);
    const res = await fetch("/api/green/praticien/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionToken,
        answers: finalAnswers,
        timings,
      }),
    });
    setLoading(false);
    const data = await res.json();
    setPhase("result");
    if (data.ok) {
      setSuccess({
        score: data.score,
        verifyPath: data.verifyPath,
        expiresAt: data.expiresAt,
      });
      return;
    }
    const reason = data.reason as string;
    if (reason === "below_pass") {
      setFailReason(e.failBelowPass(data.score, data.required));
    } else if (reason === "too_fast") {
      setFailReason(e.failTooFast);
    } else {
      setFailReason(e.failGeneric);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-emerald-500 bg-black px-4 py-3 text-sm text-emerald-400 outline-none focus:border-emerald-400";

  if (phase === "intro") {
    return (
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <GreenPageHeader eyebrow={e.eyebrow} title={e.title} intro={e.intro(GREEN_PRATICIEN_QUIZ_LENGTH, GREEN_PRATICIEN_PASS_SCORE)} compact />
        <GreenPanel className="mt-10">
          <div className="p-6 md:p-8">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">{e.displayName}</span>
            <input
              value={displayName}
              onChange={(ev) => setDisplayName(ev.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
          <label className="mt-4 block">
            <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">{e.email}</span>
            <input
              type="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className={`${inputClass} mt-2`}
            />
          </label>
          {error ? <p className="mt-4 text-sm text-red-400/80">{error}</p> : null}
          <button
            type="button"
            disabled={loading}
            onClick={startExam}
            className="mt-8 inline-flex rounded-lg border border-emerald-500 bg-emerald-500 px-6 py-3 text-sm font-medium text-black hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? e.starting : e.start}
          </button>
          </div>
        </GreenPanel>
        <Link href={GREEN_PRATICIEN_ROUTE} className="mt-8 inline-block font-mono text-[11px] uppercase tracking-wider text-emerald-500 hover:text-emerald-400">
          {e.backLink}
        </Link>
      </div>
    );
  }

  if (phase === "quiz" && question) {
    const selected = answers[question.id];
    return (
      <div className="page-inner page-inner--2xl mx-auto px-4 pb-16 pt-10 md:px-6">
        <p className="font-mono text-[10px] uppercase text-emerald-500">
          {e.question(step + 1, questions.length)}
        </p>
        <h2 className="mt-4 font-display text-xl text-emerald-400">{question.prompt}</h2>
        <div className="mt-8 space-y-2">
          {question.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: opt.id }))}
              className={`block w-full rounded-lg border px-4 py-3 text-left text-sm ${
                selected === opt.id
                  ? "border-emerald-400 bg-black text-emerald-400"
                  : "border-emerald-500/40 text-neutral-400 hover:border-emerald-500"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="mt-10">
          <button
            type="button"
            disabled={!selected || loading}
            onClick={() => {
              recordTiming(question.id);
              const nextAnswers = { ...answers, [question.id]: selected! };
              if (step + 1 < questions.length) {
                setAnswers(nextAnswers);
                setStep((s) => s + 1);
              } else {
                void submitExam(nextAnswers);
              }
            }}
            className="rounded-lg border border-emerald-500 bg-emerald-500 px-6 py-3 text-sm font-medium text-black disabled:opacity-50"
          >
            {step + 1 < questions.length ? e.next : e.submit}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-16 pt-10 md:px-6">
      {success ? (
        <GreenPanel>
          <div className="p-8 text-center">
          <p className="text-lg text-emerald-400">{e.successTitle(displayName)}</p>
          <p className="mt-2 text-sm text-neutral-400">
            {e.successScore(success.score, GREEN_PRATICIEN_QUIZ_LENGTH)}
          </p>
          <PrimaryButton href={success.verifyPath} className={`mt-8 ${greenBtnClass}`}>
            {e.verifyCta}
          </PrimaryButton>
          <p className="mt-4 text-xs text-neutral-500">{e.validUntil(success.expiresAt)}</p>
          </div>
        </GreenPanel>
      ) : (
        <GreenPanel>
          <div className="p-8 text-center">
          <p className="text-lg text-emerald-400">{e.failTitle}</p>
          <p className="mt-2 text-sm text-neutral-400">{failReason}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-8 rounded-lg border border-emerald-500 px-6 py-3 text-sm text-emerald-500 hover:text-emerald-400"
          >
            {e.retry}
          </button>
          </div>
        </GreenPanel>
      )}
      <p className="mt-8 text-xs text-neutral-600">{m.disclaimer}</p>
    </div>
  );
}
