import type { Metadata } from "next";
import Link from "next/link";

import { GreenP1CheckoutForm } from "@/app/green/_components/GreenP1CheckoutForm";
import {
  GreenBackLink,
  GreenDisclaimer,
  GreenPageHeader,
  GreenPanel,
} from "@/app/green/_components/green-ui";
import { GREEN_MARKET_ROUTE, GREEN_ROUTE } from "@/lib/green";
import {
  GREEN_INVESTOR_ROOM_EUR,
  GREEN_INVESTOR_ROOM_PRODUCT,
} from "@/lib/green/p1-cash-pricing";

export const metadata: Metadata = {
  title: "Investor Room | AUROS Green",
  description:
    "Salle verified/pilot — matching data 30 jours. Pas de courtage.",
};

export default function GreenInvestorsPage() {
  return (
    <div className="page-inner page-inner--3xl mx-auto px-4 pb-20 pt-12 md:px-6">
      <GreenPageHeader
        eyebrow="P1 · Investor Room"
        title="Salle des listings vérifiés"
        intro="Accès 30 jours aux fiches Pilote / Verified pour due diligence indicative. Matching data — AUROS n’exécute aucun deal."
        compact
      />
      <GreenPanel className="mt-8">
        <div className="p-5 md:p-6">
          <ul className="space-y-2 text-sm text-white/70">
            <li>— Listings Pilote & Verified uniquement</li>
            <li>— Liens DNA / Proof Stream</li>
            <li>— Token d’accès après paiement (30 jours)</li>
          </ul>
          <GreenP1CheckoutForm
            product={GREEN_INVESTOR_ROOM_PRODUCT}
            priceLabel={`${GREEN_INVESTOR_ROOM_EUR} € · 30 jours`}
            cta={`Ouvrir Investor Room — ${GREEN_INVESTOR_ROOM_EUR} €`}
          />
          <Link
            href={GREEN_MARKET_ROUTE}
            className="mt-6 inline-block font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            Marché public →
          </Link>
        </div>
      </GreenPanel>
      <GreenDisclaimer>
        Pas un conseil d’investissement. Pas de courtage. Indicatif uniquement.
      </GreenDisclaimer>
      <GreenBackLink href={GREEN_ROUTE}>← Hub Green</GreenBackLink>
    </div>
  );
}
