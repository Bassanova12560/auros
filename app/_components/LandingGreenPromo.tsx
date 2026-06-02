"use client";

import Link from "next/link";

import { useTranslations } from "@/app/_components/i18n/LocaleProvider";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { GREEN_MARKET_ROUTE, GREEN_REGISTER_ROUTE, GREEN_ROUTE } from "@/lib/green";

export function LandingGreenPromo() {
  const t = useTranslations();
  const g = t.greenPromo;

  return (
    <section className="border-y border-green-royal bg-void px-6 py-12 md:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-wide text-green-royal">{g.eyebrow}</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-[-0.02em] text-white md:text-3xl">
            {g.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{g.subtitle}</p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
          <PrimaryButton
            href={GREEN_MARKET_ROUTE}
            className="!border !border-green-royal !bg-green-royal !text-white hover:!bg-green-royal-bright"
          >
            {g.marketCta}
          </PrimaryButton>
          <Link
            href={GREEN_ROUTE}
            className="inline-flex min-h-[44px] items-center justify-center border border-white/20 px-5 font-mono text-[11px] uppercase tracking-wider text-white/70 transition hover:border-white/40 hover:text-white"
          >
            {g.cta}
          </Link>
          <Link
            href={`${GREEN_REGISTER_ROUTE}?type=producer`}
            className="inline-flex min-h-[44px] items-center font-mono text-[11px] tracking-wide text-green-royal-bright transition hover:text-white"
          >
            {g.registerCta} →
          </Link>
        </div>
      </div>
    </section>
  );
}
