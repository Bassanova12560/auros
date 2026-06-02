"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useComparatorPage } from "./useComparatorPage";
import {
  COMPARATOR_REGISTRY,
  COMPARATOR_ROUTES,
  isCompareHubPath,
} from "@/lib/comparators";
import { JURISDICTIONS_ROUTE } from "@/lib/jurisdictions";
import { footerDisclaimerForId } from "@/lib/comparators/page-copy";

export function ComparatorFooter() {
  const pathname = usePathname();
  const { messages, tabLabel, entry } = useComparatorPage();
  const year = new Date().getFullYear();
  const isCompareHub = isCompareHubPath(pathname);
  const pageDisclaimer = footerDisclaimerForId(
    messages,
    entry?.id,
    isCompareHub
  );

  return (
    <footer className="border-t border-white/[0.06] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {COMPARATOR_REGISTRY.filter((c) => !c.soon && c.href !== pathname).map(
            (c) => (
              <Link
                key={c.id}
                href={c.href}
                className="font-mono text-[10px] text-white/40 transition hover:text-white"
              >
                {tabLabel(c.id)}
              </Link>
            )
          )}
          {!isCompareHub ? (
            <Link
              href={COMPARATOR_ROUTES.compare}
              className="font-mono text-[10px] text-white/40 transition hover:text-white"
            >
              {messages.navDropdown.compareAll}
            </Link>
          ) : null}
          {pathname !== JURISDICTIONS_ROUTE ? (
            <Link
              href={JURISDICTIONS_ROUTE}
              className="font-mono text-[10px] text-white/40 transition hover:text-white"
            >
              {messages.navDropdown.jurisdictions}
            </Link>
          ) : null}
          <span className="hidden h-3 w-px bg-white/10 sm:block" aria-hidden />
          <Link
            href="/wizard"
            className="font-mono text-[10px] text-white/40 transition hover:text-white"
          >
            {messages.footer.dossier}
          </Link>
          <Link
            href="/legal"
            className="font-mono text-[10px] text-white/40 transition hover:text-white"
          >
            {messages.footer.legal}
          </Link>
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-white/30">
          {pageDisclaimer}
        </p>

        {isCompareHub ? (
          <div className="mt-8 border-t border-white/[0.06] pt-8">
            <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
              {messages.compareHub.ecosystem.title}
            </p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              <Link
                href="/wizard"
                className="font-mono text-[10px] text-white/40 transition hover:text-white"
              >
                {messages.compareHub.ecosystem.dossier}
              </Link>
              <Link
                href="/dashboard"
                className="font-mono text-[10px] text-white/40 transition hover:text-white"
              >
                {messages.compareHub.ecosystem.dashboard}
              </Link>
              <Link
                href="/#score"
                className="font-mono text-[10px] text-white/40 transition hover:text-white"
              >
                {messages.compareHub.ecosystem.score}
              </Link>
              <Link
                href="/jurisdictions?from=compare"
                className="font-mono text-[10px] text-white/40 transition hover:text-white"
              >
                {messages.compareHub.ecosystem.jurisdictions}
              </Link>
              <Link
                href="/partners"
                className="font-mono text-[10px] text-white/40 transition hover:text-white"
              >
                {messages.compareHub.ecosystem.partners}
              </Link>
            </div>
          </div>
        ) : null}

        <p className="mt-4 font-mono text-[10px] text-white/20">
          © {year} AUROS
        </p>
      </div>
    </footer>
  );
}
