"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { GREEN_COMPARE_ROUTE } from "@/lib/green/constants";
import {
  addCompareOfferId,
  buildGreenCompareUrl,
  isOfferInCompareSelection,
  readCompareOfferIds,
} from "@/lib/green/market/compare-selection";
import { getGreenMarketMessages } from "@/lib/green/market-i18n";

type Props = {
  offerId: string;
};

type Feedback =
  | "idle"
  | "added"
  | "duplicate"
  | "full";

export function GreenOfferCompareButton({ offerId }: Props) {
  const { locale } = useLocale();
  const od = getGreenMarketMessages(locale).offerDetail;
  const [inCompare, setInCompare] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>("idle");

  useEffect(() => {
    setInCompare(isOfferInCompareSelection(offerId));
  }, [offerId]);

  const handleAdd = useCallback(() => {
    const result = addCompareOfferId(offerId);
    setInCompare(result.ids.includes(offerId));
    if (result.added) {
      setFeedback("added");
    } else if (result.reason === "duplicate") {
      setFeedback("duplicate");
    } else if (result.reason === "full") {
      setFeedback("full");
    }
    window.setTimeout(() => setFeedback("idle"), 2800);
  }, [offerId]);

  const label =
    feedback === "added"
      ? od.addedToCompare
      : feedback === "duplicate"
        ? od.alreadyInCompare
        : feedback === "full"
          ? od.compareFull
          : inCompare
            ? od.alreadyInCompare
            : od.addToCompare;

  const compareHref = buildGreenCompareUrl(readCompareOfferIds());

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={handleAdd}
        disabled={inCompare && feedback === "idle"}
        className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 font-mono text-[11px] tracking-wide text-emerald-400 transition hover:border-emerald-400 hover:text-emerald-300 disabled:cursor-default disabled:opacity-70"
      >
        {label}
      </button>
      {inCompare ? (
        <Link
          href={compareHref || GREEN_COMPARE_ROUTE}
          className="rounded-lg border border-white/[0.12] px-4 py-2 font-mono text-[11px] tracking-wide text-white/60 transition hover:border-white/25 hover:text-white"
        >
          {od.openCompare} →
        </Link>
      ) : null}
    </div>
  );
}
