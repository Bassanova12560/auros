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
    <details className="group mt-12 md:mt-16">
      <summary className="cursor-pointer list-none py-3 font-mono text-[11px] uppercase tracking-wider text-white/40 transition-colors duration-300 hover:text-white/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block text-green-royal-bright transition-transform duration-300 group-open:rotate-90"
            aria-hidden
          >
            ›
          </span>
          {label}
        </span>
      </summary>
      <div className="pb-10 pt-6 md:pb-14 [&>section]:mt-14 [&>section:first-child]:mt-8 [&>figure]:mt-14 [&>blockquote]:mt-14 [&>div]:mt-14 [&>p]:mt-14">
        {children}
      </div>
    </details>
  );
}
