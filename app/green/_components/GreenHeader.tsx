"use client";

import Link from "next/link";

import { LanguageSwitcher } from "@/app/_components/i18n/LanguageSwitcher";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_LABEL_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_REGISTRY_ROUTE,
  GREEN_ROUTE,
  GREEN_STANDARDS_ROUTE,
  getGreenMessages,
} from "@/lib/green";

import { GreenForestWord } from "./green-ui";

const NAV_ROUTES = [
  { href: GREEN_MARKET_ROUTE, key: "market" as const },
  { href: GREEN_STANDARDS_ROUTE, key: "standards" as const },
  { href: GREEN_REGISTRY_ROUTE, key: "registry" as const },
  { href: GREEN_LABEL_ROUTE, key: "label" as const },
];

export function GreenHeader({ compact = false }: { compact?: boolean }) {
  const { locale } = useLocale();
  const nav = getGreenMessages(locale).header.nav;

  return (
    <header
      className={
        compact
          ? "border-b border-white/[0.08] px-4 py-4 md:px-6"
          : "border-b border-white/[0.08] px-6 py-5"
      }
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <Link href={GREEN_ROUTE} className="group flex min-w-0 items-baseline gap-2">
          <span className="font-display text-xs font-semibold tracking-[0.35em] text-white">
            AUROS
          </span>
          <GreenForestWord
            size="sm"
            className="font-display text-xs font-semibold tracking-[0.12em]"
          />
        </Link>
        <nav
          aria-label={nav.ariaLabel}
          className="order-last flex w-full flex-wrap gap-x-4 gap-y-1 sm:order-none sm:w-auto sm:justify-center"
        >
          {NAV_ROUTES.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              className="font-mono text-[10px] uppercase tracking-wider text-white/40 transition hover:text-green-royal-bright"
            >
              {nav[key]}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <LanguageSwitcher ariaLabel="Language" />
          <Link
            href="/"
            className="font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white"
          >
            auros.app →
          </Link>
        </div>
      </div>
    </header>
  );
}
