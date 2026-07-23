import Link from "next/link";

const SOLUTIONS = [
  {
    who: "Exchanges & digital assets",
    plain: "Deep liquidity, 24/7 risk discipline, and venue-ready APIs for tokens that need real markets.",
    cta: "Investor / diligence desk",
    href: "/investors",
  },
  {
    who: "Energy & water producers",
    plain: "Turn metered production into units you can sell — faster paths to buyers, labeled demos first.",
    cta: "Open Energy Lab",
    href: "/lab",
  },
  {
    who: "Developers & AI agents",
    plain: "Build on the Resource Layer: protocol surfaces, agent API, and a shared lab wallet.",
    cta: "Builders / testnet",
    href: "/builders",
  },
] as const;

/**
 * Homepage solutions — one card per audience, one CTA each. Reduces choice paralysis.
 */
export function HomeSolutions() {
  return (
    <section id="solutions" className="scroll-mt-24 px-4 py-14 md:px-6" aria-label="Solutions by audience">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          Pick your path
        </p>
        <h2 className="mt-2 font-display text-2xl text-white md:text-3xl">
          Who are you here for?
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/50">
          One liquidity engine. Three doors. No jargon maze — choose the path that matches your job.
        </p>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <li
              key={s.who}
              className="flex flex-col border border-white/[0.08] bg-white/[0.02] px-5 py-5"
            >
              <p className="font-display text-lg text-white">{s.who}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">{s.plain}</p>
              <Link
                href={s.href}
                className="mt-6 inline-flex font-mono text-[11px] uppercase tracking-wider text-white/70 underline-offset-4 hover:text-white hover:underline"
              >
                {s.cta} →
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs text-white/35">
          Preparing a classic RWA dossier (real estate, art, receivables)?{" "}
          <Link href="/start" className="underline-offset-2 hover:underline">
            Start readiness in ~4 min
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
