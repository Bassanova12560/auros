"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { isComparatorPath } from "@/lib/comparators";
import {
  readCookieChoice,
  saveCookieChoice,
  type CookieChoice,
} from "@/lib/cookie-consent";
import { getCookieBannerMessages } from "@/lib/cookie-i18n";

export function CookieBanner() {
  const { locale } = useLocale();
  const pathname = usePathname();
  const cm = getCookieBannerMessages(locale);
  const [choice, setChoice] = useState<CookieChoice>(null);
  const [mounted, setMounted] = useState(false);
  const onComparator = isComparatorPath(pathname);

  useEffect(() => {
    setChoice(readCookieChoice());
    setMounted(true);
  }, []);

  if (!mounted || choice !== null) return null;

  const accept = () => {
    saveCookieChoice("accepted");
    setChoice("accepted");
    window.dispatchEvent(new Event("auros-cookie-consent"));
  };

  const decline = () => {
    saveCookieChoice("declined");
    setChoice("declined");
    window.dispatchEvent(new Event("auros-cookie-consent"));
  };

  return (
    <div
      role="dialog"
      aria-label={cm.aria}
      className={`fixed left-0 right-0 z-[100] border-t border-white bg-void px-4 py-4 md:bottom-0 md:px-6 ${
        onComparator
          ? "bottom-[4.75rem] pb-[max(0.5rem,env(safe-area-inset-bottom))] md:pb-4"
          : "bottom-0"
      }`}
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-sm leading-relaxed text-white/80">{cm.body}</p>
        <div className="flex shrink-0 items-center gap-4">
          <button
            type="button"
            onClick={decline}
            className="text-sm text-white/60 underline-offset-4 transition hover:text-white hover:underline"
          >
            {cm.decline}
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-void transition hover:bg-accent/90"
          >
            {cm.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
