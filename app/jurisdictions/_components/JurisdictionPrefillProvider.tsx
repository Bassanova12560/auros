"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { JURISDICTIONS_ANCHORS } from "@/lib/jurisdictions";

const DEFAULT_COMPARE_A = "dubai-difc";
const DEFAULT_COMPARE_B = "singapore";

type PrefillContextValue = {
  compareA: string;
  compareB: string;
  quoteJurisdictionId: string;
  setCompareA: (id: string) => void;
  setCompareB: (id: string) => void;
  setQuoteJurisdictionId: (id: string) => void;
  openGuideChecklist: (jurisdictionId: string) => void;
  openQuote: (jurisdictionId: string) => void;
};

const PrefillContext = createContext<PrefillContextValue | null>(null);

function scrollToAnchor(hash: string) {
  const target = document.querySelector(hash);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function JurisdictionPrefillProvider({ children }: { children: ReactNode }) {
  const [compareA, setCompareA] = useState(DEFAULT_COMPARE_A);
  const [compareB, setCompareB] = useState(DEFAULT_COMPARE_B);
  const [quoteJurisdictionId, setQuoteJurisdictionId] = useState("");

  const openGuideChecklist = useCallback((jurisdictionId: string) => {
    setCompareA(jurisdictionId);
    setCompareB((prev) => {
      if (prev !== jurisdictionId) return prev;
      return jurisdictionId === DEFAULT_COMPARE_B
        ? DEFAULT_COMPARE_A
        : DEFAULT_COMPARE_B;
    });
    scrollToAnchor(JURISDICTIONS_ANCHORS.guide);
  }, []);

  const openQuote = useCallback((jurisdictionId: string) => {
    setQuoteJurisdictionId(jurisdictionId);
    scrollToAnchor(JURISDICTIONS_ANCHORS.quote);
  }, []);

  const value = useMemo(
    () => ({
      compareA,
      compareB,
      quoteJurisdictionId,
      setCompareA,
      setCompareB,
      setQuoteJurisdictionId,
      openGuideChecklist,
      openQuote,
    }),
    [compareA, compareB, openGuideChecklist, openQuote, quoteJurisdictionId]
  );

  return (
    <PrefillContext.Provider value={value}>{children}</PrefillContext.Provider>
  );
}

export function useJurisdictionPrefill() {
  const ctx = useContext(PrefillContext);
  if (!ctx) {
    throw new Error(
      "useJurisdictionPrefill must be used within JurisdictionPrefillProvider"
    );
  }
  return ctx;
}
