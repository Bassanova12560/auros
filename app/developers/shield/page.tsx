import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { metadataFromPath } from "@/lib/seo/metadata";
import {
  EASY_INGEST_CURL,
  SHIELD_DISCLAIMER,
  SHIELD_FREE_TAP_MONTHLY,
  SHIELD_VERSION,
} from "@/lib/shield";

export const SHIELD_ROUTE = "/developers/shield";

export const metadata: Metadata = {
  ...metadataFromPath(SHIELD_ROUTE),
  title: "AUROS Shield | Preuve RWA en 1 ligne — Evidence Pack Premium",
  description:
    "Quand le RWA est partout : ingest brut sans schéma, instrumentFetch en une ligne, Evidence Pack Premium pour banques/auditeurs. Payload jamais stocké.",
};

export default function ShieldPage() {
  return (
    <>
      <AiFirstPageJsonLd path={SHIELD_ROUTE} />
      <FocusPageShell path={SHIELD_ROUTE} width="3xl">
        <ContentPageLayout
          eyebrow={`AUROS Shield · v${SHIELD_VERSION}`}
          title="Intégration quasi invisible. Premium qui aide vraiment."
          intro="Dans un monde où chaque entreprise a des RWA, personne ne veut un projet d’intégration de 6 mois. Shield se branche comme un tuyau : on envoie n’importe quel export, on reçoit une preuve. Ceux qui paient obtiennent le pack crédit/ESG — pas juste plus de quota."
          cta={{ href: "/developers#monitor", label: "Evidence Pack Premium" }}
        >
          <div className="space-y-10">
            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">
                Facile ? Oui — 3 niveaux
              </h2>
              <div className="space-y-4 text-sm text-white/55">
                <div className="border border-white/[0.08] px-4 py-3">
                  <p className="font-mono text-[10px] text-emerald-400/80">
                    1 · Ops / curl (zéro code)
                  </p>
                  <pre className="mt-2 overflow-x-auto font-mono text-[10px] text-white/50">
                    {EASY_INGEST_CURL}
                  </pre>
                </div>
                <div className="border border-white/[0.08] px-4 py-3">
                  <p className="font-mono text-[10px] text-emerald-400/80">
                    2 · Une ligne JS (pas de rewrite métier)
                  </p>
                  <pre className="mt-2 overflow-x-auto font-mono text-[10px] text-white/50">
                    {`import { instrumentFetch } from "@adrien1212balitrand/auros-shield";
globalThis.fetch = instrumentFetch({ apiKey: process.env.AUROS_KEY! });
// chaque POST JSON est tapé en arrière-plan`}
                  </pre>
                </div>
                <div className="border border-white/[0.08] px-4 py-3">
                  <p className="font-mono text-[10px] text-emerald-400/80">
                    3 · On-prem DMZ (clés chez vous)
                  </p>
                  <pre className="mt-2 overflow-x-auto font-mono text-[10px] text-white/50">
                    {`npx auros-shield serve --port 8787
# POST /v1/tap  → puis ancrage cloud`}
                  </pre>
                </div>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-400/80">
                  Gratuit — standard de fait
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white/60">
                  <li>Ingest brut · {SHIELD_FREE_TAP_MONTHLY}/mois</li>
                  <li>Verify contrepartie illimité</li>
                  <li>instrumentFetch / curl</li>
                  <li>CBOM + on-prem local</li>
                </ul>
                <p className="mt-4 text-xs text-white/35">
                  Objectif : que tout le marché tape ici avant d’avoir besoin de
                  payer.
                </p>
              </div>
              <div className="border border-amber-500/25 bg-amber-500/[0.05] px-5 py-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400/80">
                  Premium — du lourd qui aide
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white/60">
                  <li>
                    <strong className="text-white/80">Evidence Pack</strong> —
                    CFU + taps scellés pour crédit / ESG / auditeur
                  </li>
                  <li>Actions banque prêtes (joindre au dossier, re-verify, reseal)</li>
                  <li>Horizon 7–30 ans + recommandation PQC</li>
                  <li>Taps illimités · export registre · hybrid_pqc_ready</li>
                </ul>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[10px] text-white/55">
                  {`POST /api/v1/shield/pack
→ pack_hash + bank_actions
→ payload_retained: false`}
                </pre>
                <div className="mt-4">
                  <PrimaryButton href="/developers#monitor">
                    Upgrade Monitor
                  </PrimaryButton>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">
                Pourquoi ça devient indispensable
              </h2>
              <p className="text-sm leading-relaxed text-white/55">
                Quand chaque filiale a des CFU, des dossiers et des exports ESG,
                le goulot n’est plus « tokeniser » — c’est{" "}
                <em>prouver sans ouvrir la data room</em>. Shield est la couche
                que credit, risk et auditeurs demandent ; le Free crée le
                réseau de verify, le Premium livre le pack qu’ils mettent au
                dossier.
              </p>
            </section>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton href="/api/v1/shield/cbom">CBOM</PrimaryButton>
              <PrimaryButton href="/developers/institutions" variant="ghost">
                Institutions
              </PrimaryButton>
              <PrimaryButton href="/auros-openapi.yaml" variant="ghost">
                OpenAPI
              </PrimaryButton>
            </div>

            <p className="text-xs leading-relaxed text-white/35">
              {SHIELD_DISCLAIMER}{" "}
              <Link href="/developers" className="underline-offset-2 hover:underline">
                Hub développeurs
              </Link>
              .
            </p>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
