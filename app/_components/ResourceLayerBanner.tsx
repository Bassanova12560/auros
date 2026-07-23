import Link from "next/link";

const LINKS = [
  { href: "/resource-layer", label: "Why resources" },
  { href: "/watt", label: "WATT" },
  { href: "/lab", label: "Lab" },
  { href: "/trade", label: "Trade" },
] as const;

/**
 * Homepage continuation — same liquidity engine, next frontier (not a second company).
 */
export function ResourceLayerBanner() {
  return (
    <section
      className="border-y border-white/[0.06] px-4 py-8 md:px-6"
      aria-label="Resource Layer continuation"
    >
      <div className="mx-auto max-w-6xl space-y-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          Same engine · next frontier
        </p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-xl text-white md:text-2xl">
              Tokenized energy, water, and compute use the same liquidity discipline.
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/45">
              Metered production → lab wallet → spot. Powered by{" "}
              <Link href="/watt" className="text-white/70 underline-offset-2 hover:underline">
                WATT
              </Link>{" "}
              (preview — not a public sale). Demos labeled; settlement stays HITL.
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
      </div>
    </section>
  );
}
