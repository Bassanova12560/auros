"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getProfessionalTrustMessages } from "@/lib/professional-trust-i18n";

type Variant = "inline" | "panel";

export function ProfessionalTrustBar({ variant = "inline" }: { variant?: Variant }) {
  const { locale } = useLocale();
  const t = getProfessionalTrustMessages(locale);

  if (variant === "panel") {
    return (
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
          {t.eyebrow}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/65">{t.body}</p>
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] text-white/40">
          {t.badges.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <p className="text-center font-mono text-[10px] leading-relaxed tracking-wide text-white/35">
      {t.badges.join("  ·  ")}
    </p>
  );
}
