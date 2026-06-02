"use client";

import Link from "next/link";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { ACADEMY_ROUTE } from "@/lib/academy/constants";
import { getAcademyMessages } from "@/lib/academy/i18n";

type Props = {
  success: boolean;
};

export function UnsubscribeRemindersView({ success }: Props) {
  const { locale } = useLocale();
  const u = getAcademyMessages(locale).unsubscribe;

  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <BezelCard innerClassName="p-6 md:p-10">
        {success ? (
          <>
            <h1 className="font-display text-2xl font-semibold text-white">{u.titleSuccess}</h1>
            <p className="mt-4 text-sm leading-relaxed text-white/55">{u.bodySuccess}</p>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-semibold text-white">{u.titleInvalid}</h1>
            <p className="mt-4 text-sm leading-relaxed text-white/55">{u.bodyInvalid}</p>
          </>
        )}
        <Link
          href={ACADEMY_ROUTE}
          className="mt-8 inline-block text-sm text-white/50 hover:text-white"
        >
          {u.backLink}
        </Link>
      </BezelCard>
    </div>
  );
}
