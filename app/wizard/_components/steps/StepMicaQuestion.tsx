"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getMicaCheckerCopy } from "@/lib/mica-checker/i18n";
import { MICA_STEP_TO_QUESTION } from "@/lib/wizard-modes";
import type { MicaAnswers } from "@/lib/mica-checker/types";
import type { WizardData } from "@/lib/wizard-types";

import { WizardStepHeader } from "../WizardStepHeader";

type Props = {
  step: number;
  data: WizardData;
  updateMica: (patch: Partial<MicaAnswers>) => void;
};

export function StepMicaQuestion({ step, data, updateMica }: Props) {
  const { locale } = useLocale();
  const copy = getMicaCheckerCopy(locale);
  const questionId = MICA_STEP_TO_QUESTION[step];
  const question = copy.questions.find((q) => q.id === questionId);
  const current = data.mica?.[questionId] ?? null;

  if (!question) return null;

  return (
    <div>
      <WizardStepHeader
        step={step}
        tag="MiCA"
        title={question.title}
        subtitle={question.hint}
      />
      <div className="mt-8 grid gap-2 sm:grid-cols-2">
        {question.options.map((opt) => {
          const active = current === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                updateMica({ [questionId]: opt.value } as Partial<MicaAnswers>)
              }
              className={
                active
                  ? "wizard-asset-chip wizard-asset-chip-active text-left"
                  : "wizard-asset-chip text-left"
              }
            >
              <span className="block font-medium">{opt.label}</span>
              {opt.detail ? (
                <span className="mt-1 block text-xs text-white/45">
                  {opt.detail}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
