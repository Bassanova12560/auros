"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { ScoreReveal } from "@/app/_components/ScoreReveal";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { MICA_CHECKER_FAQ } from "@/lib/mica-checker/faq";
import { getMicaCheckerCopy } from "@/lib/mica-checker/i18n";
import { computeMicaReadiness } from "@/lib/mica-checker/scoring";
import type { MicaAnswers, MicaQuestionId } from "@/lib/mica-checker/types";

const EMPTY_ANSWERS: MicaAnswers = {
  issuerType: null,
  assetClass: null,
  euNexus: null,
  whitepaper: null,
  investorType: null,
};

const QUESTION_ORDER: MicaQuestionId[] = [
  "issuerType",
  "assetClass",
  "euNexus",
  "whitepaper",
  "investorType",
];

export function MicaCheckerView() {
  const { locale } = useLocale();
  const copy = getMicaCheckerCopy(locale);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<MicaAnswers>(EMPTY_ANSWERS);
  const [showScore, setShowScore] = useState(false);

  const totalQuestions = QUESTION_ORDER.length;
  const onResult = step >= totalQuestions;
  const currentQuestionId = !onResult ? QUESTION_ORDER[step] : null;
  const currentQuestion = currentQuestionId
    ? copy.questions.find((q) => q.id === currentQuestionId)
    : null;
  const currentValue = currentQuestionId ? answers[currentQuestionId] : null;

  const result = useMemo(
    () => (onResult ? computeMicaReadiness(answers) : null),
    [answers, onResult]
  );

  const tierLabel =
    result?.tier === "solid"
      ? copy.tierSolid
      : result?.tier === "progress"
        ? copy.tierProgress
        : copy.tierEarly;

  const yieldCalculatorLink = copy.relatedLinks.find(
    (link) => link.href === "/tools/yield-calculator"
  );

  const selectOption = useCallback(
    (questionId: MicaQuestionId, value: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
    },
    []
  );

  const goNext = () => {
    if (!currentQuestionId || !currentValue) return;
    if (step + 1 >= totalQuestions) {
      setShowScore(true);
      track("mica_checker_complete", { locale });
    }
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (onResult) {
      setShowScore(false);
      setStep(totalQuestions - 1);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const restart = () => {
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
    setShowScore(false);
  };

  return (
    <div className="space-y-16 md:space-y-20">
      <StaticSectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.intro}
      />
      <p className="mx-auto -mt-8 max-w-2xl text-center font-mono text-[11px] leading-relaxed text-white/40">
        {copy.disclaimer}
      </p>

      <section
        className="mx-auto max-w-2xl"
        aria-live="polite"
        aria-label={onResult ? copy.resultTitle : copy.progress(step + 1, totalQuestions)}
      >
        {!onResult && currentQuestion ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
              <span>{copy.progress(step + 1, totalQuestions)}</span>
              <span>{copy.timeHint}</span>
            </div>
            <h2 className="mt-5 font-display text-xl font-semibold text-white md:text-2xl">
              {currentQuestion.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/55">
              {currentQuestion.hint}
            </p>

            <ul className="mt-6 space-y-3" role="listbox" aria-label={currentQuestion.title}>
              {currentQuestion.options.map((option) => {
                const selected = currentValue === option.value;
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onClick={() =>
                        selectOption(currentQuestionId!, option.value)
                      }
                      className={`interactive-subtle w-full rounded-xl border px-4 py-4 text-left transition ${
                        selected
                          ? "border-white/25 bg-white/[0.06]"
                          : "border-white/[0.08] bg-white/[0.02] hover:border-white/15"
                      }`}
                    >
                      <span className="font-display text-sm font-medium text-white">
                        {option.label}
                      </span>
                      {option.detail ? (
                        <span className="mt-1 block text-xs leading-relaxed text-white/45">
                          {option.detail}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={goBack}
                  className="font-mono text-xs text-white/45 underline-offset-2 hover:text-white/65 hover:underline"
                >
                  {copy.back}
                </button>
              ) : null}
              <PrimaryButton
                type="button"
                disabled={!currentValue}
                onClick={goNext}
                className="ml-auto"
              >
                {step + 1 >= totalQuestions ? copy.seeResult : copy.next}
              </PrimaryButton>
            </div>
          </div>
        ) : null}

        {onResult && result ? (
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 text-center md:p-10">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
              {copy.resultTitle}
            </p>
            <div className="mt-6 flex flex-col items-center">
              <ScoreReveal score={result.score} show={showScore} compact instant />
              <p className="mt-2 font-mono text-[11px] text-white/40">{copy.scoreLabel}</p>
            </div>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/60">
              {tierLabel}
            </p>

            <div className="mx-auto mt-8 max-w-md text-left">
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                {copy.priorities}
              </p>
              <ul className="mt-3 space-y-2">
                {result.recommendations.map((rec) => (
                  <li
                    key={rec.id}
                    className="flex gap-2 text-sm text-white/70 before:shrink-0 before:content-['·']"
                  >
                    {copy.recommendations[rec.id] ?? rec.label}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <PrimaryButton
                href="/wizard?phase=conformite"
                onClick={() =>
                  track("mica_checker_cta", { target: "wizard", score: result.score })
                }
              >
                {copy.wizardCta}
              </PrimaryButton>
              {yieldCalculatorLink ? (
                <Link
                  href={yieldCalculatorLink.href}
                  onClick={() =>
                    track("mica_checker_cta", {
                      target: "yield_calculator",
                      score: result.score,
                    })
                  }
                  className="font-mono text-xs text-white/50 underline-offset-2 hover:text-white/75 hover:underline"
                >
                  {yieldCalculatorLink.label}
                </Link>
              ) : null}
              <Link
                href="/estimate"
                onClick={() =>
                  track("mica_checker_cta", { target: "estimate", score: result.score })
                }
                className="font-mono text-xs text-white/50 underline-offset-2 hover:text-white/75 hover:underline"
              >
                {copy.estimateCta}
              </Link>
            </div>

            <button
              type="button"
              onClick={restart}
              className="mt-6 font-mono text-[11px] text-white/35 hover:text-white/55"
            >
              {copy.restart}
            </button>
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-2xl">
        <p className="font-mono text-[11px] tracking-wide text-white/45">{copy.relatedTitle}</p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {copy.relatedLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-full border border-white/10 px-4 py-2 font-mono text-[11px] text-white/55 transition hover:border-white/20 hover:text-white/80"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-2xl">
        <h2 className="font-display text-lg font-semibold text-white">{copy.faqTitle}</h2>
        <div className="mt-6">
          <ContentFaqList items={MICA_CHECKER_FAQ} />
        </div>
      </section>
    </div>
  );
}
