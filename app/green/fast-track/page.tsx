import type { Metadata } from "next";
import Link from "next/link";

import { GreenP1CheckoutForm } from "@/app/green/_components/GreenP1CheckoutForm";
import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";
import { GREEN_LABEL_ROUTE, GREEN_ROUTE } from "@/lib/green";
import {
  GREEN_FAST_TRACK_EUR,
  GREEN_FAST_TRACK_PRODUCT,
} from "@/lib/green/p1-cash-pricing";

export const metadata: Metadata = {
  title: "Fast Track 24h | AUROS Green",
  description:
    "Pré-diag RTMS prioritaire sous ~24h ouvrées — revue humaine, pas une certification.",
};

export default function GreenFastTrackPage() {
  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="P1 · Fast Track"
        title="Revue RTMS en 24h ouvrées"
        intro="File prioritaire pour dossiers prêts. Ops AUROS pré-vérifie — pas un audit tiers, pas un badge automatique."
        compact
      />
      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6">
          <ul className="space-y-2 text-sm text-white/70">
            <li>— Créneau prioritaire sous ~24h ouvrées</li>
            <li>— Feedback max 3 priorités RTMS</li>
            <li>— Suite possible : Listing Verified / Investor Room</li>
          </ul>
          <GreenP1CheckoutForm
            product={GREEN_FAST_TRACK_PRODUCT}
            priceLabel={`${GREEN_FAST_TRACK_EUR} € · one-shot`}
            cta={`Payer Fast Track — ${GREEN_FAST_TRACK_EUR} €`}
          />
          <Link
            href={GREEN_LABEL_ROUTE}
            className="mt-6 inline-block font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            Candidature label →
          </Link>
        </div>
      </GreenPanel>
      <GreenDisclaimer>
        Indicatif — pas un conseil réglementé ni une certification AMF/ESMA.
      </GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>← Hub Green</GreenBackLink>
    </div>
  );
}
