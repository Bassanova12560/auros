"use client";

import { useTranslations } from "./i18n/LocaleProvider";
import { WIZARD_JURISDICTION_COUNT } from "@/lib/wizard-countries";

export function TrustStrip() {
  const t = useTranslations();
  const items = [
    t.trust.mica,
    t.trust.gdpr,
    t.trust.kyc,
    `${WIZARD_JURISDICTION_COUNT} ${t.trust.jurisdictions}`,
  ];

  return (
    <section className="px-6 py-8" aria-label="Compliance">
      <p className="text-center font-mono text-[10px] text-white/30">
        {items.join("  ·  ")}
      </p>
    </section>
  );
}
