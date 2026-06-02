"use client";

import type { ReactNode } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getGreenMessages } from "@/lib/green";

type Props = {
  children: ReactNode;
};

export function GreenHubMoreSections({ children }: Props) {
  const { locale } = useLocale();
  const label = getGreenMessages(locale).hub.moreSections.toggle;

  return (
    <details className="group mt-14 border border-white/[0.08] bg-black md:mt-16">
      <summary className="cursor-pointer list-none px-5 py-4 font-mono text-[11px] uppercase tracking-wider text-white/55 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:px-6 [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block text-green-royal-bright transition group-open:rotate-90"
            aria-hidden
          >
            ›
          </span>
          {label}
        </span>
      </summary>
      <div className="border-t border-white/[0.06] px-5 pb-14 pt-2 md:px-6 md:pb-16 [&>section]:mt-12 [&>section:first-child]:mt-8">
        {children}
      </div>
    </details>
  );
}
