"use client";

import { BezelCard } from "@/app/_components/ui/BezelCard";
import { SectionHeader } from "@/app/_components/ui/SectionHeader";
import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";
import {
  STARTER_KIT_PRICE_EUR,
  STARTER_KIT_VALUE_STACK,
  starterKitMarketTotal,
  starterKitSavingsPercent,
} from "@/lib/jurisdictions/starter-kit-value";

import { useJurisdictionPage } from "./useJurisdictionPage";

function formatEur(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function JurisdictionValueStack({ compact }: { compact?: boolean }) {
  const { locale } = useJurisdictionPage();
  const v = getEnterpriseMessages(locale).valueStack;
  const localeTag = locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR";
  const marketTotal = starterKitMarketTotal();
  const savings = starterKitSavingsPercent();

  if (compact) {
    return (
      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/35 line-through decoration-white/25">
          {formatEur(marketTotal, localeTag)}
        </p>
        <p className="font-display text-lg text-emerald-300/90">
          {formatEur(STARTER_KIT_PRICE_EUR, localeTag)}
        </p>
        <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-300/75">
          {v.savings(savings)}
        </span>
      </div>
    );
  }

  return (
    <section
      id="value-stack"
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
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="px-5 py-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {v.columnDeliverable}
                </th>
                <th className="px-5 py-4 text-right font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {v.columnMarket}
                </th>
              </tr>
            </thead>
            <tbody>
              {STARTER_KIT_VALUE_STACK.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-white/[0.05] last:border-0"
                >
                  <td className="px-5 py-3.5 text-white/70">
                    {v.items[row.labelKey] ?? row.labelKey}
                  </td>
                  <td className="px-5 py-3.5 text-right tabular-nums text-white/45">
                    {formatEur(row.marketValueEur, localeTag)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-white/[0.1] bg-white/[0.02]">
                <td className="px-5 py-4 font-medium text-white/80">
                  {v.totalMarket}
                </td>
                <td className="px-5 py-4 text-right font-display text-lg tabular-nums text-white/50 line-through decoration-white/30">
                  {formatEur(marketTotal, localeTag)}
                </td>
              </tr>
              <tr className="bg-emerald-400/[0.04]">
                <td className="px-5 py-4 font-medium text-emerald-300/90">
                  {v.yourPrice}
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="font-display text-2xl tabular-nums text-white">
                    {formatEur(STARTER_KIT_PRICE_EUR, localeTag)}
                  </span>
                  <span className="ml-3 rounded-full bg-emerald-400/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-emerald-300/80">
                    {v.savings(savings)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </BezelCard>

      <p className="mt-5 max-w-3xl text-xs leading-relaxed text-white/40">
        {v.footnote}
      </p>
    </section>
  );
}

export function ValueStackSummaryLine() {
  const { locale } = useJurisdictionPage();
  const v = getEnterpriseMessages(locale).valueStack;
  const localeTag = locale === "en" ? "en-GB" : locale === "es" ? "es-ES" : "fr-FR";
  const marketTotal = starterKitMarketTotal();
  const savings = starterKitSavingsPercent();

  return (
    <p className="text-sm text-white/50">
      <span className="line-through decoration-white/25">
        {formatEur(marketTotal, localeTag)}
      </span>
      {" → "}
      <span className="font-medium text-emerald-300/85">
        {formatEur(STARTER_KIT_PRICE_EUR, localeTag)}
      </span>
      <span className="ml-2 font-mono text-[10px] text-emerald-300/60">
        ({v.savings(savings)})
      </span>
    </p>
  );
}
