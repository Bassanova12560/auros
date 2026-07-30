"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  ACADEMY_FUNDAMENTALS_ROUTE,
  ACADEMY_ROUTE,
} from "@/lib/academy";
import {
  getAcademyHubMessages,
  type ModuleProgress,
  type ResolvedModule,
  type ResolvedSchool,
} from "@/lib/academy/curriculum";

type ModuleLearnerViewProps = {
  school: ResolvedSchool;
  module: ResolvedModule;
};

export function ModuleLearnerView({ school, module }: ModuleLearnerViewProps) {
  const { locale } = useLocale();
  const m = getAcademyHubMessages(locale);
  const { isSignedIn, isLoaded } = useAuth();
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{
    passed: boolean;
    score: number;
    passScore: number;
    total: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = useCallback(async () => {
    if (!isSignedIn) {
      setProgress(null);
      return;
    }
    try {
      const res = await fetch("/api/academy/progress");
      if (!res.ok) return;
      const data = (await res.json()) as {
        progress?: { modules?: ModuleProgress[] };
      };
      const row =
        data.progress?.modules?.find(
          (row) => row.schoolId === school.id && row.moduleId === module.id
        ) ?? null;
      setProgress(row);
      if (row?.quizPassed) {
        setQuizResult({
          passed: true,
          score: row.quizScore ?? module.quiz.passScore,
          passScore: module.quiz.passScore,
          total: module.quiz.questions.length,
        });
      }
    } catch {
      /* ignore */
    }
  }, [isSignedIn, school.id, module.id, module.quiz.passScore, module.quiz.questions.length]);

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  const completed = useMemo(
    () => new Set(progress?.lessonsCompleted ?? []),
    [progress]
  );
  const allLessonsRead = module.lessons.every((l) => completed.has(l.id));
  const quizUnlocked = Boolean(isSignedIn) && allLessonsRead;

  async function markLesson(lessonId: string) {
    setError(null);
    if (!isSignedIn) {
      setError(m.progressSignedOut);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/academy/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete_lesson",
          schoolId: school.id,
          moduleSlug: module.slug,
          lessonId,
        }),
      });
      const data = (await res.json()) as { module?: ModuleProgress; error?: string };
      if (!res.ok) {
        setError(data.error === "unauthorized" ? m.progressSignedOut : m.saveFailed);
        return;
      }
      if (data.module) setProgress(data.module);
    } catch {
      setError(m.networkError);
    } finally {
      setBusy(false);
    }
  }

  async function submitQuiz() {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/academy/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submit_quiz",
          schoolId: school.id,
          moduleSlug: module.slug,
          answers,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        passed?: boolean;
        score?: number;
        passScore?: number;
        total?: number;
        module?: ModuleProgress;
        error?: string;
      };
      if (!res.ok) {
        setError(
          data.error === "lessons_incomplete"
            ? m.quizUnlockHint
            : data.error === "unauthorized"
              ? m.progressSignedOut
              : m.saveFailed
        );
        return;
      }
      if (data.module) setProgress(data.module);
      setQuizResult({
        passed: Boolean(data.passed),
        score: data.score ?? 0,
        passScore: data.passScore ?? module.quiz.passScore,
        total: data.total ?? module.quiz.questions.length,
      });
    } catch {
      setError(m.networkError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
        {school.shortName} · {m.levelLabel(module.level)}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white md:text-4xl">
        {module.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/55">{module.summary}</p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-white/35">
        {m.moduleMinutes(module.estimatedMinutes)} · {m.lessonsCount(module.lessons.length)}
      </p>

      {isLoaded && !isSignedIn && (
        <BezelCard className="mt-8" innerClassName="p-5 md:p-6">
          <p className="text-sm text-white/55">{m.progressSignedOut}</p>
          <p className="mt-4">
            <Link
              href="/sign-in"
              className="font-mono text-[11px] tracking-wide text-emerald-300/80 hover:text-emerald-200"
            >
              {m.progressSignIn} →
            </Link>
          </p>
        </BezelCard>
      )}

      <div className="mt-10 space-y-8">
        {module.lessons.map((lesson, index) => {
          const done = completed.has(lesson.id);
          return (
            <BezelCard key={lesson.id} innerClassName="p-6 md:p-8" animate>
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {index + 1} / {module.lessons.length}
              </p>
              <h2 className="mt-2 font-display text-xl font-semibold text-white">
                {lesson.title}
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/60 whitespace-pre-line">
                {lesson.body}
              </div>
              <ul className="mt-6 space-y-2 border-t border-white/[0.06] pt-5">
                {lesson.keyTakeaways.map((item) => (
                  <li key={item} className="text-sm text-white/50">
                    — {item}
                  </li>
                ))}
              </ul>
              {lesson.labLinks.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {lesson.labLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="font-mono text-[10px] uppercase tracking-wider text-white/40 hover:text-white/70"
                    >
                      {link.label} →
                    </Link>
                  ))}
                </div>
              )}
              <div className="mt-6">
                {done ? (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400/70">
                    {m.lessonDone}
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={busy || !isSignedIn}
                    onClick={() => void markLesson(lesson.id)}
                    className="font-mono text-[11px] tracking-wide text-white/50 transition hover:text-white/80 disabled:opacity-40"
                  >
                    {m.lessonMarkDone} →
                  </button>
                )}
              </div>
            </BezelCard>
          );
        })}
      </div>

      <BezelCard className="mt-10" innerClassName="p-6 md:p-8">
        <h2 className="font-display text-xl font-semibold text-white">{m.quizTitle}</h2>
        {!quizUnlocked ? (
          <p className="mt-3 text-sm text-white/45">{m.quizUnlockHint}</p>
        ) : quizResult?.passed ? (
          <p className="mt-3 text-sm text-emerald-300/80">
            {m.quizPass(quizResult.score, quizResult.total)}
          </p>
        ) : (
          <>
            <div className="mt-6 space-y-8">
              {module.quiz.questions.map((q, qi) => (
                <fieldset key={q.id}>
                  <legend className="text-sm font-medium text-white/80">
                    {qi + 1}. {q.prompt}
                  </legend>
                  <div className="mt-3 space-y-2">
                    {q.options.map((opt) => (
                      <label
                        key={opt.id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white/60 hover:border-white/15"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={opt.id}
                          checked={answers[q.id] === opt.id}
                          onChange={() =>
                            setAnswers((prev) => ({ ...prev, [q.id]: opt.id }))
                          }
                          className="mt-1"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
            {quizResult && !quizResult.passed && (
              <p className="mt-4 text-sm text-amber-200/70">
                {m.quizFail(quizResult.score, quizResult.passScore, quizResult.total)}
              </p>
            )}
            <div className="mt-6">
              <button
                type="button"
                disabled={
                  busy ||
                  module.quiz.questions.some((q) => !answers[q.id])
                }
                onClick={() => void submitQuiz()}
                className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2.5 font-mono text-[11px] tracking-wide text-emerald-200 transition hover:bg-emerald-400/20 disabled:opacity-40"
              >
                {busy ? m.quizSubmitting : quizResult ? m.quizRetry : m.quizSubmit}
              </button>
            </div>
          </>
        )}
        {error && <p className="mt-4 text-sm text-amber-200/80">{error}</p>}
      </BezelCard>

      <BezelCard className="mt-10" innerClassName="p-6 md:p-8">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
          {m.softCtaTitle}
        </h2>
        <p className="mt-3 text-sm text-white/55">{m.certPathBody}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <PrimaryButton href={ACADEMY_FUNDAMENTALS_ROUTE}>{m.certPathCta}</PrimaryButton>
          <Link
            href="/start"
            className="font-mono text-[11px] tracking-wide text-white/40 hover:text-white/70"
          >
            /start →
          </Link>
          <Link
            href="/lab"
            className="font-mono text-[11px] tracking-wide text-white/40 hover:text-white/70"
          >
            /lab →
          </Link>
        </div>
        <p className="mt-6 text-xs text-white/35">{m.diplomaNote}</p>
        <p className="mt-2 text-xs text-white/30">{m.nftDeferred}</p>
      </BezelCard>

      <p className="mt-8">
        <Link
          href={`/academy/${school.slug}`}
          className="font-mono text-[11px] text-white/40 hover:text-white/70"
        >
          {m.backSchool}
        </Link>
        {" · "}
        <Link href={ACADEMY_ROUTE} className="font-mono text-[11px] text-white/40 hover:text-white/70">
          {m.backHub}
        </Link>
      </p>
      <p className="mt-6 max-w-2xl text-xs leading-relaxed text-white/30">
        {m.educationalDisclaimer}
      </p>
    </div>
  );
}
