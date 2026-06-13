"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { ScoreReveal } from "@/app/_components/ScoreReveal";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { track } from "@/lib/analytics";
import { getCsrdCheckerCopy } from "@/lib/green/csrd-check/i18n";
import { computeCsrdScope } from "@/lib/green/csrd-check/scoring";
import type { CsrdAnswers, CsrdQuestionId } from "@/lib/green/csrd-check/types";
import { GREEN_CSRD_CHECK_ROUTE } from "@/lib/green/constants";
import { prefillFromCsrdChecker, saveWizardPrefill } from "@/lib/wizard-prefill";

import { GreenImpactReportCta } from "@/app/green/_components/GreenImpactReportCta";

const EMPTY: CsrdAnswers = {
  employees250: null,
  revenue40m: null,
  balance20m: null,
  listedEu: null,
  greenAssets: null,
  hasSustainabilityReport: null,
};

export function CsrdCheckView() {
  const { locale } = useLocale();
  const copy = getCsrdCheckerCopy(locale);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<CsrdAnswers>(EMPTY);
  const [showScore, setShowScore] = useState(false);

  const total = copy.questions.length;
  const onResult = step >= total;
  const current = !onResult ? copy.questions[step] : null;
  const currentVal = current ? answers[current.id] : null;

  const result = useMemo(
    () => (onResult ? computeCsrdScope(answers) : null),
    [answers, onResult]
  );

  useEffect(() => {
    track("csrd_checker_start", { locale });
  }, [locale]);

  const select = useCallback((id: CsrdQuestionId, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }, []);

  const goNext = () => {
    if (!current || currentVal === null) return;
    if (step + 1 >= total) {
      setShowScore(true);
      track("csrd_checker_complete", { locale });
    }
    setStep((s) => s + 1);
  };

  const goBack = () => {
    if (onResult) {
      setShowScore(false);
      setStep(total - 1);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  };

  const restart = () => {
    try {
      sessionStorage.removeItem("auros_csrd_result");
    } catch {
      // ignore
    }
    setAnswers(EMPTY);
    setStep(0);
    setShowScore(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startGreenWizard = () => {
    saveWizardPrefill(prefillFromCsrdChecker());
    track("csrd_checker_wizard_cta", { locale });
  };

  return (
    <div className="space-y-16 md:space-y-20">
      <StaticSectionHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        subtitle={copy.intro}
      />

      {!onResult ? (
        <div className="card-flat px-5 py-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {copy.progress(step + 1, total)}
          </p>
          <p className="mt-4 text-lg font-light text-white/90">{current?.label}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => current && select(current.id, true)}
              className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
                currentVal === true
                  ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                  : "border-white/15 text-white/70 hover:border-white/30"
              }`}
            >
              {copy.yes}
            </button>
            <button
              type="button"
              onClick={() => current && select(current.id, false)}
              className={`rounded-full border px-5 py-2.5 text-sm transition-colors ${
                currentVal === false
                  ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                  : "border-white/15 text-white/70 hover:border-white/30"
              }`}
            >
              {copy.no}
            </button>
          </div>
          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={goBack}
              disabled={step === 0}
              className="text-sm text-white/45 disabled:opacity-30"
            >
              {copy.back}
            </button>
            <PrimaryButton onClick={goNext} disabled={currentVal === null}>
              {copy.next}
            </PrimaryButton>
          </div>
        </div>
      ) : result ? (
        <div className="space-y-8">
          <ScoreReveal show={showScore} score={result.preparation_score} />
          <div className="card-flat px-5 py-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/70">
              {copy.resultLabel}
            </p>
            <p className="mt-3 text-xl font-light text-white">
              {copy.scopeLabels[result.scope_key]}
            </p>
            {result.scope_from_year ? (
              <p className="mt-2 text-sm text-white/55">
                {copy.scopeFromYear(result.scope_from_year)}
              </p>
            ) : null}
            <p className="mt-4 text-sm text-white/60">
              {copy.preparationScore(result.preparation_score)}
            </p>
            {result.priority_keys.length > 0 ? (
              <ul className="mt-6 space-y-2 text-sm text-white/65">
                {result.priority_keys.map((key) => (
                  <li key={key}>· {copy.priorities[key]}</li>
                ))}
              </ul>
            ) : null}
            <p className="mt-6 text-xs text-white/40">{copy.disclaimer}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/wizard?type=green&asset=renewable" onClick={startGreenWizard}>
                <PrimaryButton>{copy.wizardCta}</PrimaryButton>
              </Link>
              <button
                type="button"
                onClick={restart}
                className="text-sm text-white/45 hover:text-white/70"
              >
                {copy.restart}
              </button>
            </div>
            <div className="mt-8">
              <GreenImpactReportCta csrdResult={result} />
            </div>
          </div>
        </div>
      ) : null}

      <ContentFaqList items={[...copy.faq]} />
      <p className="font-mono text-[10px] text-white/30">{GREEN_CSRD_CHECK_ROUTE}</p>
    </div>
  );
}
