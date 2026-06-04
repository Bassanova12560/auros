"use client";

import { Suspense } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_ROUTE, getGreenMessages } from "@/lib/green";

import { GreenActorRegisterForm } from "./market/GreenActorRegisterForm";
import { GreenBackLink, GreenDisclaimer, GreenPageHeader } from "./green-ui";

export function GreenRegisterView() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const r = m.register;

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-24 pt-10 md:px-6 md:pt-12">
      <GreenPageHeader eyebrow={r.eyebrow} title={r.title} intro={r.intro} compact />
      <div className="mt-6">
        <Suspense
          fallback={
            <div
              className="green-form-panel min-h-[320px] animate-pulse border p-6 md:p-8"
              aria-busy="true"
            />
          }
        >
          <GreenActorRegisterForm />
        </Suspense>
      </div>
      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{r.backLink}</GreenBackLink>
    </div>
  );
}
