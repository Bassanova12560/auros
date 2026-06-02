"use client";

import Link from "next/link";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { AUROS_ORG } from "@/lib/ai-first/org";
import { ACADEMY_ROUTE } from "@/lib/academy";
import { getAcademyMessages } from "@/lib/academy/i18n";

export function AcademyPraticienView() {
  const { locale } = useLocale();
  const m = getAcademyMessages(locale);

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-16 pt-10 md:px-6">
      <BezelCard innerClassName="p-6 md:p-10">
        <h1 className="font-display text-3xl font-semibold text-white">{m.praticien.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/55">{m.praticien.intro}</p>
        <ul className="mt-8 space-y-2 text-sm text-white/45">
          {m.praticien.bullets.map((item) => (
            <li key={item}>· {item}</li>
          ))}
        </ul>
        <p className="mt-8">
          <a
            href={`mailto:${AUROS_ORG.contactEmail}?subject=${encodeURIComponent(m.mailto.praticienSubject)}`}
            className="text-sm text-white/60 hover:text-white/80"
          >
            {m.praticien.notify}
          </a>
        </p>
        <Link
          href={ACADEMY_ROUTE}
          className="mt-8 inline-block text-sm text-white/50 hover:text-white"
        >
          {m.praticien.back}
        </Link>
        <p className="mt-8 text-xs text-white/35">{m.disclaimer}</p>
      </BezelCard>
    </div>
  );
}
