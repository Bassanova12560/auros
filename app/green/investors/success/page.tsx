import type { Metadata } from "next";
import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { grantInvestorRoomAccess } from "@/lib/green/investor-room-access";
import { GREEN_INVESTOR_ROOM_PRODUCT } from "@/lib/green/p1-cash-pricing";
import {
  parseGreenP1CheckoutMetadata,
  retrievePaidGreenP1Session,
} from "@/lib/stripe/green-p1-checkout";

export const metadata: Metadata = {
  title: "Investor Room — confirmation | AUROS",
  robots: { index: false, follow: false },
};

export default async function GreenInvestorsSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = session_id
    ? await retrievePaidGreenP1Session(session_id, GREEN_INVESTOR_ROOM_PRODUCT)
    : null;

  let roomHref: string | null = null;
  if (session) {
    const meta = parseGreenP1CheckoutMetadata(
      (session.metadata ?? {}) as Record<string, string>
    );
    if (meta) {
      const access = grantInvestorRoomAccess({
        email: meta.email,
        company: meta.company,
        sessionId: session.id,
      });
      roomHref = `/green/investors/room?token=${encodeURIComponent(access.token)}`;
    }
  }

  return (
    <FocusPageShell path="/green/investors/success" width="2xl">
      <div className="space-y-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          Investor Room
        </p>
        <h1 className="font-display text-3xl text-white">
          {session ? "Accès prêt" : "Session Investor Room"}
        </h1>
        <p className="text-sm text-white/55">
          {session
            ? "Conservez le lien ci-dessous — valable 30 jours. Matching data uniquement."
            : "Si vous venez de payer, patientez quelques secondes."}
        </p>
        {roomHref ? (
          <PrimaryButton href={roomHref}>Entrer dans la salle</PrimaryButton>
        ) : (
          <PrimaryButton href="/green/investors">Retour</PrimaryButton>
        )}
        <Link
          href="/green/market?tier=verified"
          className="block font-mono text-[11px] text-white/40 hover:text-white/70"
        >
          Marché verified →
        </Link>
      </div>
    </FocusPageShell>
  );
}
