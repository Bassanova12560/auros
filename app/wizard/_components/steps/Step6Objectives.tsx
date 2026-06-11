"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GOALS } from "@/lib/wizard-constants";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";
import { wizardGoalSubtitle, wizardOptionLabel } from "@/lib/wizard-options-i18n";
import type { WizardData } from "@/lib/wizard-types";

import { WizardObjectiveCard } from "../WizardPrimitives";
import { WizardStepHeader } from "../WizardStepHeader";

type Props = {
  data: WizardData;
  toggle: (value: string) => void;
  singleSelect?: boolean;
  onSingleSelect?: (value: string) => void;
};

export function Step6Objectives({
  data,
  toggle,
  singleSelect = false,
  onSingleSelect,
}: Props) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);

  return (
    <div>
      <WizardStepHeader
        step={6}
        tag={ws.s6.tag}
        title={ws.s6.title}
        subtitle={
          singleSelect
            ? locale === "fr"
              ? "Un seul objectif principal — vous pourrez en ajouter d'autres ensuite."
              : "One main goal — you can add more later."
            : ws.s6.subtitle
        }
      />
      <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {GOALS.map((g) => (
          <WizardObjectiveCard
            key={g.id}
            title={wizardOptionLabel(locale, "goals", g.id)}
            subtitle={wizardGoalSubtitle(locale, g.id)}
            selected={data.goals.includes(g.id)}
            onClick={() => {
              if (singleSelect && onSingleSelect) {
                onSingleSelect(g.id);
                return;
              }
              toggle(g.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}
