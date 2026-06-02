"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_REGISTRY_ROUTE, getGreenMessages } from "@/lib/green";

export function GreenHubQuote() {
  const { locale } = useLocale();
  const q = getGreenMessages(locale).hub.quote;

  return (
    <figure className="mt-10 max-w-2xl border border-white/[0.08] bg-black px-5 py-6 md:px-7 md:py-7">
      <blockquote className="text-base leading-[1.7] text-white/75 md:text-lg">
        « {q.text} »
      </blockquote>
      <figcaption className="mt-4 space-y-2">
        <p className="font-display text-sm font-medium text-white/50">{q.attribution}</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
          {q.disclaimerLabel}
        </p>
        <Link
          href={GREEN_REGISTRY_ROUTE}
          className="inline-flex min-h-[44px] items-center font-mono text-[11px] tracking-wide text-green-royal-bright transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal"
        >
          {q.registryCta} →
        </Link>
      </figcaption>
    </figure>
  );
}
