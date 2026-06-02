"use client";

import { getEnterpriseMessages } from "@/lib/jurisdictions/enterprise-messages";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function StarterKitOnePagerLink({ className }: { className?: string }) {
  const { locale } = useJurisdictionPage();
  const a = getEnterpriseMessages(locale).assetUseCases;
  const href = `/api/jurisdictions/starter-kit-overview/pdf?locale=${locale}`;

  return (
    <div className={className}>
      <a
        href={href}
        className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/70 transition hover:border-white/30 hover:text-white"
      >
        {a.onePagerCta}
      </a>
      <p className="mt-2 text-xs text-white/40">{a.onePagerNote}</p>
    </div>
  );
}
