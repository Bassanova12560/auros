import type { Metadata } from "next";
import Link from "next/link";

import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { AiFirstPageJsonLd } from "@/app/_components/ai-first/AiFirstPageJsonLd";

export const metadata: Metadata = {
  title: "Press — AUROS",
  description:
    "Press kit contact, brand facts, and downloadable narrative links. No fabricated media logos.",
};

const FACTS = [
  {
    label: "What we are",
    body: "AUROS — RWA preparation studio + Auros Resource Layer (tokenized metered resources, demos labeled).",
  },
  {
    label: "What we are not",
    body: "Not a bank, not a licensed energy offtaker, not a claim of audited exchange partnerships.",
  },
  {
    label: "Primary URLs",
    body: "getauros.com · /resource-layer · /builders · /lab · /trade",
  },
  {
    label: "Contact",
    body: "press@getauros.com (or resources@getauros.com) · legal@auros.app for diligence",
  },
] as const;

export default function PressPage() {
  return (
    <>
      <AiFirstPageJsonLd path="/press" />
      <FocusPageShell path="/press" width="3xl">
        <ContentPageLayout
          product="AUROS"
          eyebrow="Press"
          title="Media & diligence desk"
          intro="Minimal kit. We do not display invented newspaper logos. Ask for quotes, screenshots, and entity docs in writing."
        >
          <div className="space-y-10 text-sm leading-relaxed text-white/65">
            <ul className="space-y-5">
              {FACTS.map((f) => (
                <li key={f.label} className="border-t border-white/10 pt-4">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                    {f.label}
                  </p>
                  <p className="mt-1 text-white/75">{f.body}</p>
                </li>
              ))}
            </ul>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Media kit (minimal)</h2>
              <ul className="space-y-2 font-mono text-[12px]">
                <li>
                  <a
                    href="/auros-logo.svg"
                    download
                    className="underline-offset-2 hover:underline"
                  >
                    auros-logo.svg
                  </a>{" "}
                  — wordmark / logo
                </li>
                <li>
                  <Link href="/watt" className="underline-offset-2 hover:underline">
                    /watt
                  </Link>{" "}
                  — WATT product narrative
                </li>
                <li>
                  <Link href="/why" className="underline-offset-2 hover:underline">
                    /why
                  </Link>{" "}
                  — why Auros (benefit-first)
                </li>
                <li>
                  <Link href="/status" className="underline-offset-2 hover:underline">
                    /status
                  </Link>{" "}
                  — public endpoint probes
                </li>
              </ul>
              <p className="text-xs text-white/40">
                Team photos and entity pack on written request — we do not invent registration
                numbers on this page.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="font-display text-xl text-white">Narrative links</h2>
              <ul className="space-y-2 font-mono text-[12px]">
                <li>
                  <Link href="/resource-layer" className="underline-offset-2 hover:underline">
                    /resource-layer
                  </Link>{" "}
                  — vision
                </li>
                <li>
                  <Link href="/builders" className="underline-offset-2 hover:underline">
                    /builders
                  </Link>{" "}
                  — architecture & repo
                </li>
                <li>
                  <Link href="/blog/cross-exchange-risk-engine" className="underline-offset-2 hover:underline">
                    Risk engine essay
                  </Link>
                </li>
                <li>
                  <Link href="/legal" className="underline-offset-2 hover:underline">
                    /legal
                  </Link>{" "}
                  — notices
                </li>
              </ul>
            </section>

            <a
              href="mailto:resources@getauros.com?subject=Press%20%2F%20diligence%20request"
              className="inline-flex font-mono text-[11px] text-white/55 underline-offset-4 hover:text-white hover:underline"
            >
              Request quote pack / screenshots →
            </a>
          </div>
        </ContentPageLayout>
      </FocusPageShell>
    </>
  );
}
