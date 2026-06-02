"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GreenRtmsPanel } from "@/app/wizard/_components/GreenRtmsPanel";
import type { GreenRtmsScore } from "@/lib/green/rtms-scoring";
import {
  GREEN_LABEL_ROUTE,
  GREEN_MARKET_ROUTE,
  GREEN_REGISTER_ROUTE,
} from "@/lib/green/constants";

type Props = {
  rtms: GreenRtmsScore;
};

export function GreenDossierExtras({ rtms }: Props) {
  const { locale } = useLocale();
  const copy = {
    fr: {
      title: "Suite AUROS Green",
      market: "Place de marché",
      label: "Candidater au label Verified",
      register: "Référencer mon acteur",
      my: "Mes fiches",
    },
    en: {
      title: "AUROS Green next steps",
      market: "Marketplace",
      label: "Apply for Verified label",
      register: "Register my actor",
      my: "My listings",
    },
    es: {
      title: "Siguiente paso AUROS Green",
      market: "Marketplace",
      label: "Solicitar label Verified",
      register: "Registrar mi actor",
      my: "Mis fichas",
    },
  }[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  const linkClass =
    "rounded-full border border-emerald-500/40 px-4 py-2 text-xs font-medium text-emerald-400 transition hover:border-emerald-400 hover:bg-emerald-500/10";

  return (
    <section className="mb-10 space-y-6">
      <GreenRtmsPanel rtms={rtms} />
      <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.03] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-emerald-500/70">
          {copy.title}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={GREEN_MARKET_ROUTE} className={linkClass}>
            {copy.market}
          </Link>
          <Link href={GREEN_LABEL_ROUTE} className={linkClass}>
            {copy.label}
          </Link>
          <Link href={GREEN_REGISTER_ROUTE} className={linkClass}>
            {copy.register}
          </Link>
          <Link href="/green/my" className={linkClass}>
            {copy.my}
          </Link>
        </div>
      </div>
    </section>
  );
}
