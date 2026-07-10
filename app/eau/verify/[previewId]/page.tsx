import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { WATER_COMPARE_ROWS } from "@/lib/green/water-compare-data";
import { computeH2oScoreForCompareRow } from "@/lib/green/scoring/h2o-score";
import { getEauHubCopy } from "@/lib/eau/i18n";
import { eauHubUrl } from "@/lib/eau/passport";

type Props = { params: Promise<{ previewId: string }> };

export default async function EauVerifyPreviewPage({ params }: Props) {
  const { previewId } = await params;
  const copy = getEauHubCopy("fr");

  const refRow = WATER_COMPARE_ROWS.find((r) => `h2o-ref-${r.id}` === previewId);
  const score = refRow ? computeH2oScoreForCompareRow(refRow) : null;

  return (
    <FocusPageShell path="/eau" width="2xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
        AUROS · H₂O preview
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-white">
        {previewId}
      </h1>

      {score ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-4xl font-semibold text-white">
            {score.rating}
            <span className="text-lg text-white/40">/100</span>
          </p>
          <p className="mt-2 text-sm text-white/50">{refRow!.name}</p>
          <p className="mt-4 text-xs text-amber-200/70">{copy.previewBadge}</p>
        </div>
      ) : (
        <p className="mt-6 text-sm text-white/55">
          Preview indicatif — le Passeport Hydrique vérifiable (registre public AUROS Green)
          s&apos;obtient après dossier complet sur{" "}
          <Link href="/comment-tokeniser/eau" className="text-white underline">
            getauros.com
          </Link>
          .
        </p>
      )}

      <p className="mt-8 font-mono text-[10px] text-white/30">{eauHubUrl()}</p>
      <Link
        href="/eau"
        className="mt-6 inline-block text-sm text-white/60 underline hover:text-white"
      >
        ← {copy.links.guide}
      </Link>
    </FocusPageShell>
  );
}
