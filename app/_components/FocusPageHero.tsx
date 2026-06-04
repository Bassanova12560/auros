"use client";

import Link from "next/link";

import { useLocale } from "./i18n/LocaleProvider";
import { PrimaryButton } from "./ui/PrimaryButton";
import { getEaseMessages } from "@/lib/ease-i18n";

type PageKey = "discover" | "howItWorks" | "trust";

type Props = {
  page: PageKey;
  secondaryHref?: string;
};

export function FocusPageHero({ page, secondaryHref }: Props) {
  const { locale } = useLocale();
  const copy = getEaseMessages(locale).focusPages[page];

  return (
    <header className="green-hub-fade-in mx-auto max-w-3xl px-4 pb-12 pt-4 md:px-6 md:pb-16 md:pt-8">
      <h1 className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
        {copy.title}
      </h1>
      <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/55">
        {copy.subtitle}
      </p>
      <div className="green-hub-fade-in-delay mt-10">
        <PrimaryButton href="/wizard">{copy.cta}</PrimaryButton>
      </div>
      {secondaryHref && "secondary" in copy ? (
        <nav className="green-hub-fade-in-delay-2 mt-8">
          <Link
            href={secondaryHref}
            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white/70"
          >
            {copy.secondary} →
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
