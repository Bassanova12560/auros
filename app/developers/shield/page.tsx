import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { metadataFromPath } from "@/lib/seo/metadata";
import {
  SHIELD_DISCLAIMER,
  SHIELD_FREE_TAP_MONTHLY,
  SHIELD_VERSION,
} from "@/lib/shield";

export const SHIELD_ROUTE = "/developers/shield";

export const metadata: Metadata = {
  ...metadataFromPath(SHIELD_ROUTE),
  title: "AUROS Shield | Proof Tap RWA — freemium on-prem",
  description:
    "Sous-couche indispensable RWA : tap non invasif (hash only), verify contrepartie gratuit, ancrage cloud freemium. Clés locales + co-sceau AUROS.",
};

export default function ShieldPage() {
  return (
    <>
      <AiFirstPageJsonLd path={SHIELD_ROUTE} />
      <FocusPageShell path={SHIELD_ROUTE} width="3xl">
        <ContentPageLayout
          eyebrow={`AUROS Shield · v${SHIELD_VERSION}`}
          title="Le Proof Tap RWA — gratuit pour entrer, Premium pour scaler"
          intro="Technologie non invasive : on hashe le flux, on jette le payload, on publie un reçu vérifiable. Contreparties vérifient sans jamais voir vos données. Devenez la couche de preuve standard — avant que ce soit obligatoire."
          cta={{ href: "/developers#monitor", label: "Passer Premium" }}
        >
          <div className="space-y-10">
            <section className="grid gap-4 sm:grid-cols-2">
              <div className="border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-400/80">
                  Gratuit — pour devenir indispensable
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white/60">
                  <li>
                    Proof Tap · {SHIELD_FREE_TAP_MONTHLY} ancrages cloud / mois
                  </li>
                  <li>Verify contrepartie illimité (public)</li>
                  <li>CBOM crypto forever</li>
                  <li>Runtime on-prem local (clés chez vous)</li>
                </ul>
                <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-3 font-mono text-[10px] text-white/55">
                  {`POST /api/v1/shield/tap
{ "body": "…export CFU…" }
→ hash + cloud_signature
→ payload jamais stocké`}
                </pre>
              </div>
              <div className="border border-amber-500/25 bg-amber-500/[0.05] px-5 py-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400/80">
                  Premium — pour être le seul stack
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white/60">
                  <li>Taps / ancrages illimités</li>
                  <li>Profil hybrid_pqc_ready</li>
                  <li>Export registre des reçus</li>
                  <li>Batch + SLA institutions</li>
                </ul>
                <p className="mt-4 text-xs text-white/40">
                  Via Protocol Monitor / Premium — même clé API banques.
                </p>
                <div className="mt-4">
                  <PrimaryButton href="/developers#monitor">
                    Upgrade Monitor
                  </PrimaryButton>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">
                Pourquoi c’est non invasif (et puissant)
              </h2>
              <ol className="list-decimal space-y-2 pl-5 text-sm text-white/55">
                <li>
                  Sidecar / un POST — pas de rewrite ERP ni data room.
                </li>
                <li>
                  Double sceau : clé locale optionnelle + co-sceau AUROS sur le{" "}
                  <em>hash seulement</em>.
                </li>
                <li>
                  Contrepartie appelle{" "}
                  <code className="text-white/70">POST /api/v1/shield/verify</code>{" "}
                  — gratuit, sans vos secrets métier.
                </li>
              </ol>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">Installer chez vous</h2>
              <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-white/65">
                {`npm install @adrien1212balitrand/auros-shield
export AUROS_SHIELD_SIGNING_KEY="…HSM…"
npx auros-shield serve --port 8787
# local: POST /v1/tap  → puis ancrage cloud /api/v1/shield/tap`}
              </pre>
              <div className="flex flex-wrap gap-3">
                <PrimaryButton href="/api/v1/shield/cbom">CBOM</PrimaryButton>
                <PrimaryButton href="/developers/institutions" variant="ghost">
                  Institutions
                </PrimaryButton>
                <PrimaryButton href="/auros-openapi.yaml" variant="ghost">
                  OpenAPI
                </PrimaryButton>
              </div>
            </section>

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
