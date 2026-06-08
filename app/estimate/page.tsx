import type { Metadata } from "next";

import { FocusPageShell } from "@/app/_components/FocusPageShell";
import { ScorePreviewCard } from "@/app/_components/ScorePreviewCard";
import { ScoreWidgetForm } from "@/app/_components/ScoreWidgetForm";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { DEFAULT_LOCALE, getMessages } from "@/lib/i18n";
import { metadataFromPath } from "@/lib/seo/metadata";
import { withOgImage } from "@/lib/seo/og";

export const metadata: Metadata = withOgImage(
  metadataFromPath("/estimate"),
  "/estimate",
  "Score de préparation"
);

export default function EstimatePage() {
  const t = getMessages(DEFAULT_LOCALE);

  return (
    <FocusPageShell path="/estimate" width="6xl">
      <section id="score" className="scroll-mt-28 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <StaticSectionHeader
            eyebrow={t.score.eyebrow}
            title={t.score.title}
            subtitle={t.score.subtitle}
          />
          <p className="mx-auto mt-2 max-w-3xl text-center text-sm text-muted">
            {t.score.inputHint}
          </p>

          <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] lg:items-start lg:gap-10">
            <div>
              <noscript>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/35">
                  {t.score.quickExamplesLabel}
                </p>
                <ul className="mt-3 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {t.score.quickExamples.map((example) => (
                    <li
                      key={example}
                      className="rounded-full border border-white/10 px-4 py-2.5 font-mono text-[11px] text-white/55 sm:min-w-[200px] sm:flex-1"
                    >
                      {example}
                    </li>
                  ))}
                </ul>
              </noscript>
              <ScoreWidgetForm />
            </div>
            <ScorePreviewCard locale={DEFAULT_LOCALE} />
          </div>
        </div>
      </section>
    </FocusPageShell>
  );
}
