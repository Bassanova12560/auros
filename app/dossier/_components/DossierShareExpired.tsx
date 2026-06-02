"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getDossierMessages } from "@/lib/dossier-i18n";

export function DossierShareExpired() {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center text-white">
      <p className="text-lg text-white/90">{dm.shared.expiredTitle}</p>
      <p className="mt-2 text-sm text-muted">{dm.shared.expiredBody}</p>
      <Link
        href="/wizard"
        className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-void"
      >
        {dm.shared.expiredCta}
      </Link>
    </main>
  );
}
