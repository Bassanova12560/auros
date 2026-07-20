import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  WETS_CATEGORY_LABELS,
  WETS_CONSOLE_ROUTE,
  WETS_DISCLAIMER,
} from "@/lib/wets/constants";
import { listWetsTrustScores } from "@/lib/wets/store";

import { WetsGradeBadge, WetsNav } from "../_components/WetsUi";

export const metadata: Metadata = {
  title: "Rapports Trust Score publics | AUROS",
  description:
    "Annuaire des Water/Energy Trust Scores publiés — grades A–D, démos méthodologiques incluses.",
};

export const dynamic = "force-dynamic";

export default async function WetsPublicReportsPage() {
  const { rows, error } = await listWetsTrustScores({ publishedOnly: true });

  return (
    <FocusPageShell path={`${WETS_CONSOLE_ROUTE}/reports`} width="3xl">
      <ContentPageLayout
        product="Eau · Trust"
        eyebrow="Public reports"
        title="Scores publiés"
        intro="Rapports shareables pour investisseurs. Les entrées « demo » illustrent la méthode — pas un endorsement d’émetteur."
        cta={{ href: `${WETS_CONSOLE_ROUTE}/projects/new`, label: "Scorer un projet" }}
      >
        <WetsNav />
        {error ? (
          <p className="mb-4 text-sm text-amber-300/90">{error}</p>
        ) : null}

        {rows.length === 0 ? (
          <p className="text-sm text-white/50">
            Aucun rapport publié pour l’instant.
          </p>
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => {
              const href = r.public_slug
                ? `/report/${r.public_slug}`
                : `/report/${r.id}`;
              return (
                <li key={r.id}>
                  <Link
                    href={href}
                    className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] py-4 hover:border-white/20"
                  >
                    <div>
                      <p className="font-display text-lg text-white">
                        {r.name}
                        {r.is_demo ? (
                          <span className="ml-2 font-mono text-[10px] uppercase text-amber-400/80">
                            demo
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/35">
                        {WETS_CATEGORY_LABELS[r.category]}
                        {r.jurisdiction ? ` · ${r.jurisdiction}` : ""}
                      </p>
                    </div>
                    <WetsGradeBadge grade={r.grade} score={r.final_score} />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryButton href="/trust/quantum" variant="ghost">
            Quantum index
          </PrimaryButton>
          <PrimaryButton href={WETS_CONSOLE_ROUTE} variant="ghost">
            Console
          </PrimaryButton>
        </div>
        <p className="mt-8 text-xs text-white/35">{WETS_DISCLAIMER}</p>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
