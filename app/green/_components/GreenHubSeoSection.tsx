"use client";

import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getGreenMessages } from "@/lib/green";

export function GreenHubSeoSection() {
  const { locale } = useLocale();
  const seo = getGreenMessages(locale).hub.seo;

  return (
    <section className="mt-14 border-t border-white/[0.06] pt-10 md:mt-16">
      <details className="group">
        <summary className="cursor-pointer list-none font-mono text-[11px] tracking-wide text-white/40 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white [&::-webkit-details-marker]:hidden">
          <span className="inline-flex items-center gap-2">
            <span className="text-white/30 transition group-open:rotate-90">▸</span>
            {seo.toggleLabel}
          </span>
        </summary>

        <div className="mt-8 max-w-3xl space-y-8 text-sm leading-relaxed text-white/50">
          {seo.sections.map((section) => (
            <article key={section.heading}>
              <h2 className="font-display text-lg font-semibold text-white/80">
                {section.heading}
              </h2>
              {section.body ? <p className="mt-3">{section.body}</p> : null}
              {section.subsections?.map((sub) => (
                <div key={sub.heading} className="mt-5">
                  <h3 className="font-display text-base font-medium text-white/65">
                    {sub.heading}
                  </h3>
                  <p className="mt-2">{sub.body}</p>
                </div>
              ))}
            </article>
          ))}
        </div>
      </details>
    </section>
  );
}
