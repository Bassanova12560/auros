import Link from "next/link";

import {
  GREEN_PORTFOLIO_ROUTE,
  GREEN_ROUTE,
} from "@/lib/green";
import { unsubscribePortfolioWatchlist } from "@/lib/green/portfolio-watchlist";

export const metadata = {
  title: "Désinscription digest | AUROS Portfolio",
  robots: { index: false, follow: false },
};

type PageProps = { searchParams: Promise<{ token?: string }> };

export default async function PortfolioWatchlistUnsubscribePage({
  searchParams,
}: PageProps) {
  const { token } = await searchParams;
  const ok = token ? await unsubscribePortfolioWatchlist(token) : false;

  return (
    <div className="page-inner page-inner--2xl mx-auto px-4 pb-16 pt-12 md:px-6">
      <div className="border border-white/[0.08] bg-[#0a0f0d] p-6 md:p-10">
        {ok ? (
          <>
            <h1 className="font-display text-2xl text-white">
              Digest désactivé
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Vous ne recevrez plus les alertes portfolio quotidiennes. Vous
              pouvez vous réabonner depuis la Portfolio Console.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl text-white">
              Lien invalide
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Ce lien de désinscription est invalide ou déjà utilisé.
            </p>
          </>
        )}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={GREEN_PORTFOLIO_ROUTE}
            className="font-mono text-[11px] uppercase tracking-wider text-emerald-400/90 hover:text-emerald-300"
          >
            Portfolio →
          </Link>
          <Link
            href={GREEN_ROUTE}
            className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            Hub Green →
          </Link>
        </div>
      </div>
    </div>
  );
}
