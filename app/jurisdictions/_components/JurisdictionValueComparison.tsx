"use client";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionValueComparison() {
  const { locale } = useJurisdictionPage();
  const e = getEnterpriseMessages(locale);
  const v = e.valueComparison;
  const cols = v.columns;

  return (
    <section
      id="comparison"
      className="scroll-mt-28 border-t border-white/[0.06] py-16 md:py-24"
    >
      <SectionHeader
        eyebrow={v.eyebrow}
        title={v.title}
        subtitle={v.subtitle}
        align="left"
      />

      <BezelCard className="mt-10 overflow-hidden" innerClassName="p-0" animate>
        <div className="scroll-x-touch">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {cols.feature}
                </th>
                <th className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/70">
                  {cols.auros}
                </th>
                <th className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {cols.lawFirm}
                </th>
                <th className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {cols.diy}
                </th>
              </tr>
            </thead>
            <tbody>
              {v.rows.map((row) => (
                <tr
                  key={row.label}
                  className="border-b border-white/[0.05] last:border-0"
                >
                  <td className="px-5 py-4 font-medium text-white/80">
                    {row.label}
                  </td>
                  <td className="px-5 py-4 text-white/70">{row.auros}</td>
                  <td className="px-5 py-4 text-white/50">{row.lawFirm}</td>
                  <td className="px-5 py-4 text-white/45">{row.diy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BezelCard>

      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/45">
        {v.footnote}
      </p>
    </section>
  );
}
