import type { Metadata } from "next";
import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { GREEN_ROUTE } from "@/lib/green";
import { GREEN_FAST_TRACK_PRODUCT } from "@/lib/green/p1-cash-pricing";
import { retrievePaidGreenP1Session } from "@/lib/stripe/green-p1-checkout";

export const metadata: Metadata = {
  title: "Fast Track — confirmation | AUROS",
  robots: { index: false, follow: false },
};

export default async function GreenFastTrackSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = session_id
    ? await retrievePaidGreenP1Session(session_id, GREEN_FAST_TRACK_PRODUCT)
    : null;

  return (
    <FocusPageShell path="/green/fast-track/success" width="2xl">
      <div className="space-y-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          Fast Track 24h
        </p>
        <h1 className="font-display text-3xl text-white">
          {session ? "Paiement reçu" : "Session Fast Track"}
        </h1>
        <p className="text-sm text-white/55">
          {session
            ? "Ops ouvre votre créneau sous ~24h ouvrées. Vous serez contacté — pas de certification auto."
            : "Si vous venez de payer, patientez quelques secondes."}
        </p>
        <PrimaryButton href={GREEN_ROUTE}>Hub Green</PrimaryButton>
        <Link
          href="mailto:hello@getauros.com"
          className="block font-mono text-[11px] text-white/40 hover:text-white/70"
        >
          hello@getauros.com
        </Link>
      </div>
    </FocusPageShell>
  );
}
