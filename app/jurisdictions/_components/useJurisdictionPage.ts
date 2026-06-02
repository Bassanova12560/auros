"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getJurisdictionMessages } from "@/lib/jurisdictions";

export function useJurisdictionPage() {
  const { locale } = useLocale();
  const messages = getJurisdictionMessages(locale);

  return { locale, messages };
}
