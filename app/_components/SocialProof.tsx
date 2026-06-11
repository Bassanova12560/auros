"use client";

import { useTranslations } from "./i18n/LocaleProvider";
import { SectionHeader } from "./ui/SectionHeader";

export function SocialProof() {
  const t = useTranslations();

  const stats = [
    { value: t.socialProof.statDossiers, label: t.socialProof.statDossiersLabel },
    {
      value: t.socialProof.statJurisdictions,
      label: t.socialProof.statJurisdictionsLabel,
    },
    { value: t.socialProof.statTime, label: t.socialProof.statTimeLabel },
    {
      value: t.socialProof.statPlatforms,
      label: t.socialProof.statPlatformsLabel,
    },
  ];

  const testimonials = [
    {
      quote: t.socialProof.t1quote,
      name: t.socialProof.t1name,
      role: t.socialProof.t1role,
    },
    {
      quote: t.socialProof.t2quote,
      name: t.socialProof.t2name,
      role: t.socialProof.t2role,
    },
    {
      quote: t.socialProof.t3quote,
      name: t.socialProof.t3name,
      role: t.socialProof.t3role,
    },
  ];

  return (
    <section className="border-t border-white/[0.06] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow={t.socialProof.eyebrow}
          title={t.socialProof.title}
        />

        <div className="green-hub-fade-in mt-10 grid gap-6 border-b border-white/[0.06] pb-14 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-semibold tabular-nums text-white">
                {s.value}
              </p>
              <p className="mt-2 font-mono text-[10px] text-white/35">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="green-hub-fade-in-delay mt-14 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="card-flat">
              <p className="text-sm leading-relaxed text-white/80">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-white/[0.06] pt-4">
                <span className="block text-sm font-medium text-white">
                  {item.name}
                </span>
                <span className="mt-1 block font-mono text-[10px] text-white/35">
                  {item.role}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
