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
    <header className="green-hub-fade-in section-y mx-auto max-w-3xl px-4 pb-8 pt-4 md:px-6 md:pb-12 md:pt-6">
      <p className="page-eyebrow">AUROS</p>
      <h1 className="page-title mt-4 text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.03em] md:mt-5">
        {copy.title}
      </h1>
      <p className="page-intro mt-6 max-w-xl text-lg">
        {copy.subtitle}
      </p>
      <div className="green-hub-fade-in-delay mt-10">
        <PrimaryButton href="/wizard">{copy.cta}</PrimaryButton>
      </div>
      {secondaryHref && "secondary" in copy ? (
        <nav className="green-hub-fade-in-delay-2 mt-8">
          <Link
            href={secondaryHref}
            className="auros-btn auros-btn--link"
          >
            {copy.secondary} →
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
