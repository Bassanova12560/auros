import type { ReactNode } from "react";

/** Decorative ambient chrome — RSC-safe (no hooks). */
export function AmbientShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh bg-void">
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden
      >
        <div className="auros-brand-mesh" />
        <div className="ambient-grid" />
        <div className="ambient-grain" />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
