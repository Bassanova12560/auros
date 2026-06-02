"use client";

import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionRoiStrip() {
  const { locale } = useJurisdictionPage();
  const r = getEnterpriseMessages(locale).roiFraming;

  return (
    <section className="border-t border-white/[0.06] py-12 md:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
        {r.eyebrow}
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold text-white md:text-3xl">
        {r.title}
      </h2>

      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {r.items.map((item) => (
          <li
            key={item.label}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 md:p-6"
          >
            <p className="font-display text-3xl tabular-nums text-emerald-300/90">
              {item.metric}
            </p>
            <p className="mt-2 font-medium text-white/85">{item.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              {item.detail}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
