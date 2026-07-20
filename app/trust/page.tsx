import type { Metadata } from "next";

import { FocusPageHero } from "@/app/_components/FocusPageHero";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { ProfessionalTrustBar } from "@/app/_components/ProfessionalTrustBar";
import { RegulatoryTrust } from "@/app/_components/RegulatoryTrust";
import { TrustCaseStudies } from "@/app/_components/TrustCaseStudies";
import { TrustEnrichment } from "@/app/_components/TrustEnrichment";
import { TrustHowWeWork } from "@/app/_components/TrustHowWeWork";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { metadataFromPath } from "@/lib/seo/metadata";
import Link from "next/link";

export const metadata: Metadata = metadataFromPath("/trust");

export default function TrustPage() {
  return (
    <FocusPageShell path="/trust" width="6xl" className="!px-0">
      <FocusPageHero page="trust" secondaryHref="/jurisdictions" />
      <section className="mx-auto max-w-3xl px-4 md:px-6">
        <ProfessionalTrustBar variant="panel" />
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 md:px-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/40">
          Institutions · Risk desk
        </p>
        <h2 className="mt-3 font-display text-2xl text-white md:text-3xl">
          Preuves pour banques et grosses institutions
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/55">
          Evidence Pack hash-only, verify public, trail d&apos;éditions{" "}
          <code className="text-white/70">pack_hash</code>, reseal PQC schedule
          et checklist MiCA — sans ouvrir une data room.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <PrimaryButton href="/developers/institutions">
            Console institutions
          </PrimaryButton>
          <PrimaryButton href="/developers/shield/banks" variant="ghost">
            Pack banques
          </PrimaryButton>
          <Link
            href="/status"
            className="inline-flex min-h-[44px] items-center font-mono text-[11px] uppercase tracking-wider text-white/45 hover:text-white/70"
          >
            Status →
          </Link>
        </div>
      </section>

      <TrustHowWeWork />
      <TrustCaseStudies />
      <RegulatoryTrust />
      <TrustEnrichment />
    </FocusPageShell>
  );
}
