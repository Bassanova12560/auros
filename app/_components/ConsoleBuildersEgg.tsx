"use client";

import { useEffect } from "react";

/** Quiet console hello for builders who open DevTools. */
export function ConsoleBuildersEgg() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      "%cAUROS%c liquidity for critical resources\nLab → /lab · Builders → /builders · Status → /status · WATT → /watt",
      "background:#fff;color:#0a0a0a;padding:2px 6px;font-weight:700",
      "color:#888;padding-left:8px",
    );
  }, []);
  return null;
}
