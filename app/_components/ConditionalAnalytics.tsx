"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { analyticsAllowed, readCookieChoice } from "@/lib/cookie-consent";

export function ConditionalAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const sync = () => setAllowed(analyticsAllowed());
    sync();
    window.addEventListener("auros-cookie-consent", sync);
    return () => window.removeEventListener("auros-cookie-consent", sync);
  }, []);

  useEffect(() => {
    if (readCookieChoice() === null) setAllowed(false);
  }, []);

  if (!allowed) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
