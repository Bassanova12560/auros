import type { Metadata } from "next";
import Link from "next/link";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { retrievePaidMonitorSession } from "@/lib/stripe/monitor-checkout";
import { parseMonitorCheckoutMetadata } from "@/lib/stripe/monitor-checkout";
import { metadataFromPath } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  ...metadataFromPath("/developers/monitor/success"),
  title: "Monitor activé | AUROS Protocol",
  robots: { index: false, follow: false },
};

export default async function MonitorCheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  const session = sessionId ? await retrievePaidMonitorSession(sessionId) : null;
  const meta = session
    ? parseMonitorCheckoutMetadata((session.metadata ?? {}) as Record<string, string>)
    : null;

  return (
    <FocusPageShell path="/developers/monitor/success" width="2xl">
      <div className="space-y-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-amber-400/80">
          Monitor
        </p>
        <h1 className="font-display text-3xl font-medium text-white">
          {session
            ? `Monitor ${meta?.plan === "pro" ? "Pro" : "Starter"} activé`
            : "Paiement en cours de confirmation"}
        </h1>
        <p className="mx-auto max-w-lg text-sm text-white/55">
          {session
            ? "Votre clé API est passée au tier Monitor. Créez un monitor et consultez le Regulatory Twin delta."
            : "Si le paiement vient d’aboutir, rafraîchissez dans quelques secondes ou vérifiez votre email."}
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <PrimaryButton href="/developers/dashboard">Dashboard</PrimaryButton>
          <Link
            href="/developers/docs/endpoint-monitor"
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80"
          >
            Docs Monitor →
          </Link>
        </div>
      </div>
    </FocusPageShell>
  );
}
