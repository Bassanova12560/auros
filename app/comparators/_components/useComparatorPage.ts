"use client";

import { usePathname } from "next/navigation";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import {
  getComparatorByPath,
  getComparatorMessages,
  tabLabelForId,
  type ComparatorId,
} from "@/lib/comparators";

export function useComparatorPage() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const messages = getComparatorMessages(locale);
  const entry = getComparatorByPath(pathname);
  const comparatorId: ComparatorId | "unknown" = entry?.id ?? "unknown";

  return {
    locale,
    messages,
    entry,
    comparatorId,
    tabLabel: (id: string) => tabLabelForId(messages, id),
  };
}
