import type { Metadata } from "next";
import Link from "next/link";

import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  CHARGEFLOW_FLEETS_ROUTE,
  CHARGEFLOW_ROUTE,
} from "@/lib/chargeflow/constants";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...metadataFromPath(CHARGEFLOW_FLEETS_ROUTE),
  title: "ChargeFlow pour flottes & CPO | AUROS",
  description:
    "Transformez les sessions de charge flotte / CPO en unités CFU-E vérifiables — RWA prep et ESG granulaire, sans smart contract.",
};

export default function ChargeflowFleetsPage() {
  return (
    <>
      <AiFirstPageJsonLd path={CHARGEFLOW_FLEETS_ROUTE} />
      <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6 md:pt-14">
        <div className="space-y-14">
          <header className="space-y-4 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
              Flottes · CPO · Supercharger-class
            </p>
            <h1 className="font-display text-3xl font-medium text-white md:text-4xl">
              Des sessions de charge prêtes pour la finance
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
              Les logs CPO et flottes restent des exports silo. ChargeFlow les
              transforme en CFU-E hashées et vérifiables — pour dossiers RWA,
              reporting ESG et admission plateforme. Compatible réseaux
              Supercharger-class. Aucune claim de partnership Tesla.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <PrimaryButton href="/green/chargeflow/console">
                Ouvrir la console
              </PrimaryButton>
              <PrimaryButton href="/developers/shield/banks" variant="ghost">
                Evidence Pack banque
              </PrimaryButton>
              <PrimaryButton href={CHARGEFLOW_ROUTE} variant="ghost">
                Demo CFU-E
              </PrimaryButton>
            </div>
          </header>

          <section className="mx-auto max-w-2xl space-y-3 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Parcours flotte
            </p>
            <ol className="space-y-3 text-left text-sm leading-relaxed text-white/60">
              <li>
                <span className="font-mono text-white/35">01</span> — Console :
                import OCPI / CSV, list &amp; retire CFU.
              </li>
              <li>
                <span className="font-mono text-white/35">02</span> — Shield :
                hashe l&apos;export → preuve sans data room.
              </li>
              <li>
                <span className="font-mono text-white/35">03</span> — Evidence
                Pack Premium pour le dossier crédit / ESG.
              </li>
            </ol>
          </section>

          <section className="mx-auto max-w-2xl space-y-3 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
              Connecteurs
            </p>
            <p className="text-sm leading-relaxed text-white/55">
              Tesla Fleet, TotalEnergies OCPI et OCPI générique : sync sandbox
              depuis la console ; live dès credentials. Aucune claim de
              partnership officiel.
            </p>
          </section>

          <section className="grid gap-8 md:grid-cols-3">
            {[
              {
                t: "Problème",
                d: "PDF et CSV de sessions ne passent pas un comité crédit ou un auditeur ESG.",
              },
              {
                t: "CFU-E",
                d: "Une unité par session kWh : hash, HMAC, Watt companion, URL verify publique.",
              },
              {
                t: "Suite",
                d: "CFU-F pour la flex kW, CFU-W pour l'eau — même standard Proof-of-Flow.",
              },
            ].map((item) => (
              <div key={item.t} className="space-y-2">
                <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  {item.t}
                </h2>
                <p className="text-sm leading-relaxed text-white/65">{item.d}</p>
              </div>
            ))}
          </section>

          <p className="text-center text-xs text-white/35">
            Aussi :{" "}
            <Link
              href="/green/watts"
              className="text-white/55 underline-offset-2 hover:underline"
            >
              Watts
            </Link>{" "}
            ·{" "}
            <Link
              href="/green/chargeflow/flex"
              className="text-white/55 underline-offset-2 hover:underline"
            >
              CFU-F
            </Link>{" "}
            ·{" "}
            <Link
              href="/eau/chargeflow"
              className="text-white/55 underline-offset-2 hover:underline"
            >
              CFU-W
            </Link>{" "}
            ·{" "}
            <Link
              href="/developers/docs/endpoint-chargeflow"
              className="text-white/55 underline-offset-2 hover:underline"
            >
              Docs API
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
