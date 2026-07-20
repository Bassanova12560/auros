"use client";

import type { ReactNode } from "react";

import { AurosBrandLockup } from "@/app/_components/AurosBrandLockup";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { resolveCatalogLocale } from "@/lib/i18n";
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
import { getWizardModesMessages } from "@/lib/wizard-modes-i18n";
import {
  phaseIndexForStep,
  stepCountForMode,
  stepIndexInMode,
  type WizardMode,
} from "@/lib/wizard-modes";

import { WizardEmailResume } from "./WizardEmailResume";

type Props = {
  step: number;
  totalSteps: number;
  progressPct: number;
  wizardMode?: WizardMode;
  savedAt: number | null;
  hydrated: boolean;
  isStepValid: boolean;
  disableBack: boolean;
  showNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onNextBlocked?: () => void;
  onPhaseClick?: (phaseIndex: number) => void;
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
  onPhaseClick,
  showValidationHint = false,
  children,
  navExtra,
  wizardMode = "pro",
}: Props) {
  const { locale } = useLocale();
  const shell = getWizardShellMessages(locale);
  const journey = getJourneyMessages(locale);
  const modes = getWizardModesMessages(locale);
  const isExplore = wizardMode === "explore";
  const phase = wizardPhaseForStep(step);
  const phaseIdx = phaseIndexForStep(wizardMode, step);
  const inPhase = stepPositionInPhase(step);
  const minsLeft = isExplore
    ? Math.max(1, Math.ceil((stepCountForMode("explore") - stepIndexInMode("explore", step) + 1) * 0.6))
    : estimatedMinutesLeft(step);
  const phaseIntro = isExplore ? null : phaseIntroForStep(step, locale);
  const modeIdx = stepIndexInMode(wizardMode, step);
  const modeTotal = stepCountForMode(wizardMode);

  return (
    <main className="page-main page-main--nav mx-auto flex min-h-dvh max-w-3xl flex-col md:px-6 md:py-12">
      <div className="mb-6 flex items-center justify-between gap-3">
        <AurosBrandLockup
          product={isExplore ? "Explore" : "Wizard"}
          href="/"
        />
        <div className="auros-accent-rule hidden w-16 sm:block" aria-hidden />
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        <span>{shell.title}</span>
        <span className="tabular-nums tracking-[0.12em] text-white/55">
          {isExplore ? (
            <>
              {modes.exploreLabel} · {modes.stepOf(modeIdx, modeTotal)} ·{" "}
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

      <>
          <div
            className="mb-4 flex gap-1"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={WIZARD_PHASES.length}
            aria-valuenow={phaseIdx + 1}
            aria-label={`${journey.moment} ${phaseIdx + 1}/${phaseCount()}`}
          >
            {WIZARD_PHASES.map((p, i) => {
              const active = i === phaseIdx;
              const done = i < phaseIdx;
              return (
                <div
                  key={p.id}
                  className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/[0.05]"
                >
                  <div
                    className={`h-full rounded-full transition-[width] duration-300 ease-out ${
                      done || active
                        ? "bg-[color-mix(in_srgb,var(--auros-green-warm)_75%,white)]"
                        : "w-0 bg-transparent"
                    }`}
                    style={
                      active && !done
                        ? {
                            width: `${Math.max(20, (inPhase.indexInPhase / inPhase.totalInPhase) * 100)}%`,
                          }
                        : done
                          ? { width: "100%" }
                          : { width: "0%" }
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="scroll-x-touch mb-4 flex flex-nowrap gap-2 pb-1 md:flex-wrap">
            {WIZARD_PHASES.map((p, i) => {
              const active = i === phaseIdx;
              const done = i < phaseIdx;
              const clickable = done && onPhaseClick;
              const pillClass = `shrink-0 rounded-full border px-2.5 py-1 text-[9px] tracking-[0.18em] transition ${
                active
                  ? "border-[color-mix(in_srgb,var(--auros-green-warm)_45%,white)] bg-[color-mix(in_srgb,var(--auros-green-warm)_12%,transparent)] text-white"
                  : done
                    ? "border-white/15 text-white/50"
                    : "border-white/[0.06] text-white/30"
              }`;
              if (clickable) {
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => onPhaseClick(i)}
                    className={`${pillClass} auros-focus interactive-subtle hover:border-white/25 hover:text-white/70`}
                  >
                    {p.labels[resolveCatalogLocale(locale)]}
                  </button>
                );
              }
              return (
                <span
                  key={p.id}
                  aria-current={active ? "step" : undefined}
                  className={pillClass}
                >
                  {p.labels[resolveCatalogLocale(locale)]}
                </span>
              );
            })}
          </div>

          <div
            className="mb-6 h-0.5 w-full overflow-hidden rounded-full bg-white/[0.05]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={totalSteps}
            aria-valuenow={step}
            aria-label={`${shell.title} ${Math.round(progressPct)}%`}
          >
            <div
              className="h-full rounded-full bg-[color-mix(in_srgb,var(--auros-green-warm)_75%,white)] transition-[width] duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </>

      {phase ? (
        <div className="mb-6 space-y-2">
          {isExplore ? (
            <p className="text-sm leading-relaxed text-white/55">{modes.exploreNote}</p>
          ) : (
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
              {shell.phaseOf} {phaseIdx + 1}/{WIZARD_PHASES.length} ·{" "}
              {phase!.labels[resolveCatalogLocale(locale)]} ·{" "}
              {journey.inThisPart(inPhase.indexInPhase, inPhase.totalInPhase)}
            </p>
          )}
          {phaseIntro ? (
            <p className="text-sm leading-relaxed text-white/55">{phaseIntro}</p>
          ) : null}
          <p className="font-mono text-[10px] text-white/30">
            {isExplore ? modes.shellExplore : modes.shellPro}
          </p>
        </div>
      ) : null}

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

        <span className="flex-1 text-center font-mono text-[10px] uppercase tracking-wider text-white/35">
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

      {hydrated ? <WizardEmailResume /> : null}
    </main>
  );
}
