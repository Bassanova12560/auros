"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

import { JURISDICTIONS } from "@/lib/jurisdictions";
import { track } from "@/lib/analytics";
import type { JurisdictionsEntrySource } from "@/lib/jurisdictions/wizard-bridge";

import { useJurisdictionPrefill } from "./JurisdictionPrefillProvider";

const VALID_IDS = new Set(JURISDICTIONS.map((j) => j.id));
const VALID_SOURCES = new Set<JurisdictionsEntrySource>([
  "score",
  "wizard",
  "nav",
  "compare",
]);

function pickId(value: string | null): string | null {
  if (!value || !VALID_IDS.has(value)) return null;
  return value;
}

export function JurisdictionUrlPrefill() {
  const searchParams = useSearchParams();
  const { setCompareA, setCompareB, setQuoteJurisdictionId } =
    useJurisdictionPrefill();
  const tracked = useRef(false);

  useEffect(() => {
    const compareA = pickId(searchParams.get("compareA"));
    const compareB = pickId(searchParams.get("compareB"));
    const quote = pickId(searchParams.get("quote"));
    const from = searchParams.get("from");

    if (compareA) setCompareA(compareA);
    if (compareB) setCompareB(compareB);
    if (quote) setQuoteJurisdictionId(quote);

    if (!tracked.current && from && VALID_SOURCES.has(from as JurisdictionsEntrySource)) {
      tracked.current = true;
      track("jurisdictions_entry", {
        source: from,
        has_compare_a: Boolean(compareA),
        has_quote: Boolean(quote),
      });
    }
  }, [searchParams, setCompareA, setCompareB, setQuoteJurisdictionId]);

  return null;
}
