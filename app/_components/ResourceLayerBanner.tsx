import Link from "next/link";

const LINKS = [
  { href: "/resource-layer", label: "Vision" },
  { href: "/watt", label: "WATT" },
  { href: "/lab", label: "Lab" },
  { href: "/builders", label: "Builders" },
  { href: "/trade", label: "Trade" },
] as const;

/**
 * Homepage band — ARL + WATT signal for institutional / producer visitors.
 */
export function ResourceLayerBanner() {
  return (
    <section
      className="border-y border-white/[0.06] px-4 py-6 md:px-6"
      aria-label="Auros Resource Layer"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
              Resource Layer
            </p>
            <p className="mt-2 font-display text-base font-medium text-white md:text-lg">
              Tokenize metered resources. Route liquidity. Serve machine orders.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-white/45">
              Energy, water, compute-linked power — demos labeled, settlement HITL-gated.
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45">
            {LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="interactive-subtle border-b border-transparent pb-0.5 hover:border-white/30 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-white/55">
            <span className="font-display text-white">Powered by WATT</span>
            {" — "}
            the energy stablecoin machines will trade (1:1 akWh collateral design · preview, not a
            public sale).
          </p>
          <Link
            href="/watt"
            className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-white/55 underline-offset-2 hover:text-white hover:underline"
          >
            WATT explainer →
          </Link>
        </div>
      </div>
    </section>
  );
}
