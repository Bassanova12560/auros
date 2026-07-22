import type { Metadata } from "next";
import Link from "next/link";

import { GreenP1CheckoutForm } from "@/app/green/_components/GreenP1CheckoutForm";
import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";
import { GREEN_ROUTE, GREEN_STANDARDS_ROUTE } from "@/lib/green";
import {
  GREEN_READINESS_MRR_EUR,
  GREEN_READINESS_MRR_PRODUCT,
} from "@/lib/green/p1-cash-pricing";

export const metadata: Metadata = {
  title: "Readiness MRR | AUROS Green",
  description:
    "Abonnement mensuel file RTMS readiness + revue ops prioritaire. Coaching indicatif.",
};

export default function GreenReadinessPage() {
  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="P1 · Readiness MRR"
        title="File mensuelle de préparation RTMS"
        intro="Chaque mois : créneau ops, max 3 priorités, suivi des gaps documents. Indicatif — pas un conseil réglementé."
        compact
      />
      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6">
          <ul className="space-y-2 text-sm text-white/70">
            <li>— 1 revue mensuelle prioritaire</li>
            <li>— Alignement méthodologie RTMS publique</li>
            <li>— Résiliable à tout moment (Stripe)</li>
          </ul>
          <GreenP1CheckoutForm
            product={GREEN_READINESS_MRR_PRODUCT}
            priceLabel={`${GREEN_READINESS_MRR_EUR} € / mois`}
            cta={`Souscrire Readiness — ${GREEN_READINESS_MRR_EUR} €/mo`}
          />
          <Link
            href={GREEN_STANDARDS_ROUTE}
            className="mt-6 inline-block font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            Méthodologie RTMS →
          </Link>
        </div>
      </GreenPanel>
      <GreenDisclaimer>
        Abonnement coaching indicatif — ne remplace pas un audit ou un conseil juridique.
      </GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>← Hub Green</GreenBackLink>
    </div>
  );
}
