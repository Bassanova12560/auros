"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { PLATFORMS } from "@/lib/wizard-constants";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";
import {
  wizardOptionLabel,
  wizardPlatformSubtitle,
} from "@/lib/wizard-options-i18n";
import type { WizardData } from "@/lib/wizard-types";

import { WizardRadioRow } from "../WizardPrimitives";
import { WizardStepHeader } from "../WizardStepHeader";

type Props = {
  data: WizardData;
  update: <K extends keyof WizardData>(k: K, v: WizardData[K]) => void;
};

export function Step8Platform({ data, update }: Props) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);

  return (
    <div>
      <WizardStepHeader
        step={8}
        tag={ws.s8.tag}
        title={ws.s8.title}
        subtitle={ws.s8.subtitle}
      />
      <div
        role="radiogroup"
        aria-label={ws.s8.platformAria}
        className="mt-8 flex flex-col gap-1.5"
      >
        {PLATFORMS.map((p) => (
          <WizardRadioRow
            key={p.label}
            step={8}
            title={wizardOptionLabel(locale, "platforms", p.label)}
            subtitle={wizardPlatformSubtitle(locale, p.label)}
            selected={data.platform === p.label}
            onSelect={() => update("platform", p.label)}
          />
        ))}
      </div>
    </div>
  );
}
