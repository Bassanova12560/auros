"use client";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { AUROS_WIZARD_ROUTE, GREEN_ROUTE, getGreenMessages } from "@/lib/green";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  greenBtnClass,
} from "./green-ui";

export function GreenGuideView() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const g = m.guide;

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={g.eyebrow} title={g.title} intro={g.intro} compact />

      <div className="mt-10 space-y-4">
        {g.sections.map((section) => (
          <GreenPanel key={section.title}>
            <div className="p-6 md:p-8">
              <h2 className="font-display text-lg font-semibold text-emerald-400">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{section.body}</p>
            </div>
          </GreenPanel>
        ))}
      </div>

      <div className="mt-10">
        <PrimaryButton href={`${AUROS_WIZARD_ROUTE}?asset=renewable`} className={greenBtnClass}>
          {g.wizardCta}
        </PrimaryButton>
      </div>

      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{g.backLink}</GreenBackLink>
    </div>
  );
}
