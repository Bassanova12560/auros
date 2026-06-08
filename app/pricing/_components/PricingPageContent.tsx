"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { BezelCard } from "@/app/_components/ui/BezelCard";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { getPricingMessages } from "@/lib/pricing-i18n";

export function PricingPageContent() {
  const { locale } = useLocale();
  const m = getPricingMessages(locale);

  return (
    <>
      <SectionHeader
        eyebrow={m.eyebrow}
        title={m.title}
        subtitle={m.subtitle}
        align="left"
      />

      <div className="mt-10 grid min-w-0 gap-4 md:grid-cols-3 md:gap-5">
        {m.tiers.map((tier) => (
          <BezelCard
            key={tier.id}
            className={`min-w-0 ${tier.featured ? "md:-mt-1 md:mb-1" : undefined}`}
            innerClassName="flex h-full min-w-0 flex-col p-5 md:p-7"
            animate
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                {tier.name}
              </p>
              {tier.featured ? (
                <span className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/60">
                  {m.featuredLabel}
                </span>
              ) : null}
            </div>
            <p className="mt-4 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {tier.price}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              {tier.description}
            </p>
            <ul className="mt-6 flex-1 space-y-2.5">
              {tier.features.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-sm text-white/55"
                >
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              {tier.featured ? (
                <PrimaryButton href={tier.href} className="!w-full sm:!w-full">
                  {tier.cta}
                </PrimaryButton>
              ) : (
                <Link
                  href={tier.href}
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white active:scale-[0.98]"
                >
                  {tier.cta}
                </Link>
              )}
            </div>
          </BezelCard>
        ))}
      </div>

      <p className="mt-10 text-sm text-white/40">{m.disclaimer}</p>
      <Link
        href="/jurisdictions"
        className="mt-4 inline-block text-sm text-white/45 underline-offset-4 transition hover:text-white/70 hover:underline"
      >
        {m.jurisdictionsLink}
      </Link>
    </>
  );
}
