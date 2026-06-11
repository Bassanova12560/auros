"use client";

import { useTranslations } from "@/app/_components/i18n/LocaleProvider";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionTrustStrip() {
  const { messages } = useJurisdictionPage();
  const t = useTranslations();

  return (
    <section
      className="green-hub-fade-in border-y border-white/[0.06] py-5"
      aria-label={t.footer.trust}
    >
      <p className="text-center font-mono text-[10px] leading-relaxed tracking-wide text-white/35">
        {messages.trust.badges.join("  ·  ")}
      </p>
    </section>
  );
}
