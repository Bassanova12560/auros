import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { ArlLabWallet } from "@/app/_components/arl/ArlLabWallet";

export const metadata: Metadata = {
  title: "WATT — Energy stablecoin for machines | AUROS",
  description:
    "WATT is AUROS’s energy unit-of-account design: 1:1 collateralized by verified akWh. Preview — not a public sale.",
};

export default function WattPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/watt" />
      <FocusPageShell path="/watt" width="4xl">
        <ContentPageLayout
          product="Resource Layer"
          eyebrow="WATT · Preview"
          title="Energy as money for machines"
          intro="WATT is the energy stablecoin design at the center of ARL: collateralized by verified energy tokens (1:1 MVP intent). Not a public offering on this site."
        >
          <div className="space-y-10 text-sm leading-relaxed text-white/65">
            <ArlLabWallet step="convert" />

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">What it is</h2>
              <p>
                Machines whose survival cost is electricity need a unit that settles in power — not
                only USD stables. WATT wraps attested <span className="text-white/85">akWh</span>{" "}
                into a redeemable energy unit of account (same economics as{" "}
                <code className="font-mono text-[11px] text-white/50">WattCoin.sol</code>).
              </p>
              <ul className="list-disc space-y-2 pl-5 text-white/55">
                <li>Mint akWh from production (lab or oracle-gated later)</li>
                <li>Wrap → WATT locks akWh 1:1 in vault</li>
                <li>Redeem burns WATT and returns akWh</li>
              </ul>
            </section>

            <section className="space-y-3 border border-amber-500/20 bg-amber-500/[0.05] px-4 py-4">
              <h2 className="font-display text-lg text-amber-100/90">Status (honest)</h2>
              <p className="text-amber-100/70">
                Protocol + docs + lab wallet preview. Roadmap launch window 2027+ when collateral,
                counsel, and pilots clear. This page is not a prospectus, TGE, or solicitation.
              </p>
            </section>

            <section className="flex flex-wrap gap-3">
              <PrimaryButton href="/producer">Wrap on Producer</PrimaryButton>
              <PrimaryButton href="/lab" variant="ghost">
                Energy Lab
              </PrimaryButton>
              <PrimaryButton href="/resource-layer#roadmap" variant="ghost">
                Roadmap
              </PrimaryButton>
              <PrimaryButton href="/resource-layer/faq#watt" variant="ghost">
                FAQ
              </PrimaryButton>
            </section>

            <p className="font-mono text-[10px] text-white/35">
              Also see{" "}
              <Link href="/resource-layer#watt" className="underline hover:text-white/60">
                /resource-layer#watt
              </Link>
            </p>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
