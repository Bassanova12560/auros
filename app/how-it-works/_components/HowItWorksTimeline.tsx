import { ContentFaqList } from "@/app/_components/ContentPageLayout";
import { StaticSectionHeader } from "@/app/_components/StaticSectionHeader";
import { DEFAULT_LOCALE, getMessages } from "@/lib/i18n";

/** SSR-friendly how-it-works timeline — no framer-motion opacity:0, native FAQ accordion. */
export function HowItWorksTimeline() {
  const t = getMessages(DEFAULT_LOCALE).howItWorks;

  const steps = [
    {
      step: "01",
      title: t.step1Title,
      desc: t.step1Desc,
      duration: t.step1Duration,
    },
    {
      step: "02",
      title: t.step2Title,
      desc: t.step2Desc,
      duration: t.step2Duration,
    },
    {
      step: "03",
      title: t.step3Title,
      desc: t.step3Desc,
      duration: t.step3Duration,
    },
  ] as const;

  return (
    <section id="how-it-works" className="border-t border-white/[0.06] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <StaticSectionHeader eyebrow={t.eyebrow} title={t.title} />

        <ol className="relative mt-14" aria-label={t.title}>
          {steps.map((item, index) => {
            const isLast = index === steps.length - 1;
            return (
              <li key={item.step} className="relative flex gap-5 md:gap-8">
                {!isLast ? (
                  <span
                    className="absolute left-[15px] top-10 bottom-0 w-px bg-white/[0.08] md:left-[19px]"
                    aria-hidden
                  />
                ) : null}
                <span
                  className="relative z-10 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/[0.12] font-mono text-[10px] text-white md:h-10 md:w-10"
                  aria-hidden
                >
                  {item.step}
                </span>
                <div className="min-w-0 flex-1 pb-10 md:pb-14">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <span className="font-mono text-[10px] text-white/35">
                      {item.duration}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
                  <div
                    className="mt-5 flex aspect-[16/10] w-full items-center justify-center rounded-xl border border-dashed border-white/[0.12] bg-white/[0.02] font-mono text-[11px] text-white/30"
                    role="img"
                    aria-label={t.screenshotPlaceholder}
                  >
                    {t.screenshotPlaceholder}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-16 border-t border-white/[0.06] pt-16">
          <h2 className="font-display text-xl font-semibold text-white">{t.faqTitle}</h2>
          <div className="mt-8">
            <ContentFaqList items={[...t.faq]} />
          </div>
        </div>
      </div>
    </section>
  );
}
