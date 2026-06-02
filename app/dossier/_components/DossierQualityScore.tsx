"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  calculateDossierQuality,
  type DossierQualityInput,
} from "@/lib/dossier-quality";
import { getDossierMessages } from "@/lib/dossier-i18n";

export function DossierQualityScore({ data }: { data: DossierQualityInput }) {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);
  const result = useMemo(() => calculateDossierQuality(data), [data]);
  const [fillReady, setFillReady] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setFillReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const badgeLabel =
    result.percent >= 90
      ? dm.quality.badges.strong
      : result.percent >= 75
        ? dm.quality.badges.good
        : dm.quality.badges.needs;

  const missingShown = result.missing.slice(0, 3);

  return (
    <section className="border-b border-white/[0.06] py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
          {dm.quality.title}
        </span>
        <span className="text-2xl font-semibold text-white">{result.percent}%</span>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white transition-all duration-700 ease-out"
          style={{
            width: fillReady ? `${result.percent}%` : "0%",
          }}
        />
      </div>

      <p className="mt-3 text-xs uppercase tracking-wider text-white/50">
        {badgeLabel}
      </p>

      {missingShown.length > 0 ? (
        <ul className="mt-4 space-y-2 text-sm text-secondary">
          {missingShown.map((m) => {
            const copy = dm.quality.items[m.key];
            return (
              <li key={m.key}>
                <span className="text-white/70">
                  {copy?.label ?? m.label}
                </span>
                <span className="text-white/40">
                  {" "}
                  — {copy?.tip ?? m.tip}
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-white">{dm.quality.complete}</p>
      )}

      {result.percent < 100 ? (
        <Link
          href="/wizard"
          className="mt-4 inline-block text-sm text-white underline-offset-2 hover:underline"
        >
          {dm.quality.improve} →
        </Link>
      ) : null}
    </section>
  );
}
