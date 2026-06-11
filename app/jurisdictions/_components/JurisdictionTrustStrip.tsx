"use client";

import { useJurisdictionPage } from "./useJurisdictionPage";

export function JurisdictionTrustStrip() {
  const { messages } = useJurisdictionPage();

  return (
    <section
      className="green-hub-fade-in border-y border-white/[0.06] py-5"
      aria-label="Trust"
    >
      <p className="text-center font-mono text-[10px] leading-relaxed tracking-wide text-white/35">
        {messages.trust.badges.join("  ·  ")}
      </p>
    </section>
  );
}
