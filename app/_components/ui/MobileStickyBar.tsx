import type { ReactNode } from "react";

/** Fixed bottom CTA bar — mobile only, safe-area aware. */
export function MobileStickyBar({ children }: { children: ReactNode }) {
  return (
    <div className="mobile-sticky-bar" role="region" aria-label="Actions">
      {children}
    </div>
  );
}
