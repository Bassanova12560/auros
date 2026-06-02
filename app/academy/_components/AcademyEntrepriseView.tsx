"use client";

import Link from "next/link";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { InstitutionDiplomaPurchase } from "@/app/academy/_components/InstitutionDiplomaPurchase";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { ACADEMY_ROUTE } from "@/lib/academy";
import { getAcademyMessages } from "@/lib/academy/i18n";

export function AcademyEntrepriseView() {
  const { locale } = useLocale();
  const m = getAcademyMessages(locale);

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <BezelCard innerClassName="p-6 md:p-10">
        <h1 className="font-display text-3xl font-semibold text-white">{m.entreprise.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/55">{m.entreprise.intro}</p>
        <InstitutionDiplomaPurchase />
        <p className="mt-8 text-xs text-white/40">{m.entreprise.teamNote}</p>
        <Link
          href={ACADEMY_ROUTE}
          className="mt-8 inline-block text-sm text-white/50 hover:text-white"
        >
          {m.entreprise.back}
        </Link>
        <p className="mt-8 text-xs text-white/35">{m.disclaimer}</p>
      </BezelCard>
    </div>
  );
}
