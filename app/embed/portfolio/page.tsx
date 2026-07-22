import Link from "next/link";

import { absoluteUrl } from "@/lib/comparators/site";
import { GREEN_PORTFOLIO_ROUTE } from "@/lib/green";
import { getGreenPortfolioSnapshot } from "@/lib/green/portfolio-snapshot";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "AUROS Portfolio embed",
  robots: { index: false, follow: false },
};

type PageProps = {
  searchParams: Promise<{ theme?: string; partner?: string }>;
};

/** White-label KPI strip — iframe-safe via /embed/* headers. */
export default async function EmbedPortfolioPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const theme = sp.theme === "light" ? "light" : "dark";
  const partner = sp.partner?.trim().slice(0, 40) || null;
  const snapshot = await getGreenPortfolioSnapshot(20);
  const dark = theme === "dark";

  const shell = dark
    ? "min-h-[140px] border border-emerald-500/30 bg-[#0a0f0d] p-4 font-sans text-white"
    : "min-h-[140px] border border-emerald-600/25 bg-[#f7faf8] p-4 font-sans text-slate-900";
  const muted = dark ? "text-white/45" : "text-slate-500";
  const accent = dark ? "text-emerald-400" : "text-emerald-700";

  return (
    <div className={shell}>
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.2em] ${accent}`}
      >
        AUROS · Portfolio
        {partner ? ` · ${partner}` : ""}
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p className={`font-mono text-[9px] uppercase tracking-wider ${muted}`}>
            DNA
          </p>
          <p className="mt-1 text-xl tabular-nums">{snapshot.totalDna}</p>
        </div>
        <div>
          <p className={`font-mono text-[9px] uppercase tracking-wider ${muted}`}>
            Live
          </p>
          <p className="mt-1 text-xl tabular-nums">{snapshot.withRecentEvents}</p>
        </div>
        <div>
          <p className={`font-mono text-[9px] uppercase tracking-wider ${muted}`}>
            Alertes
          </p>
          <p className="mt-1 text-xl tabular-nums">{snapshot.alertCount}</p>
        </div>
      </div>
      <p className={`mt-3 text-[11px] leading-relaxed ${muted}`}>
        Indicatif — pas un portefeuille réglementé.
      </p>
      <Link
        href={absoluteUrl(GREEN_PORTFOLIO_ROUTE)}
        className={`mt-2 inline-block font-mono text-[10px] uppercase tracking-wider ${accent} hover:underline`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Console →
      </Link>
    </div>
  );
}
