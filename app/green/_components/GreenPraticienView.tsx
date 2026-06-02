"use client";

import Link from "next/link";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_CERTIFICATION_ROUTE,
  GREEN_PRATICIEN_EXAM_ROUTE,
  GREEN_ROUTE,
  getGreenMessages,
} from "@/lib/green";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
  greenBtnClass,
} from "./green-ui";
import { GreenPraticienWaitlistForm } from "./GreenPraticienWaitlistForm";

export function GreenPraticienView() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const p = m.praticien;

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={p.eyebrow} title={p.title} intro={p.intro} compact />

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <GreenPanel>
          <div className="p-6 md:p-8">
            <GreenSectionTitle>{p.prerequisitesTitle}</GreenSectionTitle>
            <ul className="mt-4 space-y-2 text-sm text-neutral-400">
              {p.prerequisites.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-emerald-500">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </GreenPanel>
        <GreenPanel>
          <div className="p-6 md:p-8">
            <GreenSectionTitle>{p.curriculumTitle}</GreenSectionTitle>
            <ul className="mt-4 space-y-2 text-sm text-neutral-400">
              {p.curriculum.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-emerald-500">·</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </GreenPanel>
      </div>

      <GreenPanel className="mt-10">
        <div className="p-6 md:p-8">
          <GreenSectionTitle>{p.examCta}</GreenSectionTitle>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">{p.examNote}</p>
          <div className="mt-6">
            <PrimaryButton href={GREEN_PRATICIEN_EXAM_ROUTE} className={greenBtnClass}>
              {p.examCta}
            </PrimaryButton>
          </div>
        </div>
      </GreenPanel>

      <div className="mt-12">
        <GreenSectionTitle>{p.waitlistTitle}</GreenSectionTitle>
        <div className="mt-6">
          <GreenPraticienWaitlistForm />
        </div>
      </div>

      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_CERTIFICATION_ROUTE}>{p.backLink}</GreenBackLink>
      <Link
        href={GREEN_ROUTE}
        className="ml-6 mt-8 inline-flex items-center font-mono text-[11px] uppercase tracking-wider text-neutral-500 hover:text-emerald-500"
      >
        AUROS Green →
      </Link>
    </div>
  );
}
