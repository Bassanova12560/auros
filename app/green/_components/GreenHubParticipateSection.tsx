"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getGreenMessages } from "@/lib/green";

import { GreenSectionTitle } from "./green-ui";

export function GreenHubParticipateSection() {
  const { locale } = useLocale();
  const p = getGreenMessages(locale).hub.participate;

  return (
    <section aria-labelledby="green-participate">
      <GreenSectionTitle>{p.title}</GreenSectionTitle>
      <p
        id="green-participate"
        className="mt-4 max-w-2xl text-base font-light leading-relaxed text-white/50"
      >
        {p.intro}
      </p>

      <ul className="mt-8 space-y-10 md:grid md:grid-cols-3 md:gap-10 md:space-y-0">
        {p.items.map((item) => (
          <li key={item.href} className="flex flex-col justify-between">
            <div>
              <h3 className="font-display text-base font-medium text-white">{item.title}</h3>
              <p className="mt-2 text-sm font-light leading-relaxed text-white/45">{item.body}</p>
            </div>
            <Link
              href={item.href}
              className="mt-5 inline-flex min-h-[44px] items-center font-mono text-[11px] tracking-wide text-white/45 transition-colors duration-300 hover:text-green-royal-bright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-royal"
            >
              {item.cta} →
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
