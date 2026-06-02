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
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-24 pt-12 md:px-6 md:pt-16">
      <GreenPageHeader eyebrow={r.eyebrow} title={r.title} intro={r.intro} compact />
      <div className="mt-10">
        <Suspense
          fallback={
            <div className="h-48 animate-pulse border border-white/[0.08] bg-white/[0.02]" />
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
