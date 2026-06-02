"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getDossierMessages } from "@/lib/dossier-i18n";

/** AI / legal disclaimer block (GDPR + transparency). */
export function AiDisclaimer({ className = "" }: { className?: string }) {
  const { locale } = useLocale();
  const dm = getDossierMessages(locale);

  return (
    <p
      className={`font-sans text-[0.7rem] italic leading-relaxed text-muted ${className}`}
    >
      {dm.ai.disclaimer}
    </p>
  );
}
