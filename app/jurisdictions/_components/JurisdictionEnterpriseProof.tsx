"use client";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionEnterpriseProof() {
  const { locale } = useJurisdictionPage();
  const e = getEnterpriseMessages(locale);
  const p = e.enterpriseProof;

  return (
    <section className="border-t border-white/[0.06] py-16 md:py-24">
      <SectionHeader eyebrow={p.eyebrow} title={p.title} align="left" />

      <div className="green-hub-fade-in mt-10 grid gap-4 md:grid-cols-3">
        {p.cases.map((item) => (
          <div key={item.name}>
            <BezelCard innerClassName="flex h-full flex-col p-6 md:p-7" animate>
              <p className="flex-1 text-sm leading-relaxed text-white/65">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-6 border-t border-white/[0.06] pt-5">
                <p className="font-medium text-white">{item.name}</p>
                <p className="mt-1 text-xs text-white/45">{item.role}</p>
                <p className="mt-3 inline-block rounded-full bg-emerald-400/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-emerald-300/80">
                  {item.metric}
                </p>
              </div>
            </BezelCard>
          </div>
        ))}
      </div>
    </section>
  );
}
