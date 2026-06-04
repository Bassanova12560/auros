"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_STANDARDS_ROUTE, getGreenMessages } from "@/lib/green";

import { GreenSectionTitle } from "./green-ui";

export function GreenHubWhySection() {
  const { locale } = useLocale();
  const w = getGreenMessages(locale).hub.whyRwa;

  return (
    <section aria-labelledby="green-why-rwa">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <GreenSectionTitle>{w.title}</GreenSectionTitle>
        <Link
          href={GREEN_STANDARDS_ROUTE}
          className="inline-flex min-h-[36px] items-center border border-green-royal/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-green-royal-bright transition hover:border-green-royal hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal"
        >
          {w.rtmsBadge}
        </Link>
      </div>
      <ul className="mt-6 space-y-8 md:grid md:grid-cols-3 md:gap-10 md:space-y-0">
        {w.items.map((item) => (
          <li key={item.title}>
            <p className="font-display text-base font-medium tracking-[-0.01em] text-white">
              {item.title}
            </p>
            <p className="mt-2 text-sm font-light leading-relaxed text-white/45">{item.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
