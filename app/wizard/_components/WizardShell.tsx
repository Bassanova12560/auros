"use client";

import type { ReactNode } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  WIZARD_PHASES,
  wizardPhaseForStep,
} from "@/lib/wizard-phases";
import { getWizardShellMessages } from "@/lib/wizard-shell-i18n";
import {
  estimatedMinutesLeft,
  getJourneyMessages,
  phaseIntroForStep,
  phaseCount,
  stepPositionInPhase,
  wizardPhaseIndex,
} from "@/lib/wizard-journey-i18n";
import { getWizardExpertMessages } from "@/lib/wizard-expert-i18n";
import { expertMinutesLeft, expertStepCount, expertStepIndex } from "@/lib/wizard-expert-path";

type Props = {
  step: number;
  totalSteps: number;
  progressPct: number;
  expertMode?: boolean;
  savedAt: number | null;
  hydrated: boolean;
  isStepValid: boolean;
  disableBack: boolean;
  showNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onNextBlocked?: () => void;
  showValidationHint?: boolean;
  children: ReactNode;
  navExtra?: ReactNode;
};

export function WizardShell({
  step,
  totalSteps,
  progressPct,
  savedAt,
  hydrated,
  isStepValid,
  disableBack,
  showNext,
  onBack,
  onNext,
  onNextBlocked,
  showValidationHint = false,
  children,
  navExtra,
  expertMode = false,
}: Props) {
  const { locale } = useLocale();
  const shell = getWizardShellMessages(locale);
  const journey = getJourneyMessages(locale);
  const expert = getWizardExpertMessages(locale);
  const phase = wizardPhaseForStep(step);
  const phaseIdx = wizardPhaseIndex(step);
  const inPhase = stepPositionInPhase(step);
  const minsLeft = expertMode ? expertMinutesLeft(step) : estimatedMinutesLeft(step);
  const phaseIntro = expertMode ? null : phaseIntroForStep(step, locale);
  const expertIdx = expertStepIndex(step);
  const expertTotal = expertStepCount();

  return (
    <main className="page-main page-main--nav mx-auto flex min-h-dvh max-w-3xl flex-col md:px-6 md:py-12">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        <span>{shell.title}</span>
        <span className="tabular-nums tracking-[0.12em] text-white/55">
          {expertMode ? (
            <>
              {expert.expressLabel} · {expert.stepOf(expertIdx, expertTotal)} ·{" "}
              {journey.minutesLeft(minsLeft)}
            </>
          ) : (
            <>
              {journey.moment} {phaseIdx + 1}/{phaseCount()} ·{" "}
              {journey.minutesLeft(minsLeft)}
            </>
          )}
        </span>
      </div>

      {!expertMode ? (
      <div className="scroll-x-touch mb-6 flex flex-nowrap gap-2 pb-1 md:flex-wrap">
        {WIZARD_PHASES.map((p, i) => {
          const active = i === phaseIdx;
          const done = i < phaseIdx;
          return (
            <span
              key={p.id}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] tracking-[0.18em] transition ${
                active
                  ? "border-white/35 bg-white/[0.08] text-white"
                  : done
                    ? "border-white/15 text-white/50"
                    : "border-white/[0.06] text-white/30"
              }`}
            >
              {p.labels[locale]}
            </span>
          );
        })}
      </div>
      ) : null}

      {expertMode || phase ? (
        <div className="mb-6 space-y-2">
          {expertMode ? (
            <p className="text-sm leading-relaxed text-white/55">{expert.expressNote}</p>
          ) : (
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              {shell.phaseOf} {phaseIdx + 1}/{WIZARD_PHASES.length} ·{" "}
              {phase!.labels[locale]} ·{" "}
              {journey.inThisPart(inPhase.indexInPhase, inPhase.totalInPhase)}
            </p>
          )}
          {phaseIntro ? (
            <p className="text-sm leading-relaxed text-white/55">{phaseIntro}</p>
          ) : null}
          <p className="font-mono text-[10px] text-white/30">
            {expertMode ? expert.shellExpress : journey.shellNote}
          </p>
        </div>
      ) : null}

      <div
        className="mb-10 h-0.5 w-full overflow-hidden rounded-full bg-white/[0.05]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-valuenow={step}
      >
        <div
          className="h-full rounded-full bg-[color-mix(in_srgb,var(--auros-green-warm)_75%,white)] transition-[width] duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="relative min-h-[min(36dvh,380px)] flex-1 md:min-h-[min(52vh,480px)]">
        {children}
      </div>

      {showValidationHint && !isStepValid ? (
        <p
          className="mt-4 font-mono text-[10px] text-accent md:mt-6"
          role="alert"
          aria-live="polite"
        >
          {shell.stepRequired}
        </p>
      ) : null}

      <div className="wizard-nav-sticky mt-6 flex items-center justify-between gap-3 md:mt-10 md:gap-4 md:border-t md:pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={disableBack}
          className="auros-focus interactive-subtle min-h-[44px] rounded-xl border border-white/10 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-white/70 hover:border-white/25 hover:text-white disabled:pointer-events-none disabled:opacity-30"
        >
          {shell.back}
        </button>

        <span className="hidden flex-1 text-center font-mono text-[10px] uppercase tracking-wider text-white/35 sm:block">
          {hydrated && savedAt ? (
            <>
              {shell.saved} · {new Date(savedAt).toLocaleTimeString(locale)}
            </>
          ) : hydrated ? (
            <>{shell.autosave}</>
          ) : (
            <>&nbsp;</>
          )}
        </span>

        {showNext ? (
          <button
            type="button"
            onClick={() => {
              if (!isStepValid) {
                onNextBlocked?.();
                return;
              }
              onNext();
            }}
            aria-disabled={!isStepValid}
            className={`auros-focus interactive-subtle min-h-[44px] rounded-xl border px-5 py-2.5 font-mono text-xs uppercase tracking-wider ${
              isStepValid
                ? "border-white bg-white text-void hover:bg-white/90"
                : "border-white/20 bg-white/20 text-white/40"
            }`}
          >
            {shell.next}
          </button>
        ) : (
          navExtra ?? <span className="min-w-[90px]" aria-hidden />
        )}
      </div>
    </main>
  );
}
