"use client";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { ACADEMY_FUNDAMENTALS_ROUTE } from "@/lib/academy";
import { GREEN_PRATICIEN_ROUTE, GREEN_ROUTE, getGreenMessages } from "@/lib/green";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
  greenBtnClass,
} from "./green-ui";

export function GreenCertificationView() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const c = m.certification;

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={c.eyebrow} title={c.title} intro={c.intro} compact />

      <GreenPanel className="mt-10">
        <div className="p-6 md:p-8">
          <GreenSectionTitle>{c.modulesTitle}</GreenSectionTitle>
          <ol className="mt-6 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-neutral-400">
            {c.modules.map((mod) => (
              <li key={mod}>{mod}</li>
            ))}
          </ol>
          <div className="mt-8 flex flex-wrap gap-4">
            <PrimaryButton href={ACADEMY_FUNDAMENTALS_ROUTE} className={greenBtnClass}>
              {c.academyCta}
            </PrimaryButton>
            <PrimaryButton href={GREEN_PRATICIEN_ROUTE} className={greenBtnClass}>
              {c.praticienCta}
            </PrimaryButton>
          </div>
        </div>
      </GreenPanel>

      <p className="mt-6 text-sm text-neutral-400">{c.greenExpertNote}</p>
      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{c.backLink}</GreenBackLink>
    </div>
  );
}
