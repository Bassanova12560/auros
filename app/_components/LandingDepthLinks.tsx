"use client";

import Link from "next/link";

import { useLocale } from "./i18n/LocaleProvider";
import { getEaseMessages } from "@/lib/ease-i18n";

const secondaryLinkClass =
  "font-mono text-[11px] tracking-wide text-white/40 transition-colors duration-300 hover:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function LandingDepthLinks() {
  const { locale } = useLocale();
  const m = getEaseMessages(locale).depthLinks;

  return (
    <nav
      className="border-t border-white/[0.06] px-6 py-12 md:py-16"
      aria-label={m.ariaLabel}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
          {m.eyebrow}
        </p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          {m.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={secondaryLinkClass}>
                {link.label} →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
