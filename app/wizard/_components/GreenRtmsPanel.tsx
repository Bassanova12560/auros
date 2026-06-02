"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  GREEN_RTMS_PILLARS,
  GREEN_STANDARDS_ROUTE,
  getGreenMessages,
} from "@/lib/green";
import type { GreenRtmsScore } from "@/lib/green/rtms-scoring";

type Props = {
  rtms: GreenRtmsScore;
};

const TIER_COPY = {
  fr: {
    early: "Dossier RTMS — démarrage",
    progress: "Dossier RTMS — en progression",
    ready: "Dossier RTMS — prêt pour revue",
  },
  en: {
    early: "RTMS dossier — early stage",
    progress: "RTMS dossier — in progress",
    ready: "RTMS dossier — review-ready",
  },
  es: {
    early: "Dossier RTMS — inicio",
    progress: "Dossier RTMS — en progreso",
    ready: "Dossier RTMS — listo para revisión",
  },
} as const;

export function GreenRtmsPanel({ rtms }: Props) {
  const { locale } = useLocale();
  const m = getGreenMessages(locale);
  const tierCopy = TIER_COPY[locale === "fr" ? "fr" : locale === "es" ? "es" : "en"];

  return (
    <div className="mt-8 rounded-2xl border border-emerald-500/35 bg-emerald-500/[0.04] p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/70">
            {m.hub.widgets.rtms.label}
          </p>
          <p className="mt-1 text-sm text-neutral-300">{m.hub.widgets.rtms.subtitle}</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-3xl tabular-nums text-emerald-400">{rtms.overall}</p>
          <p className="mt-1 text-xs text-neutral-400">{tierCopy[rtms.tier]}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {GREEN_RTMS_PILLARS.map((pillar) => {
          const pillarMeta = m.standards.pillars[pillar];
          const score = rtms.pillars[pillar].score;
          return (
            <div
              key={pillar}
              className="rounded-xl border border-emerald-500/20 bg-black/40 px-4 py-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-emerald-300">{pillarMeta.name}</p>
                <p className="font-mono text-xs tabular-nums text-emerald-500/80">{score}%</p>
              </div>
              <p className="mt-1 text-xs text-neutral-500">{pillarMeta.tagline}</p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-emerald-950">
                <div
                  className="h-full rounded-full bg-emerald-500/80"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <Link
        href={GREEN_STANDARDS_ROUTE}
        className="mt-5 inline-flex text-xs uppercase tracking-wider text-emerald-500/70 hover:text-emerald-400"
      >
        {m.hub.widgets.rtms.cta} →
      </Link>
    </div>
  );
}
