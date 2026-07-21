import type { Metadata } from "next";
import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { GREEN_MARKET_ROUTE } from "@/lib/green";
import { GREEN_MARKET_INTRO_PRODUCT } from "@/lib/green/market-cash-pricing";
import { retrievePaidGreenMarketSession } from "@/lib/stripe/green-market-cash-checkout";

export const metadata: Metadata = {
  title: "Intro confirmée | AUROS Green",
  robots: { index: false, follow: false },
};

export default async function GreenMarketIntroSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const session = sessionId
    ? await retrievePaidGreenMarketSession(sessionId, GREEN_MARKET_INTRO_PRODUCT)
    : null;

  return (
    <FocusPageShell path="/green/market/intro/success" width="2xl">
      <div className="space-y-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          Green Market
        </p>
        <h1 className="font-display text-3xl text-white">
          {session ? "Paiement reçu" : "Session intro"}
        </h1>
        <p className="text-sm leading-relaxed text-white/55">
          {session
            ? "AUROS ops revoit votre demande de mise en relation (matching data — pas de courtage). Vous serez recontacté si la connexion est possible."
            : "Si vous venez de payer, la confirmation peut prendre quelques secondes. Conservez votre e-mail de reçu Stripe."}
        </p>
        <PrimaryButton href={GREEN_MARKET_ROUTE}>Retour marché</PrimaryButton>
        <Link
          href="/green/assistant"
          className="block font-mono text-[11px] uppercase tracking-wider text-white/40 hover:text-white/65"
        >
          Assistant Green →
        </Link>
      </div>
    </FocusPageShell>
  );
}
