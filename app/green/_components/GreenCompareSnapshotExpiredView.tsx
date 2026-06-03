"use client";

import Link from "next/link";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_COMPARE_ROUTE, getGreenMessages } from "@/lib/green";
import { greenBtnClass, GreenPageHeader, GreenPanel } from "./green-ui";

export function GreenCompareSnapshotExpiredView({
  reason,
}: {
  reason: "expired" | "not_found";
}) {
  const { locale } = useLocale();
  const c = getGreenMessages(locale).compare;

  const title =
    reason === "expired" ? c.snapshotExpiredTitle : c.snapshotNotFoundTitle;
  const body =
    reason === "expired" ? c.snapshotExpiredBody : c.snapshotNotFoundBody;

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={c.eyebrow} title={title} intro={body} compact />
      <GreenPanel className="mt-10 p-6 md:p-8">
        <Link
          href={GREEN_COMPARE_ROUTE}
          className={`inline-flex items-center px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${greenBtnClass}`}
        >
          {c.snapshotExpiredCta} →
        </Link>
      </GreenPanel>
    </div>
  );
}
