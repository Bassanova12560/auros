import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  WETS_CATEGORY_LABELS,
  WETS_CONSOLE_ROUTE,
  WETS_DISCLAIMER,
} from "@/lib/wets/constants";
import { listWetsTrustScores } from "@/lib/wets/store";

import { WetsGradeBadge, WetsNav } from "./_components/WetsUi";

export const metadata: Metadata = {
  title: "Water/Energy Trust Score | AUROS",
  description:
    "Console WETS — scores indépendants pour RWA eau, énergie et data centers.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function WetsConsolePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; grade?: string }>;
}) {
  const { userId } = await auth();
  const sp = await searchParams;

  if (!userId) {
    return (
      <FocusPageShell path={WETS_CONSOLE_ROUTE} width="3xl">
        <ContentPageLayout
          product="Eau · Trust"
          eyebrow="Water/Energy Trust Score"
          title="Connexion requise"
          intro="Scorer des projets RWA eau/énergie — console privée."
          cta={{ href: "/sign-in", label: "Se connecter" }}
        >
          <p className="text-sm text-white/50">{WETS_DISCLAIMER}</p>
        </ContentPageLayout>
      </FocusPageShell>
    );
  }

  const { rows, error } = await listWetsTrustScores({ ownerUserId: userId });
  const filtered = rows.filter((r) => {
    if (sp.category && r.category !== sp.category) return false;
    if (sp.grade && r.grade !== sp.grade) return false;
    return true;
  });

  return (
    <FocusPageShell path={WETS_CONSOLE_ROUTE} width="3xl">
      <ContentPageLayout
        product="Eau · Trust"
        eyebrow="Water/Energy Trust Score"
        title="Projets scorés"
        intro="Grille indépendante (légal, hydrologie, litige, transparence, token). Indicatif — counsel requis."
        cta={{ href: `${WETS_CONSOLE_ROUTE}/projects/new`, label: "Scorer un projet" }}
      >
        <WetsNav />
        {error ? (
          <p className="mb-4 text-sm text-amber-300/90" role="alert">
            {error.includes("schema cache") || error.includes("does not exist")
              ? "Tables WETS absentes — appliquer la migration 0048."
              : error}
          </p>
        ) : null}

        <div className="mb-6 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider text-white/40">
          <Link href={WETS_CONSOLE_ROUTE} className="hover:text-white/70">
            Tous
          </Link>
          {(["A", "B", "C", "D"] as const).map((g) => (
            <Link
              key={g}
              href={`${WETS_CONSOLE_ROUTE}?grade=${g}`}
              className="hover:text-white/70"
            >
              Grade {g}
            </Link>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-white/50">
            Aucun projet. Commencez par Water150 / un data center pour valider
            la grille.
          </p>
        ) : (
          <ul className="space-y-3">
            {filtered.map((r) => (
              <li key={r.id}>
                <Link
                  href={`${WETS_CONSOLE_ROUTE}/projects/${r.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] py-4 transition hover:border-white/20"
                >
                  <div>
                    <p className="font-display text-lg text-white">
                      {r.name}
                      {r.ticker ? (
                        <span className="ml-2 font-mono text-sm text-white/40">
                          {r.ticker}
                        </span>
                      ) : null}
                    </p>
                    <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/35">
                      {WETS_CATEGORY_LABELS[r.category]} · {r.status}
                      {r.jurisdiction ? ` · ${r.jurisdiction}` : ""}
                    </p>
                  </div>
                  <WetsGradeBadge grade={r.grade} score={r.final_score} />
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10">
          <PrimaryButton href={`${WETS_CONSOLE_ROUTE}/risk-events`} variant="ghost">
            Risk events
          </PrimaryButton>
        </div>
        <p className="mt-8 text-xs text-white/35">{WETS_DISCLAIMER}</p>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
