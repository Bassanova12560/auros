"use client";

import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { NextStepStrip } from "@/app/_components/NextStepStrip";
import { PrimaryButton } from "@/app/_components/ui/PrimaryButton";
import { getInvestorsMessages } from "@/lib/i18n/pages/investors";

const STACK_PRE = `protocol/     Solidity (Hardhat, OZ UUPS)
agent-api/    TypeScript · Express · ethers v6
iot-bridge/   MQTT → oracle pipeline
app/          Next.js · getauros.com + lab ledger`;

export function InvestorsPageContent() {
  const { locale } = useLocale();
  const m = getInvestorsMessages(locale);

  return (
    <ContentPageLayout
      product={m.product}
      eyebrow={m.eyebrow}
      title={m.title}
      intro={m.intro}
    >
      <div className="space-y-12 text-sm leading-relaxed text-white/65">
        <section className="flex flex-wrap gap-3">
          <PrimaryButton href="mailto:resources@getauros.com?subject=AUROS%20diligence">
            {m.ctaDiligence}
          </PrimaryButton>
          <PrimaryButton href="/lab" variant="ghost">
            {m.ctaLab}
          </PrimaryButton>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-white">{m.thesisTitle}</h2>
          <ul className="list-disc space-y-2 pl-5">
            {m.thesis.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl text-white">{m.surfacesTitle}</h2>
          <p className="text-white/50">{m.surfacesIntro}</p>
          <ul className="divide-y divide-white/[0.06] border border-white/[0.08]">
            {m.surfaces.map((s) => (
              <li
                key={s.href}
                className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr_1fr] sm:items-center sm:gap-4"
              >
                <Link
                  href={s.href}
                  className="font-mono text-[11px] text-white/80 underline-offset-2 hover:underline"
                >
                  {s.href}
                </Link>
                <span className="text-white/85">{s.label}</span>
                <span className="font-mono text-[10px] text-white/40">{s.status}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-white">{m.twoProductsTitle}</h2>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <Link href="/start" className="underline-offset-2 hover:underline">
                {m.dossierLead}
              </Link>{" "}
              {m.dossierMid}{" "}
              <Link href="/compare" className="underline-offset-2 hover:underline">
                {m.surfaces.find((s) => s.href === "/compare")?.label ?? "RWA comparator"}
              </Link>{" "}
              {m.dossierTail}
            </li>
            <li>
              <Link href="/resource-layer" className="underline-offset-2 hover:underline">
                {m.arlLead}
              </Link>{" "}
              {m.arlTail}
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-white">{m.stackTitle}</h2>
          <pre className="overflow-x-auto border border-white/[0.08] bg-black/40 p-4 font-mono text-[10px] leading-5 text-white/55">
            {STACK_PRE}
          </pre>
          <p className="font-mono text-[10px] text-white/35">
            {m.repoLabel} ·{" "}
            <a
              href="https://github.com/Bassanova12560/auros"
              className="underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/Bassanova12560/auros
            </a>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-white">{m.businessTitle}</h2>
          <p className="font-mono text-[10px] uppercase tracking-wider text-amber-200/70">
            {m.businessHypothesis}
          </p>
          <ul className="list-disc space-y-2 pl-5">
            {m.business.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-white">{m.moatTitle}</h2>
          <ol className="list-decimal space-y-2 pl-5">
            {m.moat.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl text-white">{m.risksTitle}</h2>
          <ul className="list-disc space-y-2 pl-5">
            {m.risks.map((item) => (
              <li key={item}>{item}</li>
            ))}
            <li>
              {m.riskBuildersLead}{" "}
              <Link href="/builders" className="underline-offset-2 hover:underline">
                /builders
              </Link>
            </li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-8">
          <h2 className="font-display text-xl text-white">{m.askTitle}</h2>
          <p>{m.askBody}</p>
          <ul className="space-y-2 font-mono text-[12px]">
            <li>
              <a
                href="mailto:resources@getauros.com"
                className="underline-offset-2 hover:underline"
              >
                resources@getauros.com
              </a>{" "}
              {m.contactProduct}
            </li>
            <li>
              <a href="mailto:legal@auros.app" className="underline-offset-2 hover:underline">
                legal@auros.app
              </a>{" "}
              {m.contactLegal}
            </li>
          </ul>
          <p className="font-mono text-[10px] text-white/35">
            {m.notOffer}{" "}
            <Link href="/green/investors" className="underline-offset-2 hover:underline">
              {m.greenDiligence}
            </Link>
            .
          </p>
        </section>

        <NextStepStrip preset="company" />
      </div>
    </ContentPageLayout>
  );
}
