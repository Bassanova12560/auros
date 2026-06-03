"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_COMPARE_ROUTE, getGreenMessages } from "@/lib/green";
import { buildGreenCompareSnapshotPath } from "@/lib/green/compare-snapshot";
import { greenBtnClass, GreenPageHeader, GreenPanel } from "./green-ui";
import Link from "next/link";

export function GreenCompareSnapshotExpiredView({
  reason,
  snapshotId,
}: {
  reason: "expired" | "not_found";
  snapshotId?: string;
}) {
  const router = useRouter();
  const { locale } = useLocale();
  const c = getGreenMessages(locale).compare;

  const title =
    reason === "expired" ? c.snapshotExpiredTitle : c.snapshotNotFoundTitle;
  const body =
    reason === "expired" ? c.snapshotExpiredBody : c.snapshotNotFoundBody;

  const [renewState, setRenewState] = useState<"idle" | "renewing" | "error">("idle");

  const handleRenew = useCallback(async () => {
    if (!snapshotId) return;
    setRenewState("renewing");
    try {
      const res = await fetch("/api/green/compare-snapshot/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: snapshotId }),
      });
      const json = (await res.json()) as { ok?: boolean; renewed?: boolean };
      if (!res.ok || !json.ok) {
        setRenewState("error");
        return;
      }
      router.push(buildGreenCompareSnapshotPath(snapshotId));
      router.refresh();
    } catch {
      setRenewState("error");
    }
  }, [snapshotId, router]);

  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
      <GreenPageHeader eyebrow={c.eyebrow} title={title} intro={body} compact />
      <GreenPanel className="mt-10 p-6 md:p-8">
        <div className="flex flex-wrap gap-3">
          <Link
            href={GREEN_COMPARE_ROUTE}
            className={`inline-flex items-center px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${greenBtnClass}`}
          >
            {c.snapshotExpiredCta} →
          </Link>
          {reason === "expired" && snapshotId ? (
            <button
              type="button"
              onClick={() => void handleRenew()}
              disabled={renewState === "renewing"}
              className="inline-flex items-center rounded-lg border border-emerald-500/40 px-5 py-2.5 font-mono text-[11px] uppercase tracking-wider text-emerald-500 transition hover:border-emerald-400 hover:text-emerald-400 disabled:cursor-wait disabled:opacity-60"
            >
              {renewState === "renewing"
                ? c.snapshotRenewing
                : renewState === "error"
                  ? c.snapshotRenewError
                  : c.snapshotRenewCta}
            </button>
          ) : null}
        </div>
      </GreenPanel>
    </div>
  );
}
