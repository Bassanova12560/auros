"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/app/_components/i18n/LanguageSwitcher";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { useJurisdictionPage } from "./useJurisdictionPage";
import { COMPARATOR_ROUTES, DOSSIER_CTA } from "@/lib/comparators";
import { JURISDICTIONS_ROUTE } from "@/lib/jurisdictions";
import { track } from "@/lib/analytics";

export function JurisdictionHeader() {
  const { messages } = useJurisdictionPage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/[0.08] bg-void/95 backdrop-blur-xl"
          : "border-white/[0.06] bg-void/90 backdrop-blur-md md:border-transparent md:bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:gap-4 md:px-6 md:py-4 md:pt-4">
        <Link href={JURISDICTIONS_ROUTE} className="group flex items-center gap-3">
          <span className="font-display text-xs font-semibold tracking-[0.35em] text-white">
            AUROS
          </span>
          <span className="h-3 w-px bg-white/15" aria-hidden />
          <span className="font-mono text-[10px] lowercase tracking-wide text-white/45 transition group-hover:text-white/70">
            {messages.tool}
          </span>
        </Link>

        <Link
          href={COMPARATOR_ROUTES.compare}
          className="ml-2 hidden font-mono text-[10px] text-white/40 transition hover:text-white lg:inline"
        >
          {messages.nav.compareInvest}
        </Link>

        <div className="ml-auto flex shrink-0 items-center gap-2 md:gap-3">
          <LanguageSwitcher
            ariaLabel={messages.languageAria}
            className="scale-90 md:scale-100"
          />
          <PrimaryButton
            href={DOSSIER_CTA.href}
            className="hidden !px-5 !py-2.5 !text-xs sm:inline-flex"
            onClick={() =>
              track("comparator_dossier_cta", {
                source: "jurisdictions_navbar",
                comparator: "jurisdictions",
              })
            }
          >
            <span className="hidden lg:inline">{messages.nav.dossierCta}</span>
            <span className="lg:hidden">{messages.nav.dossierShort}</span>
          </PrimaryButton>
        </div>
      </div>
    </header>
  );
}
