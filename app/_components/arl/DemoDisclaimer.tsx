"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getArlUi } from "@/lib/arl/ui-i18n";

/** Shown on ARL surfaces — lab ledger is live; chain settlement is not. */
export function DemoDisclaimer() {
  const { locale } = useLocale();
  const text = getArlUi(locale).disclaimer;
  return (
    <p className="rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 font-mono text-[11px] leading-relaxed text-amber-200/80">
      {text}
    </p>
  );
}
