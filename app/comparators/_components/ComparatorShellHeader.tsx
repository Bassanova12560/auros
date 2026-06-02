"use client";

import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/app/_components/i18n/LanguageSwitcher";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { ComparatorBrand } from "./ComparatorBrand";
import { ComparatorNavDropdown } from "./ComparatorNavDropdown";
import { useComparatorPage } from "./useComparatorPage";
import { DOSSIER_CTA } from "@/lib/comparators";
import { track } from "@/lib/analytics";

export function ComparatorShellHeader() {
  const { messages, comparatorId } = useComparatorPage();
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
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:gap-4 md:px-6 md:py-4 md:pt-4">
        <ComparatorBrand />
        <ComparatorNavDropdown />

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
                source: "navbar",
                comparator: comparatorId,
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
