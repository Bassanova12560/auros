import { DEFAULT_LOCALE, getMessages } from "@/lib/i18n";

/** SSR-friendly regulatory trust grid — no framer-motion whileInView opacity:0. */
export function RegulatoryTrust() {
  const t = getMessages(DEFAULT_LOCALE).regulatory;

  const items = [
    { title: t.kyc, desc: t.kycDesc },
    { title: t.jurisdictions, desc: t.jurisdictionsDesc },
    { title: t.indicative, desc: t.indicativeDesc },
    { title: t.partners, desc: t.partnersDesc },
  ];

  return (
    <section className="border-t border-white/[0.06] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/40">
          {t.eyebrow}
        </p>
        <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight text-white md:text-3xl">
          {t.title}
        </h2>
        <p className="mt-3 max-w-2xl text-muted">{t.subtitle}</p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5"
            >
              <h3 className="font-mono text-[11px] uppercase tracking-[0.18em] text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 border-t border-white/[0.06] pt-6 font-mono text-[10px] leading-relaxed tracking-wide text-white/35">
          {t.disclaimer}
        </p>
      </div>
    </section>
  );
}
