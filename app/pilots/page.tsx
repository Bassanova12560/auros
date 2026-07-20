import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";

export const metadata: Metadata = {
  title: "Pilotes AUROS — flotte, banque, plateforme",
  description:
    "Kits de pilote : CFU flotte EV, Evidence Pack banque, issuer pipeline plateforme.",
};

const PILOTS = [
  {
    id: "fleet",
    title: "Flotte EV → CFU → Shield",
    who: "Opérateur de recharge / flotte",
    success: "Export CFU ?shield=1 + 10 taps vérifiés",
    href: "/developers/shield/case-study",
    cta: "Case study",
  },
  {
    id: "bank",
    title: "Banque → Evidence Pack",
    who: "Risk / crédit / ESG",
    success: "1 pack joint à un dossier crédit (hash-only)",
    href: "/developers/shield/banks",
    cta: "Kit banques",
  },
  {
    id: "platform",
    title: "Plateforme → issuer pipeline",
    who: "Petite place RWA",
    success: "3 dossiers dossier-ready soumis",
    href: "/partners",
    cta: "Partenaires",
  },
] as const;

export default function PilotsPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/pilots" />
      <FocusPageShell path="/pilots" width="3xl">
        <ContentPageLayout
          product="Pilotes"
          eyebrow="Go-to-market · 30 jours"
          title="Trois pilotes — pas dix features"
          intro="Mesurer l’adoption réelle : flotte, banque, plateforme. Le reste est amplification."
        >
          <ul className="space-y-6">
            {PILOTS.map((p) => (
              <li
                key={p.id}
                className="border-t border-white/[0.08] pt-5"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  {p.who}
                </p>
                <h2 className="mt-1 font-display text-lg text-white">{p.title}</h2>
                <p className="mt-2 text-sm text-white/55">
                  Succès : {p.success}
                </p>
                <div className="mt-3">
                  <Link
                    href={p.href}
                    className="text-sm text-white underline-offset-2 hover:underline"
                  >
                    {p.cta} →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <PrimaryButton href="/start">Commencer en 4 min</PrimaryButton>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
