"use client";

import Link from "next/link";

import { AurosButton } from "@/app/_components/AurosButton";
import { ContentPageLayout } from "@/app/_components/ContentPageLayout";
import { useLocale } from "@/app/_components/i18n/LocaleProvider";
import { getCareersMessages } from "@/lib/i18n/pages/careers";

export function CareersPageContent() {
  const { locale } = useLocale();
  const m = getCareersMessages(locale);

  return (
    <ContentPageLayout
      product={m.product}
      eyebrow={m.eyebrow}
      title={m.title}
      intro={m.intro}
    >
      <ul className="space-y-6">
        {m.roles.map((role) => (
          <li
            key={role.title}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6"
          >
            <p className="font-mono text-[10px] uppercase text-white/40">{role.team}</p>
            <h2 className="mt-1 font-display text-lg font-medium text-white">{role.title}</h2>
            <p className="mt-2 text-sm text-white/60">{role.summary}</p>
            <p className="mt-3 text-sm text-white/45">
              <span className="font-mono text-[10px] uppercase tracking-wider text-white/30">
                {m.impactLabel}{" "}
              </span>
              {role.impact}
            </p>
            <p className="mt-3 font-mono text-[11px] text-white/40">{role.stack}</p>
            <p className="mt-4 font-mono text-[10px] text-white/30">{role.apply}</p>
            <p className="mt-4">
              <AurosButton href={role.mailto}>{m.applyRole}</AurosButton>
            </p>
          </li>
        ))}
      </ul>
      <p className="mt-10 text-sm text-white/55">
        {m.footerLead}{" "}
        <a
          href="mailto:careers@getauros.com"
          className="text-white/80 underline decoration-white/25 hover:text-white"
        >
          careers@getauros.com
        </a>
        . {m.footerWalkthrough}{" "}
        <Link href="/builders" className="underline hover:text-white">
          {m.footerBuilders}
        </Link>
        ,{" "}
        <Link href="/resource-layer" className="underline hover:text-white">
          {m.footerVision}
        </Link>
        ,{" "}
        <Link href="/blog/cross-exchange-risk-engine" className="underline hover:text-white">
          {m.footerEssay}
        </Link>
        .
      </p>
      <p className="mt-6">
        <AurosButton href="mailto:careers@getauros.com">{m.applyEmail}</AurosButton>
      </p>
    </ContentPageLayout>
  );
}
