"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { DOC_NONE } from "@/lib/wizard-constants";
import { RWA_DOCUMENT_PHASES } from "@/lib/rwa-document-phases";
import { rwaPhaseCopy } from "@/lib/rwa-document-phases-i18n";
import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";
import { wizardOptionLabel } from "@/lib/wizard-options-i18n";
import type { WizardData } from "@/lib/wizard-types";

import { WizardDocumentRow } from "../WizardPrimitives";
import { WizardStepHeader } from "../WizardStepHeader";

type Props = {
  data: WizardData;
  toggle: (value: string) => void;
};

export function Step5Documents({ data, toggle }: Props) {
  const { locale } = useLocale();
  const ws = getWizardStepsMessages(locale);
  const held = data.documents.filter((d) => d !== DOC_NONE).length;

  return (
    <div>
      <WizardStepHeader
        step={5}
        tag={ws.s5.tag}
        title={ws.s5.title}
        subtitle={ws.s5.subtitle}
      />
      <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-white/50">
        {ws.s5.dataRoomHint ?? "Data room · 5 phases · 15 documents"}{" "}
        <span className="text-white/80">
          {held}/15
        </span>
      </p>

      <div className="mt-8 flex flex-col gap-8">
        {RWA_DOCUMENT_PHASES.map((phase) => {
          const copy = rwaPhaseCopy(locale, phase.id);
          return (
          <div key={phase.id}>
            <div className="mb-3 border-b border-white/[0.06] pb-2">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-muted">
                {copy.title}
              </p>
              <p className="mt-1 text-xs text-white/50">{copy.subtitle}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              {phase.documents.map((d) => (
                <WizardDocumentRow
                  key={d.id}
                  label={wizardOptionLabel(locale, "documents", d.id)}
                  checked={data.documents.includes(d.id)}
                  onToggle={() => toggle(d.id)}
                />
              ))}
            </div>
          </div>
        );
        })}

        <WizardDocumentRow
          label={wizardOptionLabel(locale, "documents", DOC_NONE)}
          checked={
            data.documents.length === 0 || data.documents.includes(DOC_NONE)
          }
          onToggle={() => toggle(DOC_NONE)}
          muted
        />
      </div>
    </div>
  );
}
