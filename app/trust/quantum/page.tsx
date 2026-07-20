import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { WETS_CONSOLE_ROUTE, WETS_PQC_QUESTIONS } from "@/lib/wets/constants";
import {
  QEI_METHODOLOGY,
  QEI_ROUTE,
  QUANTUM_EXPOSURE_VERTICALS,
} from "@/lib/wets/quantum-exposure";

export const metadata: Metadata = {
  title: "Quantum Exposure Index | AUROS",
  description:
    "Indice indicatif d’exposition structurelle post-quantique par vertical RWA — concentration custody, durée d’actif, recours légal.",
};

const BAND_CLASS = {
  elevated: "text-red-300/90",
  moderate: "text-amber-300/90",
  contained: "text-emerald-300/90",
} as const;

export default function QuantumExposureIndexPage() {
  return (
    <FocusPageShell path={QEI_ROUTE} width="3xl">
      <ContentPageLayout
        product="Trust"
        eyebrow="Year of Quantum Security · 2026"
        title="Quantum Exposure Index"
        intro="Classement structurel des verticaux RWA selon l’exposition custody / durée / recours légal off-chain — pas une note de crédit. Méthode ouverte, score WETS pour le projet unitaire."
        cta={{ href: WETS_CONSOLE_ROUTE, label: "Scorer un projet (WETS)" }}
      >
        <section className="space-y-3 text-sm leading-relaxed text-white/55">
          <p>
            La question n’est pas « le quantum casse-t-il les blockchains demain
            » — c’est :{" "}
            <em className="text-white/70">
              si la clé est compromise, existe-t-il un registre légal qui
              réémet / gèle au profit du vrai propriétaire ?
            </em>
          </p>
          <ul className="list-disc space-y-1 pl-5 text-white/45">
            {QEI_METHODOLOGY.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </section>

        <section className="mt-10 space-y-4">
          <h2 className="font-display text-lg text-white">Verticaux</h2>
          <ul className="space-y-4">
            {QUANTUM_EXPOSURE_VERTICALS.map((v) => (
              <li
                key={v.id}
                className="border-t border-white/[0.08] pt-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-base text-white">{v.label}</h3>
                  <p className="font-mono text-sm text-white/70">
                    {v.exposure_score}/10 ·{" "}
                    <span className={BAND_CLASS[v.band]}>{v.band}</span>
                  </p>
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-white/35">
                  pool {v.avg_pool_concentration} · durée {v.asset_duration} ·
                  recours {v.legal_recourse_typical}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {v.rationale}
                </p>
                {v.wets_link ? (
                  <Link
                    href={v.wets_link}
                    className="mt-2 inline-block font-mono text-[11px] text-sky-300/70 hover:underline"
                  >
                    {v.wets_link} →
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 space-y-3">
          <h2 className="font-display text-lg text-white">
            Critère projet : 4 questions
          </h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-white/65">
            {WETS_PQC_QUESTIONS.map((q) => (
              <li key={q.id}>{q.q}</li>
            ))}
          </ol>
          <p className="text-xs text-white/40">
            Sans réponses sourcées → score WETS{" "}
            <code className="text-white/60">post_quantum_legal_recourse</code>{" "}
            ≤ 3/10.
          </p>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <PrimaryButton href={WETS_CONSOLE_ROUTE}>Console WETS</PrimaryButton>
          <PrimaryButton href="/developers/shield" variant="ghost">
            Shield reseal / PQC
          </PrimaryButton>
          <PrimaryButton href="/partners?intent=quantum#contact" variant="ghost">
            Certification / equity-for-scoring
          </PrimaryButton>
        </div>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
