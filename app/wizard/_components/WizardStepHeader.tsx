"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";
import { stepReassuranceForStep } from "@/lib/wizard-journey-i18n";

type Props = {
  step: number;
  tag: string;
  title: string;
  subtitle: string;
};

export function WizardStepHeader({ step, tag, title, subtitle }: Props) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);
  const reassurance = stepReassuranceForStep(step, locale);
  return (
    <>
      <p className="wizard-step-label">{ws.stepLabel(step, tag)}</p>
      <h2 className="wizard-title">{title}</h2>
      <p className="wizard-subtitle">{subtitle}</p>
      {reassurance ? (
        <p className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm leading-relaxed text-white/50">
          {reassurance}
        </p>
      ) : null}
    </>
  );
}
