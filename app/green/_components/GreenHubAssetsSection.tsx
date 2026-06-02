"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_COMPARE_ROUTE, GREEN_GUIDE_ROUTE, getGreenMessages } from "@/lib/green";

import { GreenSectionTitle } from "./green-ui";

export function GreenHubAssetsSection() {
  const { locale } = useLocale();
  const a = getGreenMessages(locale).hub.eligibleAssets;

  return (
    <section aria-labelledby="green-eligible-assets">
      <GreenSectionTitle>{a.title}</GreenSectionTitle>
      <p id="green-eligible-assets" className="mt-3 max-w-2xl text-base leading-relaxed text-white/55">
        {a.intro}
      </p>

      <div className="mt-8 grid gap-px border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2">
        {a.items.map((item) => (
          <article key={item.id} className="bg-black px-5 py-5 md:px-6 md:py-6">
            <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/45">{item.body}</p>
          </article>
        ))}
      </div>

      <p className="mt-6 flex flex-wrap gap-4">
        <Link
          href={GREEN_COMPARE_ROUTE}
          className="font-mono text-[11px] tracking-wide text-white/45 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {a.compareCta} →
        </Link>
        <Link
          href={GREEN_GUIDE_ROUTE}
          className="font-mono text-[11px] tracking-wide text-green-royal-bright transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal"
        >
          {a.guideCta} →
        </Link>
      </p>
    </section>
  );
}
