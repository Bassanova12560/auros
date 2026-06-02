"use client";

import Link from "next/link";

import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { AUROS_WIZARD_ROUTE, GREEN_ROUTE, getGreenMessages } from "@/lib/green";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
  greenBtnClass,
} from "./green-ui";

export function GreenAboutView() {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const a = m.about;

  return (
    <div className="page-inner page-inner--4xl mx-auto px-4 pb-24 pt-12 md:px-6 md:pt-16">
      <GreenPageHeader eyebrow={a.eyebrow} title={a.title} intro={a.intro} compact />

      <GreenPanel className="mt-12">
        <div className="p-6 md:p-10">
          <GreenSectionTitle>{a.promise.title}</GreenSectionTitle>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted md:text-base">
            {a.promise.body}
          </p>
        </div>
      </GreenPanel>

      <section className="mt-10">
        <GreenSectionTitle>{a.values.title}</GreenSectionTitle>
        <div className="mt-6 grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
          {a.values.items.map((item) => (
            <div key={item.title} className="bg-black p-6 md:p-8">
              <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <GreenSectionTitle>{a.blocksTitle}</GreenSectionTitle>
        <div className="mt-6 space-y-px border border-white/[0.08] bg-white/[0.08]">
          {a.blocks.map((block) => (
            <div
              key={block.href}
              className="flex flex-col gap-4 bg-black p-6 md:flex-row md:items-center md:justify-between md:p-8"
            >
              <div className="max-w-2xl">
                <h3 className="font-display text-xl font-semibold tracking-[-0.01em] text-white">{block.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{block.body}</p>
              </div>
              <PrimaryButton href={block.href} className={`shrink-0 ${greenBtnClass}`}>
                {block.cta}
              </PrimaryButton>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <GreenSectionTitle>{a.profilesTitle}</GreenSectionTitle>
        <div className="mt-6 grid gap-px border border-white/[0.08] bg-white/[0.08] lg:grid-cols-3">
          {a.profiles.map((profile) => (
            <div key={profile.id} className="flex flex-col bg-black p-6">
              <h3 className="font-display text-lg font-semibold tracking-[-0.01em] text-white">{profile.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{profile.body}</p>
              <Link
                href={profile.href}
                className="mt-6 font-mono text-[11px] tracking-wide text-white/40 transition hover:text-green-royal-bright"
              >
                {profile.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14" aria-labelledby="green-about-ecosystem">
        <GreenSectionTitle>{a.ecosystemTitle}</GreenSectionTitle>
        <div className="mt-6 grid gap-px border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {a.ecosystemLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group bg-black px-5 py-5 transition-colors hover:bg-white/[0.02] md:px-6"
            >
              <p className="font-display text-sm font-semibold text-white group-hover:text-accent">
                {link.title}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <p className="mt-10">
        <Link
          href={`${AUROS_WIZARD_ROUTE}?asset=renewable`}
          className="font-mono text-[11px] tracking-wide text-white/35 transition hover:text-white/60"
        >
          {a.wizardCta} →
        </Link>
      </p>

      <GreenDisclaimer>{m.disclaimer}</GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>{a.backLink}</GreenBackLink>
    </div>
  );
}
