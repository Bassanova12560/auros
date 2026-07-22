import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";

export const metadata: Metadata = {
  title: "Earn — Auros Resource Layer | AUROS",
  description: "Stake, lend, and provide liquidity across ARL pools.",
};

const CARDS = [
  { title: "Perps LP", body: "Seed EnergyFutures / ComputeFutures quote vaults.", href: "/trade" },
  { title: "Lending", body: "Deposit akWh or USDC into ResourceLendingPool.", href: "/trade" },
  { title: "Insurance capital", body: "Underwrite parametric production shortfall.", href: "/insure" },
] as const;

export default function EarnPage() {
  return (
    <FocusPageShell path="/earn" width="3xl">
      <ContentPageLayout
        product="Resource Layer"
        eyebrow="Earn · Demo"
        title="Provide capital to the flywheel"
        intro="LPs earn from trading fees, interest, and insurance premiums. Dashboards are indicative until wallet flows are wired."
      >
        <ul className="space-y-4">
          {CARDS.map((c) => (
            <li key={c.title} className="border-t border-white/10 pt-4">
              <Link href={c.href} className="font-display text-base text-white hover:underline">
                {c.title}
              </Link>
              <p className="mt-1 text-sm text-white/55">{c.body}</p>
            </li>
          ))}
        </ul>
      </ContentPageLayout>
    </FocusPageShell>
  );
}
