"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GreenImpactReportCta } from "@/app/green/_components/GreenImpactReportCta";
import { GREEN_IMPACT_REPORT_ROUTE } from "@/lib/green/constants";
import { getGreenImpactReportCopy } from "@/lib/green/impact-report-i18n";

export function GreenImpactReportView() {
  const { locale } = useLocale();
  const copy = getGreenImpactReportCopy(locale);
  const searchParams = useSearchParams();
  const cancelled = searchParams.get("cancelled") === "impact_report";

  return (
    <div className="space-y-8 py-8 md:py-12">
      {cancelled ? (
        <div
          role="status"
          className="rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-4 py-3 text-sm text-amber-200/90"
        >
          {copy.checkoutCancelled.message}{" "}
          <Link href={GREEN_IMPACT_REPORT_ROUTE} className="text-amber-100 underline">
            {copy.checkoutCancelled.retryLink}
          </Link>
        </div>
      ) : null}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-500/70">
          AUROS Green
        </p>
        <h1 className="mt-4 text-2xl font-light text-white md:text-3xl">{copy.page.title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
          {copy.page.subtitle}
        </p>
      </div>
      <GreenImpactReportCta />
    </div>
  );
}
