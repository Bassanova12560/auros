"use client";



import { useLocale } from "@/app/_components/i18n/LocaleProvider";

import { STEP2_MIN_WORDS } from "@/lib/wizard-constants";

import { getWizardStepsMessages } from "@/lib/wizard-steps-i18n";

import type { WizardData } from "@/lib/wizard-types";



import { WizardStepHeader } from "../WizardStepHeader";



type Props = {

  data: WizardData;

  update: (value: string) => void;

};



export function Step2Description({ data, update }: Props) {

  const { locale } = useLocale();

  const ws = getWizardStepsMessages(locale);

  const trimmed = data.description.trim();

  const words = trimmed ? trimmed.split(/\s+/).length : 0;

  const remaining = Math.max(0, STEP2_MIN_WORDS - words);



  return (

    <div>

      <WizardStepHeader

        step={2}

        tag={ws.s2.tag}

        title={ws.s2.title}

        subtitle={ws.s2.subtitle}

      />

      <p className="mt-4 font-mono text-[10px] leading-relaxed text-white/40">

        {ws.s2.exampleHint}

      </p>

      <div className="mt-6">

        <textarea

          data-wizard-step="2"

          className="wizard-textarea"

          placeholder={ws.s2.placeholder}

          value={data.description}

          onChange={(e) => update(e.target.value)}

          spellCheck={false}

          aria-describedby="wizard-step2-hint"

        />

        <p

          id="wizard-step2-hint"

          className="mt-2 text-right font-mono text-[11px] tabular-nums tracking-wide text-white/35"

        >

          {ws.s2.words(words, STEP2_MIN_WORDS, remaining)}

        </p>

      </div>

    </div>

  );

}


