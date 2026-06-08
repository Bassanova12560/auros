"use client";

import Link from "next/link";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { StarterKitOnePagerLink } from "./StarterKitOnePagerLink";
import { ValueStackSummaryLine } from "./JurisdictionValueStack";
import { JurisdictionQuoteForm } from "./JurisdictionQuoteForm";
import { useJurisdictionPage } from "./useJurisdictionPage";
import {
  JURISDICTIONS_ANCHORS,
  JURISDICTIONS_STARTER_KIT_ROUTE,
} from "@/lib/jurisdictions/constants";

export function PricingSection() {
  const { messages } = useJurisdictionPage();
  const p = messages.pricing;
  const starter = p.tiers.find((t) => t.id === "starter")!;
  const legal = p.tiers.find((t) => t.id === "legal")!;
  const launch = p.tiers.find((t) => t.id === "launch")!;

  return (
    <section
      id="devis"
      className="scroll-mt-28 border-t border-white/[0.06] py-16 md:py-24"
    >
      <SectionHeader
        eyebrow={p.eyebrow}
        title={p.title}
        subtitle={p.subtitle}
        align="left"
      />
      <div className="mt-6">
        <Link
          href="/pricing"
          className="inline-flex min-h-[44px] items-center rounded-full border border-white/20 bg-white/[0.04] px-5 py-2.5 text-sm text-white/70 transition hover:border-white/35 hover:text-white active:scale-[0.98]"
        >
          {p.pricingOverviewLink}
        </Link>
      </div>

      <div className="mt-10 grid min-w-0 gap-4 lg:grid-cols-12 lg:gap-5">
        <BezelCard
          className="min-w-0 lg:col-span-7"
          innerClassName="flex h-full min-w-0 flex-col p-6 md:p-8"
          animate
        >
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              {starter.name}
            </p>
            <span className="rounded-full border border-white/15 bg-white/[0.06] px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/60">
              {p.featuredLabel}
            </span>
          </div>

          <p className="mt-4 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {starter.price}
          </p>
          <ValueStackSummaryLine />
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55">
            {starter.description}
          </p>

          <ul className="mt-6 flex-1 space-y-2.5">
            {starter.deliverables?.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-white/55"
              >
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/30" />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-6 border-t border-white/[0.06] pt-5 text-sm leading-relaxed text-balance text-white/45">
            {p.starterNote}
          </p>

          <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {p.reassurance.map((item) => (
              <li
                key={item}
                className="min-w-0 font-mono text-[10px] leading-snug text-white/35"
              >
                {item}
              </li>
            ))}
          </ul>

          <StarterKitOnePagerLink className="mt-6 border-t border-white/[0.06] pt-5" />

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <PrimaryButton
              href={JURISDICTIONS_ANCHORS.guide}
              className="!text-sm sm:!w-auto"
            >
              {p.ctaStarterStart}
            </PrimaryButton>
            <Link
              href={JURISDICTIONS_STARTER_KIT_ROUTE}
              className="text-sm text-white/45 underline decoration-white/20 underline-offset-4 transition hover:text-white/70"
            >
              {p.ctaStarterDetail}
            </Link>
          </div>
        </BezelCard>

        <div className="flex min-w-0 flex-col gap-4 lg:col-span-5">
          <TierCard tier={legal} cta={p.ctaLegal} href="#quote-form" />
          <TierCard tier={launch} cta={p.ctaLaunch} href="#quote-form" />
        </div>
      </div>

      <div id="quote-form" className="mt-14 scroll-mt-28 md:mt-16">
        <BezelCard innerClassName="p-6 md:p-8" animate>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {p.cta}
          </p>
          <div className="mt-6">
            <JurisdictionQuoteForm embedded />
          </div>
        </BezelCard>
      </div>
    </section>
  );
}

function TierCard({
  tier,
  cta,
  href,
}: {
  tier: {
    id: string;
    name: string;
    price: string;
    description: string;
    deliverables?: string[];
  };
  cta: string;
  href: string;
}) {
  return (
    <article className="flex flex-1 flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-6">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
        {tier.name}
      </p>
      <p className="mt-3 font-display text-2xl text-white">{tier.price}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-white/50">
        {tier.description}
      </p>
      {tier.deliverables?.length ? (
        <ul className="mt-4 space-y-2">
          {tier.deliverables.map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 text-xs text-white/45"
            >
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/25" />
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      <Link
        href={href}
        className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm text-white/70 transition hover:border-white/30 hover:text-white active:scale-[0.98]"
      >
        {cta}
      </Link>
    </article>
  );
}
