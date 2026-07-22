import type { Metadata } from "next";
import Link from "next/link";

import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
  GreenSectionTitle,
} from "@/app/green/_components/green-ui";
import { GREEN_MARKET_ROUTE, GREEN_ROUTE } from "@/lib/green";
import { greenMarketActorPath } from "@/lib/green/market/actor-routes";
import { getGreenMarketSnapshot } from "@/lib/green/market/green-market-db";
import { resolveInvestorRoomAccess } from "@/lib/green/investor-room-access";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Investor Room (accès) | AUROS",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ token?: string }> };

export default async function GreenInvestorRoomPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const access = resolveInvestorRoomAccess(token);

  if (!access) {
    return (
      <div className="page-inner page-inner--2xl mx-auto px-4 pb-20 pt-12">
        <GreenPageHeader
          eyebrow="Investor Room"
          title="Lien invalide ou expiré"
          intro="Demandez un nouvel accès depuis la page Investor Room."
          compact
        />
        <Link
          href="/green/investors"
          className="mt-8 inline-block font-mono text-[11px] uppercase tracking-wider text-emerald-400/90"
        >
          Investor Room →
        </Link>
      </div>
    );
  }

  const snap = await getGreenMarketSnapshot();
  const actors = snap.actors
    .filter(
      (a) =>
        a.listingTier === "verified" ||
        a.listingTier === "referenced" ||
        a.status === "available"
    )
    .filter((a) => a.listingTier !== "demo")
    .slice(0, 40);

  return (
    <div className="page-inner page-inner--6xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="Investor Room · accès"
        title="Listings qualifiés"
        intro={`Session ${access.email} — expire ${new Date(access.expiresAt).toLocaleDateString("fr-FR")}. Matching data uniquement.`}
        compact
      />

      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6">
          <GreenSectionTitle>Acteurs ({actors.length})</GreenSectionTitle>
          {actors.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">
              Aucun listing éligible pour le moment.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-white/[0.06]">
              {actors.map((a) => (
                <li key={a.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                  <div>
                    <Link
                      href={greenMarketActorPath(a.id)}
                      className="text-white hover:text-emerald-300"
                    >
                      {a.name}
                    </Link>
                    <p className="mt-0.5 font-mono text-[10px] text-white/35">
                      {a.city} · {a.country} · {a.listingTier}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400/70">
                    {a.type}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </GreenPanel>

      <div className="mt-6 flex flex-wrap gap-4">
        <Link
          href={`${GREEN_MARKET_ROUTE}?tier=verified`}
          className="font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
        >
          Marché verified →
        </Link>
      </div>
      <GreenDisclaimer>
        Salle indicative — pas un data room réglementé, pas de conseil d’investissement.
      </GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>← Hub Green</GreenBackLink>
    </div>
  );
}
