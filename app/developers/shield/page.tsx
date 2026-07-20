import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { DEMO_API_KEY } from "@/lib/protocol/constants";
import { metadataFromPath } from "@/lib/seo/metadata";
import {
  SHIELD_DISCLAIMER,
  SHIELD_FREE_TAP_MONTHLY,
  SHIELD_VERSION,
} from "@/lib/shield";

import { ShieldTryPanel } from "./ShieldTryPanel";

export const SHIELD_ROUTE = "/developers/shield";

export const metadata: Metadata = {
  ...metadataFromPath(SHIELD_ROUTE),
  title: "AUROS Shield | Collez → preuve (essai gratuit)",
  description:
    "Super facile : collez un export, obtenez une preuve. Production = même ingest avec clé. Premium = Evidence Pack pour banques.",
};

export default function ShieldPage() {
  return (
    <>
      <AiFirstPageJsonLd path={SHIELD_ROUTE} />
      <FocusPageShell path={SHIELD_ROUTE} width="3xl">
        <ContentPageLayout
          product="Shield"
          eyebrow={`Protocol · v${SHIELD_VERSION}`}
          title="Super facile. Vraiment utile."
          intro="Pas un projet d’intégration. Un geste : envoyer un export → recevoir une preuve. Contreparties vérifient sans vos données. Premium = le pack que la banque met au dossier."
          cta={{ href: "#essayer", label: "Essayer sans compte" }}
        >
          <div className="space-y-10">
            <div id="essayer">
              <ShieldTryPanel />
            </div>

            <section className="space-y-3">
              <h2 className="font-display text-lg text-white">
                En prod — toujours aussi simple
              </h2>
              <pre className="overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-white/65">
                {`# 1) Clé gratuite sur /developers puis :
curl -X POST https://getauros.com/api/v1/shield/ingest \\
  -H "Authorization: Bearer ${DEMO_API_KEY}" \\
  -H "Content-Type: text/plain" \\
  --data-binary @./export.json

# 2) Ou une ligne JS (aucun rewrite métier) :
# globalThis.fetch = instrumentFetch({ apiKey: process.env.AUROS_KEY })`}
              </pre>
              <p className="text-xs text-white/40">
                Quota free : {SHIELD_FREE_TAP_MONTHLY} / mois · demo sandbox :{" "}
                <code className="text-white/55">POST /api/v1/shield/demo</code>{" "}
                (sans clé).
              </p>
            </section>

            <section className="grid gap-4 sm:grid-cols-2">
              <div className="border border-emerald-500/25 bg-emerald-500/[0.06] px-5 py-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-emerald-400/80">
                  Utile tout de suite (gratuit)
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white/60">
                  <li>Preuve partageable (id + verify public)</li>
                  <li>Depuis la console CFU : bouton « Shield »</li>
                  <li>Contrepartie vérifie sans data room</li>
                </ul>
              </div>
              <div className="border border-amber-500/25 bg-amber-500/[0.05] px-5 py-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-amber-400/80">
                  Utile pour ceux qui paient
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white/60">
                  <li>
                    <strong className="text-white/80">Evidence Pack</strong> —
                    CFU + taps pour crédit / ESG
                  </li>
                  <li>Actions banque + horizon 7–30 ans</li>
                  <li>Taps illimités</li>
                </ul>
                <div className="mt-4">
                  <PrimaryButton href="/developers#monitor">
                    Evidence Pack Premium
                  </PrimaryButton>
                </div>
              </div>
            </section>

            <div className="flex flex-wrap gap-3">
              <PrimaryButton href="/green/chargeflow/console">
                Console CFU → Shield
              </PrimaryButton>
              <PrimaryButton href="/developers/shield/banks" variant="ghost">
                Banques
              </PrimaryButton>
              <PrimaryButton href="/developers/shield/agents" variant="ghost">
                Agents
              </PrimaryButton>
              <PrimaryButton href="/developers/shield/dashboard" variant="ghost">
                Quota
              </PrimaryButton>
              <PrimaryButton href="/developers/institutions" variant="ghost">
                Institutions
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
