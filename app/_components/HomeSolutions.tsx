"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getArlUi } from "@/lib/arl/ui-i18n";

/**
 * Homepage solutions — one card per audience, locale-aware.
 */
export function HomeSolutions() {
  const { locale } = useLocale();
  const m = getArlUi(locale).homeSolutions;

  return (
    <section id="solutions" className="scroll-mt-24 px-4 py-14 md:px-6" aria-label={m.title}>
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          {m.eyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">{m.title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">{m.intro}</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {m.doors.map((s) => (
            <li
              key={s.who}
              className="flex flex-col border border-white/[0.08] bg-white/[0.02] px-5 py-5"
            >
              <p className="font-display text-lg text-white">{s.who}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">{s.plain}</p>
              <Link
                href={s.href}
                className="mt-6 inline-flex font-mono text-[11px] uppercase tracking-wider text-white/70 underline-offset-4 hover:text-white hover:underline"
              >
                {s.cta} →
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 space-y-1 text-xs text-white/35">
          <span className="block">
            {m.dossierHint}{" "}
            <Link href="/start" className="underline-offset-2 hover:underline">
              {m.dossierCta}
            </Link>
            .
          </span>
          <span className="block">
            {m.compareHint}{" "}
            <Link href="/compare" className="underline-offset-2 hover:underline">
              {m.compareCta}
            </Link>
            .
          </span>
        </p>
      </div>
    </section>
  );
}
