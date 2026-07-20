import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { DeveloperBrandMark } from "@/app/developers/_components/DeveloperBrandMark";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import {
  SHIELD_FREE_TAP_MONTHLY,
  getTapUsage,
  listReceiptsForExport,
  shieldPlanFromPremium,
  shieldTapLimit,
} from "@/lib/shield";
import { checkPremiumAccess } from "@/lib/protocol/auth/premium";
import { findKeyRecord, validateApiKey } from "@/lib/protocol/auth/keys";

export const metadata: Metadata = {
  title: "Shield quota dashboard | AUROS",
  description: "Taps restants, receipts récents, upgrade Evidence Pack.",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ key?: string }>;

export default async function ShieldDashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const rawKey = params.key?.trim();

  let error: string | null = null;
  let plan: "free" | "premium" = "free";
  let used = 0;
  let limit = SHIELD_FREE_TAP_MONTHLY;
  let month = "";
  let receipts: ReturnType<typeof listReceiptsForExport> = [];

  if (!rawKey) {
    error = "Ajoutez ?key=votre_clé_api pour voir le quota Shield.";
  } else {
    const validation = await validateApiKey(rawKey);
    if (!validation.valid || !validation.keyHash) {
      error = "Clé API invalide";
    } else {
      const record = await findKeyRecord(validation.keyHash);
      const premium = checkPremiumAccess(rawKey, record);
      plan = shieldPlanFromPremium(premium.allowed);
      limit = shieldTapLimit(plan);
      const usage = getTapUsage(validation.keyHash);
      used = usage.count;
      month = usage.month;
      receipts = listReceiptsForExport(15, validation.keyHash);
    }
  }

  const remaining = Math.max(0, limit - used);

  return (
    <FocusPageShell path="/developers/shield/dashboard" width="2xl">
      <DeveloperBrandMark />
      <ContentPageLayout
        eyebrow="AUROS Shield"
        title="Quota & receipts"
        intro="Vue simple : taps du mois, preuves récentes, CTA Premium pour l’Evidence Pack."
      >
        {error ? (
          <p className="text-sm text-amber-400/90">{error}</p>
        ) : (
          <div className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="font-mono text-[10px] text-emerald-400/80">Ce mois</p>
                <p className="mt-1 font-display text-2xl text-white">
                  {used} / {limit}
                </p>
                <p className="text-xs text-white/40">{month}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-emerald-400/80">Restants</p>
                <p className="mt-1 font-display text-2xl text-white">{remaining}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] text-emerald-400/80">Plan</p>
                <p className="mt-1 font-display text-2xl text-white">{plan}</p>
              </div>
            </div>

            {plan === "free" ? (
              <div className="space-y-3 border-t border-white/[0.08] pt-6">
                <p className="text-sm text-white/60">
                  Premium = Evidence Pack banque + audit log + reseal PQC + taps illimités.
                </p>
                <PrimaryButton href="/developers#monitor">
                  Passer Premium
                </PrimaryButton>
              </div>
            ) : (
              <p className="text-sm text-white/55">
                API : <code>GET /api/v1/shield/audit</code> ·{" "}
                <code>POST /api/v1/shield/pack</code> ·{" "}
                <code>POST /api/v1/shield/reseal</code>
              </p>
            )}

            <section className="space-y-3 border-t border-white/[0.08] pt-6">
              <h2 className="font-display text-lg text-white">Receipts récents</h2>
              {receipts.length === 0 ? (
                <p className="text-sm text-white/45">
                  Aucun tap encore.{" "}
                  <Link href="/developers/shield#essayer" className="underline">
                    Essayer maintenant
                  </Link>
                </p>
              ) : (
                <ul className="space-y-2 font-mono text-[11px] text-white/55">
                  {receipts.map((r) => (
                    <li key={r.id} className="flex flex-wrap gap-x-3 gap-y-1">
                      <span className="text-white/80">{r.id}</span>
                      <span>{r.created_at.slice(0, 19)}</span>
                      <a href={r.verify_url} className="underline">
                        verify
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        )}

        <p className="mt-10 text-xs text-white/40">
          Ne partagez jamais une clé live dans une URL publique. Préférez{" "}
          <code>GET /api/v1/shield/quota</code> côté serveur.
        </p>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
