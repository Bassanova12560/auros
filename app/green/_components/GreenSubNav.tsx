"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_API_DOCS_ROUTE } from "@/lib/green/api/constants";
import {
  AUROS_WIZARD_ROUTE,
  GREEN_COMPARE_ROUTE,
  GREEN_LABEL_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_REGISTRY_ROUTE,
  getGreenMessages,
} from "@/lib/green";

/** Max 5 primary destinations — rest live on hub secondary links. */
const NAV_ROUTES = [
  { href: GREEN_MARKET_ROUTE, key: "market" as const },
  { href: GREEN_REGISTRY_ROUTE, key: "registry" as const },
  { href: GREEN_COMPARE_ROUTE, key: "compare" as const },
  { href: GREEN_LABEL_ROUTE, key: "label" as const },
  { href: `${AUROS_WIZARD_ROUTE}?asset=renewable`, key: "tokenize" as const },
] as const;

export function GreenSubNav() {
  const { locale } = useLocale();
  const nav = getGreenMessages(locale).header.nav;

  return (
    <nav
      aria-label={nav.ariaLabel}
      className="border-b border-white/[0.08] bg-green-page/95 px-4 py-2.5 backdrop-blur-md md:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-1">
        {NAV_ROUTES.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className="font-mono text-[10px] uppercase tracking-wider text-white/40 transition hover:text-green-royal-bright"
          >
            {nav[route.key]}
          </Link>
        ))}
        <Link
          href={GREEN_API_DOCS_ROUTE}
          className="ml-auto font-mono text-[10px] uppercase tracking-wider text-white/30 transition hover:text-white/55"
        >
          {nav.api}
        </Link>
      </div>
    </nav>
  );
}
