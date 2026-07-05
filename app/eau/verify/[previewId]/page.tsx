import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { WATER_COMPARE_ROWS } from "@/lib/green/water-compare-data";
import { computeH2oScoreForCompareRow } from "@/lib/green/scoring/h2o-score";
import { getEauHubCopy } from "@/lib/eau/i18n";
import { eauHubUrl } from "@/lib/eau/passport";
import { verifyH2oPreviewVerifyToken } from "@/lib/eau/preview-token";

type Props = { params: Promise<{ previewId: string }> };

export default async function EauVerifyPreviewPage({ params }: Props) {
  const { previewId: rawToken } = await params;
  const token = decodeURIComponent(rawToken);
  const copy = getEauHubCopy("fr");

  const refRow = WATER_COMPARE_ROWS.find((r) => `h2o-ref-${r.id}` === token);
  const catalogScore = refRow ? computeH2oScoreForCompareRow(refRow) : null;
  const signed = verifyH2oPreviewVerifyToken(token);
  const score = catalogScore ?? signed;

  return (
    <FocusPageShell path="/eau" width="2xl">
      <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
        AUROS · H₂O preview
      </p>
      <h1 className="mt-4 font-display text-3xl font-semibold text-white">
        {signed?.preview_id ?? (refRow ? refRow.name : copy.checkerTitle)}
      </h1>

      {score ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <p className="text-4xl font-semibold text-white">
            {score.rating}
            <span className="text-lg text-white/40">/100</span>
          </p>
          <p className="mt-2 text-sm text-cyan-200/70">
            {copy.tierLabels[score.tier]}
          </p>
          {refRow ? (
            <p className="mt-2 text-sm text-white/50">{refRow.name}</p>
          ) : signed ? (
            <p className="mt-2 font-mono text-[10px] text-white/35">
              {signed.preview_id}
            </p>
          ) : null}
          <p className="mt-4 text-xs text-amber-200/70">{copy.previewBadge}</p>
          <p className="mt-3 text-xs text-white/45">{copy.passportRequired}</p>
          <Link
            href="/wizard?type=green&asset=renewable"
            className="mt-4 inline-flex rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            {copy.checkerPassportCta}
          </Link>
        </div>
      ) : (
        <p className="mt-6 text-sm text-white/55">
          Lien expiré ou invalide — relancez un check sur{" "}
          <Link href="/eau" className="text-white underline">
            {eauHubUrl()}
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
