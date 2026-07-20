"use client";

import Link from "next/link";

import { useLocale } from "./i18n/LocaleProvider";
import { AurosBrandLockup } from "./AurosBrandLockup";
import { PrimaryButton } from "./ui/PrimaryButton";
import { getEaseMessages } from "@/lib/ease-i18n";

type PageKey = "discover" | "howItWorks" | "trust";

type Props = {
  page: PageKey;
  secondaryHref?: string;
};

const PAGE_EYEBROW: Record<PageKey, string> = {
  discover: "Hub produit",
  howItWorks: "Parcours",
  trust: "Confiance",
};

export function FocusPageHero({ page, secondaryHref }: Props) {
  const { locale } = useLocale();
  const copy = getEaseMessages(locale).focusPages[page];

  return (
    <header className="green-hub-fade-in mx-auto max-w-3xl pb-8 pt-2 md:pb-12 md:pt-4">
      <AurosBrandLockup size="md" className="mb-8" />
      <div className="auros-accent-rule mb-8" aria-hidden />
      <p className="page-eyebrow">{PAGE_EYEBROW[page]}</p>
      <h1 className="page-title mt-4 text-[clamp(2rem,5vw,3.25rem)] leading-[1.08] tracking-[-0.03em] md:mt-5">
        {copy.title}
      </h1>
      <p className="page-intro mt-6 max-w-xl text-lg">{copy.subtitle}</p>
      <div className="green-hub-fade-in-delay mt-10">
        <PrimaryButton href="/wizard">{copy.cta}</PrimaryButton>
      </div>
      {secondaryHref && "secondary" in copy ? (
        <nav className="green-hub-fade-in-delay-2 mt-8">
          <Link href={secondaryHref} className="auros-btn auros-btn--link">
            {copy.secondary} →
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
