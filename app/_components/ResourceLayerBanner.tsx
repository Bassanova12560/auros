"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getArlUi } from "@/lib/arl/ui-i18n";

/**
 * Homepage continuation — same liquidity engine, next frontier (locale-aware).
 */
export function ResourceLayerBanner() {
  const { locale } = useLocale();
  const b = getArlUi(locale).banner;

  return (
    <section
      className="border-y border-white/[0.06] px-4 py-8 md:px-6"
      aria-label={b.eyebrow}
    >
      <div className="mx-auto max-w-6xl space-y-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          {b.eyebrow}
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-xl text-white md:text-2xl">{b.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              {b.bodyBefore}{" "}
              <Link href="/watt" className="text-white/70 underline-offset-2 hover:underline">
                WATT
              </Link>{" "}
              {b.bodyAfter}
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            {b.links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}
