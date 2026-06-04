"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_REGISTRY_ROUTE, getGreenMessages } from "@/lib/green";

export function GreenHubQuote() {
  const { locale } = useLocale();
  const q = getGreenMessages(locale).hub.quote;

  return (
    <figure className="max-w-2xl">
      <blockquote className="text-base font-light leading-[1.75] text-white/65 md:text-lg">
        « {q.text} »
      </blockquote>
      <figcaption className="mt-5 space-y-2">
        <p className="font-display text-sm font-light text-white/45">{q.attribution}</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/30">
          {q.disclaimerLabel}
        </p>
        <Link
          href={GREEN_REGISTRY_ROUTE}
          className="inline-flex min-h-[44px] items-center font-mono text-[11px] tracking-wide text-white/45 transition-colors duration-300 hover:text-green-royal-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal"
        >
          {q.registryCta} →
        </Link>
      </figcaption>
    </figure>
  );
}
