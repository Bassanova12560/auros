"use client";

import type { ReactNode } from "react";

export function AmbientShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh">
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="ambient-grid" />
        <div className="ambient-grain" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
