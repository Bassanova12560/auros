"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { TIMELINES } from "@/lib/wizard-constants";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";
import {
  wizardOptionLabel,
  wizardTimelineSubtitle,
} from "@/lib/wizard-options-i18n";
import type { WizardData } from "@/lib/wizard-types";

import { WizardRadioRow } from "../WizardPrimitives";
import { WizardStepHeader } from "../WizardStepHeader";

type Props = {
  data: WizardData;
  update: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
};

export function Step7Timeline({ data, update }: Props) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);

  return (
    <div>
      <WizardStepHeader
        step={7}
        tag={ws.s7.tag}
        title={ws.s7.title}
        subtitle={ws.s7.subtitle}
      />
      <div
        role="radiogroup"
        aria-label={ws.s7.urgencyAria}
        className="mt-8 flex flex-col gap-1.5"
      >
        {TIMELINES.map((t) => (
          <WizardRadioRow
            key={t.label}
            step={7}
            title={wizardOptionLabel(locale, "timelines", t.label)}
            subtitle={wizardTimelineSubtitle(locale, t.label)}
            selected={data.timeline === t.label}
            onSelect={() => update("timeline", t.label)}
          />
        ))}
      </div>
    </div>
  );
}
