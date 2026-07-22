import type { Metadata } from "next";
import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { GREEN_ROUTE } from "@/lib/green";
import { GREEN_READINESS_MRR_PRODUCT } from "@/lib/green/p1-cash-pricing";
import { retrievePaidGreenP1Session } from "@/lib/stripe/green-p1-checkout";

export const metadata: Metadata = {
  title: "Readiness MRR — confirmation | AUROS",
  robots: { index: false, follow: false },
};

export default async function GreenReadinessSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = session_id
    ? await retrievePaidGreenP1Session(session_id, GREEN_READINESS_MRR_PRODUCT)
    : null;

  return (
    <FocusPageShell path="/green/readiness/success" width="2xl">
      <div className="space-y-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-emerald-400/80">
          Readiness MRR
        </p>
        <h1 className="font-display text-3xl text-white">
          {session ? "Abonnement actif" : "Session Readiness"}
        </h1>
        <p className="text-sm text-white/55">
          {session
            ? "Ops vous contacte pour le premier créneau mensuel. Résiliation via Stripe Customer Portal / e-mail."
            : "Si vous venez de payer, patientez quelques secondes."}
        </p>
        <PrimaryButton href={GREEN_ROUTE}>Hub Green</PrimaryButton>
        <Link
          href="/green/standards"
          className="block font-mono text-[11px] text-white/40 hover:text-white/70"
        >
          Standards RTMS →
        </Link>
      </div>
    </FocusPageShell>
  );
}
