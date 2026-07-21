import type { Metadata } from "next";
import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { GREEN_MARKET_ROUTE, GREEN_RTMS_ASSISTANT_ROUTE } from "@/lib/green";
import { GREEN_MARKET_VERIFIED_PRODUCT } from "@/lib/green/market-cash-pricing";
import { retrievePaidGreenMarketSession } from "@/lib/stripe/green-market-cash-checkout";

export const metadata: Metadata = {
  title: "Verified listing | AUROS Green",
  robots: { index: false, follow: false },
};

export default async function GreenMarketVerifiedSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const session = sessionId
    ? await retrievePaidGreenMarketSession(
        sessionId,
        GREEN_MARKET_VERIFIED_PRODUCT
      )
    : null;

  return (
    <FocusPageShell path="/green/market/verified/success" width="2xl">
      <div className="space-y-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          Listing Verified
        </p>
        <h1 className="font-display text-3xl text-white">
          {session ? "Demande reçue" : "Session Verified"}
        </h1>
        <p className="text-sm leading-relaxed text-white/55">
          {session
            ? "Paiement confirmé. Ops active le badge Verified après revue humaine / RTMS — pas de certification automatique."
            : "Si vous venez de payer, patientez quelques secondes et vérifiez votre e-mail Stripe."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href={GREEN_RTMS_ASSISTANT_ROUTE}>
            Pré-diag RTMS
          </PrimaryButton>
          <Link
            href={GREEN_MARKET_ROUTE}
            className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            Marché →
          </Link>
        </div>
      </div>
    </FocusPageShell>
  );
}
