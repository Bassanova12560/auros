import type { Metadata } from "next";
import Link from "next/link";

import { TollCheckoutForm } from "@/app/green/_components/TollCheckoutForm";
import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";
import { GREEN_ROUTE } from "@/lib/green";
import {
  TOLL_LIFECYCLE_EUR,
  TOLL_LIFECYCLE_PRODUCT,
  TOLL_LOOKUP_PACK_EUR,
  TOLL_LOOKUP_PACK_PRODUCT,
  TOLL_LOOKUP_PACK_CREDITS,
  TOLL_LIFECYCLE_EVENT_CREDITS,
} from "@/lib/toll/lifecycle-pricing";
import { TOLL_MONTHLY_INCLUDED } from "@/lib/toll/metering";

export const metadata: Metadata = {
  title: "AUROS Toll — Lookup & Lifecycle | Green",
  description:
    "Péage d’infrastructure RWA : crédits lookup Resolve/Search et événements lifecycle Proof Stream.",
};

export default function GreenTollPage() {
  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="Toll · machine à cash"
        title="Péage d’infrastructure AUROS"
        intro="Les autres gagnent plus / prennent moins de risque s’ils passent par AUROS. Lookup tax + lifecycle events — pas une certification auto."
        compact
      />

      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6 space-y-3 text-sm text-white/70">
          <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
            Inclus mensuel
          </p>
          <ul className="space-y-1">
            <li>— Anonyme : {TOLL_MONTHLY_INCLUDED.anonymous} crédits lookup</li>
            <li>— Clé free : {TOLL_MONTHLY_INCLUDED.free.toLocaleString("fr-FR")}</li>
            <li>
              — Premium : {TOLL_MONTHLY_INCLUDED.premium.toLocaleString("fr-FR")}
            </li>
          </ul>
          <p className="pt-2 text-white/50">
            API :{" "}
            <code className="text-emerald-200/80">/api/v1/toll/*</code> · Agent
            Protocol ·{" "}
            <Link href="/embed/asset-dna" className="underline underline-offset-4">
              embed DNA
            </Link>
          </p>
        </div>
      </GreenPanel>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <GreenPanel>
          <div className="p-5 md:p-6">
            <h2 className="font-display text-xl text-white">Lookup Pack</h2>
            <p className="mt-2 text-sm text-white/60">
              {TOLL_LOOKUP_PACK_CREDITS.toLocaleString("fr-FR")} crédits
              Resolve / Search / Trail / Drift. One-shot.
            </p>
            <TollCheckoutForm
              product={TOLL_LOOKUP_PACK_PRODUCT}
              priceLabel={`${TOLL_LOOKUP_PACK_EUR} €`}
              cta="Payer le pack lookup"
            />
          </div>
        </GreenPanel>
        <GreenPanel>
          <div className="p-5 md:p-6">
            <h2 className="font-display text-xl text-white">Lifecycle Maintain</h2>
            <p className="mt-2 text-sm text-white/60">
              {TOLL_LIFECYCLE_EVENT_CREDITS} événements Proof Stream facturables /
              mois + file HITL. Abonnement.
            </p>
            <TollCheckoutForm
              product={TOLL_LIFECYCLE_PRODUCT}
              priceLabel={`${TOLL_LIFECYCLE_EUR} € / mois`}
              cta="Souscrire lifecycle"
            />
          </div>
        </GreenPanel>
      </div>

      <GreenDisclaimer>
        Indicatif — pas une certification. Crédits lookup / lifecycle sous revue HITL après paiement.
      </GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>← Green</GreenBackLink>
    </div>
  );
}
