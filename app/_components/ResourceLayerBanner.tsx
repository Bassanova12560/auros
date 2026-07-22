import Link from "next/link";

const LINKS = [
  { href: "/resource-layer", label: "Vision" },
  { href: "/trade", label: "Trade" },
  { href: "/earn", label: "Earn" },
  { href: "/producer", label: "Producer" },
  { href: "/agent", label: "Agent" },
  { href: "/market", label: "Market" },
] as const;

/**
 * Thin homepage band — ARL launch without competing with the hero CTA.
 */
export function ResourceLayerBanner() {
  return (
    <section
      className="border-y border-white/[0.06] bg-white/[0.02] px-4 py-5 md:px-6"
      aria-label="Auros Resource Layer"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-display text-sm font-medium text-white md:text-base">
          Auros Resource Layer is live{" "}
          <span className="font-normal text-white/45">— tokenize resources, trade liquidity, agent APIs.</span>
        </p>
        <nav className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wide text-white/50">
          {LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="interactive-subtle text-white/55 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
