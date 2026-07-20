import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { SHIELD_SLA } from "@/lib/shield";

export const metadata: Metadata = {
  title: "Modèle Evidence Pack (imprimable) | AUROS Shield",
  description:
    "Modèle imprimable PDF pour joindre un Evidence Pack AUROS Shield au dossier crédit.",
  robots: { index: false, follow: true },
};

export default function ShieldBanksSamplePage() {
  return (
    <>
      <AiFirstPageJsonLd path="/developers/shield/banks/sample" />
      <FocusPageShell path="/developers/shield/banks/sample" width="2xl">
        <ContentPageLayout
          eyebrow="Imprimer → PDF"
          title="AUROS Shield — Evidence Pack (modèle)"
          intro="Document type à joindre au dossier. Remplacez les hashes par ceux du pack live."
        >
          <article className="space-y-6 rounded-lg border border-white/10 bg-white/[0.03] p-6 text-sm text-white/80 print:border-black print:bg-white print:text-black">
            <header className="space-y-1 border-b border-white/10 pb-4 print:border-black/20">
              <p className="font-mono text-[10px] uppercase tracking-widest text-white/45 print:text-black/50">
                Confidential — credit / ESG file annex
              </p>
              <h1 className="font-display text-xl text-white print:text-black">
                Evidence Pack — hash-only
              </h1>
              <p className="text-xs text-white/50 print:text-black/60">
                Pack ID: shp_EXAMPLE · Generated: 2026-07-20 · Payload retained: false
              </p>
            </header>

            <section>
              <h2 className="mb-2 font-display text-base text-white print:text-black">
                Summary
              </h2>
              <ul className="space-y-1 font-mono text-[11px]">
                <li>CFU total: 12 · active: 10 · retired: 2</li>
                <li>Tap receipts: 8</li>
                <li>generation_sources: grid_mix, nuclear (see /power — not Green Verified)</li>
                <li>pack_hash: a1b2…(64 hex)</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base text-white print:text-black">
                Bank actions
              </h2>
              <ol className="list-decimal space-y-1 pl-5">
                <li>Attach to credit / ESG file — no data room required</li>
                <li>Re-verify taps: POST /api/v1/shield/verify</li>
                <li>Diff next edition against pack_hash</li>
                <li>Schedule reseal hybrid_pqc_ready (7–30y retention)</li>
              </ol>
            </section>

            <section>
              <h2 className="mb-2 font-display text-base text-white print:text-black">
                SLA (indicative)
              </h2>
              <p className="text-xs">
                Verify availability {SHIELD_SLA.verify_availability_target} · p99{" "}
                {SHIELD_SLA.verify_latency_p99_ms_target} ms · {SHIELD_SLA.note}
              </p>
            </section>

            <p className="text-[11px] text-white/40 print:text-black/50">
              Not a regulated audit opinion. Not investment advice. Not a banking licence.
            </p>
          </article>

          <p className="mt-6 text-sm text-white/50">
            <Link href="/developers/shield/banks" className="underline">
              ← Retour banques
            </Link>
            {" · "}
            <span className="text-white/40">Ctrl/Cmd+P pour enregistrer en PDF</span>
          </p>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
