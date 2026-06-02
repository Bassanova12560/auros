"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getGreenMessages } from "@/lib/green";

import { GreenSectionTitle } from "./green-ui";

export function GreenHubParticipateSection() {
  const { locale } = useLocale();
  const p = getGreenMessages(locale).hub.participate;

  return (
    <section className="mt-14 md:mt-16" aria-labelledby="green-participate">
      <GreenSectionTitle>{p.title}</GreenSectionTitle>
      <p id="green-participate" className="mt-3 max-w-2xl text-base leading-relaxed text-white/55">
        {p.intro}
      </p>

      <div className="mt-8 grid gap-px border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
        {p.items.map((item) => (
          <article
            key={item.href}
            className="flex flex-col justify-between bg-black px-5 py-6 md:px-6 md:py-7"
          >
            <div>
              <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/45">{item.body}</p>
            </div>
            <Link
              href={item.href}
              className="mt-5 inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-green-royal-bright transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal"
            >
              {item.cta} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
