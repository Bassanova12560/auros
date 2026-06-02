"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_ROUTE, getGreenMessages } from "@/lib/green";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
} from "./green-ui";
import { GreenLabelForm } from "./GreenLabelForm";

export function GreenLabelView() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const l = m.label;

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={l.eyebrow} title={l.title} intro={l.intro} compact />

      <GreenPanel className="mt-10">
        <div className="p-6 md:p-8">
          <GreenSectionTitle>{l.scopeTitle}</GreenSectionTitle>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            <ul className="space-y-2 text-sm text-neutral-300">
              {l.scopeMeasures.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-emerald-500">+</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <ul className="space-y-2 text-sm text-neutral-500">
              {l.scopeDoesNot.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-neutral-600">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </GreenPanel>

      <div className="mt-10">
        <GreenLabelForm />
      </div>

      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{l.backLink}</GreenBackLink>
    </div>
  );
}
